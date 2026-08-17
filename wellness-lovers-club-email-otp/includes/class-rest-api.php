<?php
/**
 * REST API Controller for WLC Email OTP
 *
 * Namespace: wlc-otp/v1
 *
 * Endpoints:
 *  - POST /wp-json/wlc-otp/v1/send
 *  - POST /wp-json/wlc-otp/v1/verify
 *  - POST /wp-json/wlc-otp/v1/resend
 *  - POST /wp-json/wlc-otp/v1/status
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Email_OTP_REST_API {

    const NAMESPACE = 'wlc-otp/v1';

    /**
     * Allowed frontend origins for CORS
     */
    private static function get_allowed_origins() {
        return array(
            'https://wellnessloversclub.com',
            'https://www.wellnessloversclub.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
        );
    }

    /**
     * Register REST API routes
     */
    public static function register_routes() {
        // 1. POST /wp-json/wlc-otp/v1/send
        register_rest_route( self::NAMESPACE, '/send', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( __CLASS__, 'handle_send' ),
            'permission_callback' => '__return_true',
        ) );

        // 2. POST /wp-json/wlc-otp/v1/verify
        register_rest_route( self::NAMESPACE, '/verify', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( __CLASS__, 'handle_verify' ),
            'permission_callback' => '__return_true',
        ) );

        // 3. POST /wp-json/wlc-otp/v1/resend
        register_rest_route( self::NAMESPACE, '/resend', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( __CLASS__, 'handle_resend' ),
            'permission_callback' => '__return_true',
        ) );

        // 4. POST /wp-json/wlc-otp/v1/status
        register_rest_route( self::NAMESPACE, '/status', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( __CLASS__, 'handle_status' ),
            'permission_callback' => '__return_true',
        ) );
    }

    /**
     * Handle Send OTP Endpoint: POST /wp-json/wlc-otp/v1/send
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public static function handle_send( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $name  = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';

        if ( empty( $email ) ) {
            return new WP_Error( 'missing_email', 'Please provide a valid email address.', array( 'status' => 400 ) );
        }

        // Generate and record OTP
        $otp_result = WLC_Email_OTP_Service::create_otp( $email, $name );
        if ( is_wp_error( $otp_result ) ) {
            return $otp_result;
        }

        // Dispatch email via Brevo HTTPS API
        $email_sent = WLC_Email_OTP_Sender::send_otp_email(
            $email,
            $name,
            $otp_result['otp_plain'],
            $otp_result['expires_in_minutes']
        );

        if ( is_wp_error( $email_sent ) ) {
            return $email_sent;
        }

        return new WP_REST_Response( array(
            'success' => true,
            'message' => 'Verification code sent to your email.',
        ), 200 );
    }

    /**
     * Handle Verify OTP Endpoint: POST /wp-json/wlc-otp/v1/verify
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public static function handle_verify( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $otp   = isset( $params['otp'] ) ? sanitize_text_field( trim( $params['otp'] ) ) : '';

        if ( empty( $email ) || empty( $otp ) ) {
            return new WP_Error( 'missing_fields', 'Email and 6-digit OTP code are required.', array( 'status' => 400 ) );
        }

        $verify_result = WLC_Email_OTP_Service::verify_otp( $email, $otp );
        if ( is_wp_error( $verify_result ) ) {
            return $verify_result;
        }

        return new WP_REST_Response( array(
            'success'  => true,
            'verified' => true,
            'message'  => 'Email verified successfully.',
        ), 200 );
    }

    /**
     * Handle Resend OTP Endpoint: POST /wp-json/wlc-otp/v1/resend
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public static function handle_resend( $request ) {
        // Resend uses the same secure creation & delivery pipeline with 60s cooldown & 5/hr limits
        return self::handle_send( $request );
    }

    /**
     * Handle Status Check Endpoint: POST /wp-json/wlc-otp/v1/status
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public static function handle_status( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        if ( empty( $email ) ) {
            return new WP_Error( 'missing_email', 'Please provide a valid email address.', array( 'status' => 400 ) );
        }

        $status = WLC_Email_OTP_Service::get_status( $email );
        if ( is_wp_error( $status ) ) {
            return $status;
        }

        return new WP_REST_Response( $status, 200 );
    }

    /**
     * Manage CORS headers for Next.js frontend requests
     */
    public static function init_cors() {
        $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';
        $allowed = self::get_allowed_origins();

        if ( in_array( $origin, $allowed, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
            header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With' );
            header( 'Access-Control-Allow-Credentials: true' );
        }

        // Handle preflight OPTIONS request immediately
        if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
            status_header( 200 );
            exit;
        }
    }
}

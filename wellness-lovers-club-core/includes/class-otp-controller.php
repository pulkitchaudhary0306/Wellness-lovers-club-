<?php
/**
 * REST API OTP Controller for Wellness Lovers Club
 *
 * Implements:
 *  - POST /wp-json/custom/v1/send-otp
 *  - POST /wp-json/custom/v1/verify-otp
 *  - POST /wp-json/custom/v1/verify-email (Backward-compatible alias)
 *  - POST /wp-json/custom/v1/resend-otp
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_OTP_Controller {

    const NAMESPACE = 'custom/v1';

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
        add_action( 'rest_api_init', array( $this, 'handle_cors' ), 15 );
    }

    /**
     * Manage CORS headers for Next.js frontend
     */
    public function handle_cors() {
        $allowed = array(
            'https://wellnessloversclub.com',
            'https://www.wellnessloversclub.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
        );
        $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';
        if ( in_array( $origin, $allowed, true ) ) {
            header( "Access-Control-Allow-Origin: {$origin}" );
            header( "Access-Control-Allow-Methods: POST, GET, OPTIONS" );
            header( "Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With, Origin, Accept" );
            header( "Access-Control-Allow-Credentials: true" );
        }

        if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
            status_header( 200 );
            exit;
        }
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        register_rest_route( self::NAMESPACE, '/send-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $this, 'send_otp' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::NAMESPACE, '/verify-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $this, 'verify_otp' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::NAMESPACE, '/verify-email', array(
            'methods'             => 'POST',
            'callback'            => array( $this, 'verify_otp' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( self::NAMESPACE, '/resend-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $this, 'resend_otp' ),
            'permission_callback' => '__return_true',
        ) );
    }

    /**
     * Send OTP Endpoint: POST /wp-json/custom/v1/send-otp
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function send_otp( $request ) {
        $params = $request->get_json_params() ?: $request->get_body_params();

        $raw_email = isset( $params['email'] ) ? $params['email'] : ( isset( $params['identifier'] ) ? $params['identifier'] : '' );
        $email     = sanitize_email( strtolower( trim( (string) $raw_email ) ) );

        if ( empty( $email ) || ! is_email( $email ) ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'invalid_email',
                'message' => 'Please provide a valid email address.',
            ), 400 );
        }

        // Check if user exists and validate user_id association
        $user = get_user_by( 'email', $email );
        if ( ! empty( $params['user_id'] ) ) {
            $user_by_id = get_user_by( 'ID', absint( $params['user_id'] ) );
            if ( ! $user || ! $user_by_id || $user->ID !== $user_by_id->ID ) {
                return new WP_REST_Response( array(
                    'success' => false,
                    'code'    => 'user_not_found',
                    'message' => 'User not found.',
                ), 404 );
            }
        }

        if ( ! $user ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'user_not_found',
                'message' => 'User not found.',
            ), 404 );
        }

        // Check if already verified
        $is_verified = get_user_meta( $user->ID, 'wlc_email_verified', true );
        if ( $is_verified === '1' ) {
            return new WP_REST_Response( array(
                'success' => true,
                'code'    => 'already_verified',
                'message' => 'This email address is already verified.',
            ), 200 );
        }

        global $wpdb;
        $table = WLC_OTP_Database::get_table_name();
        $now   = current_time( 'mysql', true ); // UTC

        // Check cooldown (60 seconds)
        $latest = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$table} WHERE email = %s ORDER BY id DESC LIMIT 1",
                $email
            )
        );

        $cooldown_seconds = defined( 'WLC_OTP_RESEND_COOLDOWN' ) ? max( 1, intval( WLC_OTP_RESEND_COOLDOWN ) ) : 60;

        if ( $latest && ! empty( $latest->last_sent_at ) && $latest->status === 'pending' ) {
            $elapsed = time() - strtotime( $latest->last_sent_at );
            if ( $elapsed < $cooldown_seconds ) {
                $retry_after = $cooldown_seconds - $elapsed;
                return new WP_REST_Response( array(
                    'success'     => false,
                    'code'        => 'resend_cooldown',
                    'message'     => 'Please wait before requesting another code.',
                    'retry_after' => $retry_after,
                ), 429 );
            }
        }

        // Check hourly resend rate limit (max 5 sends/hour)
        $max_hourly   = defined( 'WLC_OTP_MAX_RESENDS_PER_HOUR' ) ? max( 1, intval( WLC_OTP_MAX_RESENDS_PER_HOUR ) ) : 5;
        $one_hour_ago = gmdate( 'Y-m-d H:i:s', time() - 3600 );
        $recent_count = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$table} WHERE email = %s AND created_at >= %s",
                $email,
                $one_hour_ago
            )
        );

        if ( intval( $recent_count ) >= $max_hourly ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'resend_limit_exceeded',
                'message' => 'Too many verification requests. Please try again later.',
            ), 429 );
        }

        // Invalidate previous pending OTPs for this email/user
        $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$table} SET status = 'expired' WHERE email = %s AND status = 'pending'",
                $email
            )
        );

        // Generate 6-digit numeric OTP and cryptographic hash
        $otp_plain  = (string) random_int( 100000, 999999 );
        $otp_hash   = wp_hash_password( $otp_plain );
        $expiry_min = WLC_Brevo_Email::get_expiration_minutes();
        $expires_at = gmdate( 'Y-m-d H:i:s', time() + ( $expiry_min * 60 ) );

        $resend_count = $latest ? intval( $latest->resend_count ) + 1 : 0;

        $inserted = $wpdb->insert(
            $table,
            array(
                'user_id'      => $user->ID,
                'email'        => $email,
                'otp_hash'     => $otp_hash,
                'expires_at'   => $expires_at,
                'attempts'     => 0,
                'max_attempts' => defined( 'WLC_OTP_MAX_ATTEMPTS' ) ? intval( WLC_OTP_MAX_ATTEMPTS ) : 5,
                'resend_count' => $resend_count,
                'last_sent_at' => $now,
                'created_at'   => $now,
                'verified_at'  => null,
                'status'       => 'pending',
            ),
            array( '%d', '%s', '%s', '%s', '%d', '%d', '%d', '%s', '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'db_error',
                'message' => 'Failed to initialize verification record.',
            ), 500 );
        }

        $row_id = $wpdb->insert_id;

        // Dispatch Email via Brevo HTTPS API
        $name_display = ! empty( $user->first_name ) ? $user->first_name : ( ! empty( $user->display_name ) ? $user->display_name : 'Member' );
        $brevo_res    = WLC_Brevo_Email::send_otp( $email, $name_display, $otp_plain );

        if ( empty( $brevo_res['success'] ) ) {
            // Invalidate/mark failed so undeliverable OTP is not left active
            $wpdb->update( $table, array( 'status' => 'failed' ), array( 'id' => $row_id ) );

            $err_code = isset( $brevo_res['code'] ) && $brevo_res['code'] === 'missing_api_key' ? 'missing_api_key' : 'email_send_failed';
            $err_msg  = $err_code === 'missing_api_key' ? 'Email delivery provider is not configured.' : 'Unable to send the verification email. Please try again later.';

            return new WP_REST_Response( array(
                'success' => false,
                'code'    => $err_code,
                'message' => $err_msg,
            ), 500 );
        }

        return new WP_REST_Response( array(
            'success'    => true,
            'message'    => 'Verification code sent successfully.',
            'expires_in' => $expiry_min * 60,
        ), 200 );
    }

    /**
     * Verify OTP Endpoint: POST /wp-json/custom/v1/verify-otp
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function verify_otp( $request ) {
        $params = $request->get_json_params() ?: $request->get_body_params();

        $raw_email = isset( $params['email'] ) ? $params['email'] : ( isset( $params['identifier'] ) ? $params['identifier'] : '' );
        $email     = sanitize_email( strtolower( trim( (string) $raw_email ) ) );
        $otp       = isset( $params['otp'] ) ? sanitize_text_field( trim( (string) $params['otp'] ) ) : '';

        if ( empty( $email ) || ! is_email( $email ) ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'invalid_email',
                'message' => 'Please provide a valid email address.',
            ), 400 );
        }

        if ( empty( $otp ) || ! preg_match( '/^\d{6}$/', $otp ) ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'invalid_otp_format',
                'message' => 'OTP must be a 6-digit number.',
            ), 400 );
        }

        global $wpdb;
        $table = WLC_OTP_Database::get_table_name();
        $now   = current_time( 'mysql', true );

        // Fetch latest pending OTP row for this email
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$table} WHERE email = %s AND status = 'pending' ORDER BY id DESC LIMIT 1",
                $email
            )
        );

        if ( ! $row ) {
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'invalid_otp',
                'message' => 'Invalid or expired verification code.',
            ), 400 );
        }

        // Check expiration
        if ( strtotime( $row->expires_at ) <= time() ) {
            $wpdb->update( $table, array( 'status' => 'expired' ), array( 'id' => $row->id ) );
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'otp_expired',
                'message' => 'This verification code has expired. Please request a new code.',
            ), 400 );
        }

        // Check max attempts
        $max_attempts = intval( $row->max_attempts ) ?: 5;
        if ( intval( $row->attempts ) >= $max_attempts ) {
            $wpdb->update( $table, array( 'status' => 'failed' ), array( 'id' => $row->id ) );
            return new WP_REST_Response( array(
                'success' => false,
                'code'    => 'otp_attempts_exceeded',
                'message' => 'Too many incorrect attempts. Please request a new code.',
            ), 429 );
        }

        // Cryptographically verify OTP
        $is_valid = wp_check_password( $otp, $row->otp_hash );

        if ( ! $is_valid ) {
            $new_attempts = intval( $row->attempts ) + 1;
            $wpdb->update(
                $table,
                array( 'attempts' => $new_attempts ),
                array( 'id' => $row->id )
            );

            if ( $new_attempts >= $max_attempts ) {
                $wpdb->update( $table, array( 'status' => 'failed' ), array( 'id' => $row->id ) );
                return new WP_REST_Response( array(
                    'success' => false,
                    'code'    => 'otp_attempts_exceeded',
                    'message' => 'Too many incorrect attempts.',
                ), 429 );
            }

            $remaining = $max_attempts - $new_attempts;
            return new WP_REST_Response( array(
                'success'            => false,
                'code'               => 'invalid_otp',
                'message'            => 'Invalid verification code.',
                'attempts_remaining' => $remaining,
            ), 400 );
        }

        // ─── OTP is Valid: Mark verified and invalidate so it cannot be reused ──
        $wpdb->update(
            $table,
            array(
                'status'      => 'verified',
                'verified_at' => $now,
            ),
            array( 'id' => $row->id )
        );

        // Update WordPress user meta
        $user_id = $row->user_id;
        if ( ! $user_id ) {
            $user = get_user_by( 'email', $email );
            if ( $user ) {
                $user_id = $user->ID;
            }
        }

        if ( $user_id ) {
            update_user_meta( $user_id, 'wlc_email_verified', '1' );
            update_user_meta( $user_id, 'email_verified', '1' );
            update_user_meta( $user_id, 'wlc_membership_status', 'Active' );
        }

        return new WP_REST_Response( array(
            'success' => true,
            'message' => 'Email verified successfully.',
        ), 200 );
    }

    /**
     * Resend OTP Endpoint: POST /wp-json/custom/v1/resend-otp
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function resend_otp( $request ) {
        // Resend uses the send_otp handler with fresh OTP generation, 60s cooldown, and 5/hr limits
        return $this->send_otp( $request );
    }
}

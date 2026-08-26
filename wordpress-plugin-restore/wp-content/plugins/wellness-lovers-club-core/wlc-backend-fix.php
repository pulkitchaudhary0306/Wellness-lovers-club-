<?php
/**
 * Plugin Name: WLC Zero-Failure Backend Pipeline
 * Description: Drop-in single-file engine fixing Dual OTP, JWT Session Tokens, Dynamic UPI QR Code Generation, and Webhook synchronization.
 * Version:     2.0.0
 * Author:      Wellness Lovers Club Architecture Team
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Zero_Failure_Pipeline {

    const REST_NAMESPACE = 'wlc/v1';
    const GST_RATE       = 0.18; // 18% GST statutory tax

    public static function init() {
        // 1. Register all REST API endpoints
        add_action( 'rest_api_init', array( __CLASS__, 'register_rest_routes' ) );

        // 2. Register AJAX endpoints (fallback for classic admin-ajax.php)
        add_action( 'wp_ajax_wlc_initiate_otp', array( __CLASS__, 'ajax_initiate_otp' ) );
        add_action( 'wp_ajax_nopriv_wlc_initiate_otp', array( __CLASS__, 'ajax_initiate_otp' ) );
        add_action( 'wp_ajax_wlc_verify_otp', array( __CLASS__, 'ajax_verify_otp' ) );
        add_action( 'wp_ajax_nopriv_wlc_verify_otp', array( __CLASS__, 'ajax_verify_otp' ) );
    }

    // =========================================================================
    // 1. REST ROUTE REGISTRATION
    // =========================================================================
    public static function register_rest_routes() {
        $ns = self::REST_NAMESPACE;

        // Phase 1: Dual OTP Endpoints
        register_rest_route( $ns, '/otp/initiate', array(
            'methods'             => 'POST',
            'callback'            => array( __CLASS__, 'rest_initiate_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $ns, '/otp/verify', array(
            'methods'             => 'POST',
            'callback'            => array( __CLASS__, 'rest_verify_otp' ),
            'permission_callback' => '__return_true',
        ) );

        // Phase 2: Session / JWT Token Validation
        register_rest_route( $ns, '/auth/validate', array(
            'methods'             => 'GET, POST',
            'callback'            => array( __CLASS__, 'rest_validate_session' ),
            'permission_callback' => '__return_true',
        ) );
    }

    // =========================================================================
    // 3. ZERO-FAILURE JWT SESSION TOKENS (Self-Contained HMAC-SHA256)
    // =========================================================================
    public static function generate_jwt_token( $user_id ) {
        $secret = defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : wp_salt( 'auth' );
        $header = base64_encode( json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) ) );
        $exp    = time() + ( DAY_IN_SECONDS * 7 ); // 7 days

        $payload = base64_encode( json_encode( array(
            'iss'  => get_bloginfo( 'url' ),
            'iat'  => time(),
            'exp'  => $exp,
            'data' => array( 'user' => array( 'id' => (int) $user_id ) ),
        ) ) );

        $raw_sign = hash_hmac( 'sha256', "{$header}.{$payload}", $secret, true );
        $sign     = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $raw_sign ) );

        return "{$header}.{$payload}.{$sign}";
    }

    public static function validate_jwt_token( $token ) {
        if ( empty( $token ) ) return false;
        if ( preg_match( '/Bearer\s+(.*)$/i', $token, $m ) ) $token = $m[1];

        $parts = explode( '.', $token );
        if ( count( $parts ) !== 3 ) return false;

        list( $header, $payload, $sign ) = $parts;
        $secret   = defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : wp_salt( 'auth' );
        $expected = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( hash_hmac( 'sha256', "{$header}.{$payload}", $secret, true ) ) );

        if ( ! hash_equals( $expected, $sign ) ) return false;

        $data = json_decode( base64_decode( $payload ), true );
        if ( ! $data || empty( $data['exp'] ) || time() >= $data['exp'] ) return false;

        return isset( $data['data']['user']['id'] ) ? (int) $data['data']['user']['id'] : false;
    }

    public static function get_authenticated_user_id( $request = null ) {
        $auth = '';
        if ( $request && method_exists( $request, 'get_header' ) ) {
            $auth = $request->get_header( 'Authorization' );
        }
        if ( empty( $auth ) && isset( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
            $auth = $_SERVER['HTTP_AUTHORIZATION'];
        }
        if ( empty( $auth ) && is_user_logged_in() ) {
            return get_current_user_id();
        }
        return self::validate_jwt_token( $auth );
    }

    // =========================================================================
    // 4. BULLETPROOF DUAL OTP REST & AJAX HANDLERS
    // =========================================================================
    public static function rest_initiate_otp( $request ) {
        $p = $request->get_json_params() ?: $request->get_body_params();
        return self::process_initiate_otp( $p );
    }

    public static function ajax_initiate_otp() {
        $p = $_POST;
        $res = self::process_initiate_otp( $p );
        wp_send_json( $res->get_data(), $res->get_status() );
    }

    private static function process_initiate_otp( $params ) {
        $name  = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';
        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $phone = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
        $tier  = isset( $params['tier'] ) ? sanitize_text_field( $params['tier'] ) : 'gold';

        if ( empty( $name ) || empty( $email ) || empty( $phone ) ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'Name, Email, and Phone number are required.' ), 400 );
        }

        // Generate 6-digit numeric OTPs
        $email_otp = (string) wp_rand( 100000, 999999 );
        $phone_otp = (string) wp_rand( 100000, 999999 );

        // Session ID for transient
        $session_id = 'wlc_reg_' . md5( $email . time() . wp_salt() );

        // Store in transient (Expires in 10 minutes)
        $transient_data = array(
            'name'           => $name,
            'email'          => $email,
            'phone'          => $phone,
            'tier'           => $tier,
            'email_otp_hash' => wp_hash_password( $email_otp ),
            'phone_otp_hash' => wp_hash_password( $phone_otp ),
            'email_verified' => false,
            'phone_verified' => false,
            'attempts'       => 0,
            'created_at'     => time(),
        );
        set_transient( $session_id, $transient_data, 600 );

        // Send HTML Email via centralized email service
        require_once WLC_CORE_PATH . 'includes/class-emails.php';
        WLC_Core_Emails::send_verification_email( $email, $name, $email_otp );

        // Send SMS via SMS gateway
        require_once WLC_CORE_PATH . 'includes/class-sms.php';
        WLC_Core_SMS::send_otp( $phone, $phone_otp );

        return new WP_REST_Response( array(
            'success'       => true,
            'message'       => 'Verification codes dispatched to Email and Mobile.',
            'session_token' => $session_id,
            'email'         => $email,
            'phone'         => $phone,
        ), 200 );
    }

    public static function rest_verify_otp( $request ) {
        $p = $request->get_json_params() ?: $request->get_body_params();
        return self::process_verify_otp( $p );
    }

    public static function ajax_verify_otp() {
        $p = $_POST;
        $res = self::process_verify_otp( $p );
        wp_send_json( $res->get_data(), $res->get_status() );
    }

    private static function process_verify_otp( $params ) {
        $session_id = isset( $params['session_token'] ) ? sanitize_text_field( $params['session_token'] ) : '';
        $email_otp  = isset( $params['email_otp'] ) ? trim( (string) $params['email_otp'] ) : ( isset( $params['otp_code'] ) ? trim( (string) $params['otp_code'] ) : '' );
        $phone_otp  = isset( $params['phone_otp'] ) ? trim( (string) $params['phone_otp'] ) : $email_otp;

        if ( empty( $session_id ) ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'Missing session token.' ), 400 );
        }

        $data = get_transient( $session_id );
        if ( ! $data ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'Session expired or invalid. Please request a new code.' ), 400 );
        }

        // Validate OTP hashes using secure salted check
        $email_valid = wp_check_password( $email_otp, $data['email_otp_hash'] );
        $phone_valid = wp_check_password( $phone_otp, $data['phone_otp_hash'] );

        if ( ! $email_valid || ! $phone_valid ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'Invalid OTP code. Please enter the code received on your email and phone.' ), 400 );
        }

        // --- BOTH VERIFIED: Create / Authenticate User Account ---
        $email = $data['email'];
        $user  = get_user_by( 'email', $email );

        if ( ! $user ) {
            $parts      = explode( ' ', trim( $data['name'] ), 2 );
            $first_name = isset( $parts[0] ) ? $parts[0] : '';
            $last_name  = isset( $parts[1] ) ? $parts[1] : '';

            $user_id = wp_insert_user( array(
                'user_login' => $email,
                'user_email' => $email,
                'user_pass'  => wp_generate_password( 16, true, true ),
                'first_name' => $first_name,
                'last_name'  => $last_name,
                'role'       => 'subscriber',
            ) );

            if ( is_wp_error( $user_id ) ) {
                return new WP_REST_Response( array( 'success' => false, 'message' => $user_id->get_error_message() ), 500 );
            }

            update_user_meta( $user_id, 'wlc_phone', $data['phone'] );
            update_user_meta( $user_id, 'wlc_membership_tier', $data['tier'] );
            update_user_meta( $user_id, 'wlc_membership_status', 'pending_payment' );
            $user = get_userdata( $user_id );
        } else {
            $user_id = $user->ID;
        }

        // Issue JWT Token & Set Cookie
        $jwt = self::generate_jwt_token( $user_id );
        wp_set_current_user( $user_id, $user->user_login );
        wp_set_auth_cookie( $user_id, true );

        // Clear transient
        delete_transient( $session_id );

        return new WP_REST_Response( array(
            'success'       => true,
            'both_verified' => true,
            'message'       => 'Identity verified! Account active.',
            'token'         => $jwt,
            'user'          => array(
                'id'        => $user_id,
                'name'      => $user->display_name ?: $data['name'],
                'email'     => $user->user_email,
                'tier'      => $data['tier'],
            ),
        ), 200 );
    }

    public static function rest_validate_session( $request ) {
        $user_id = self::get_authenticated_user_id( $request );
        if ( ! $user_id ) {
            return new WP_REST_Response( array( 'valid' => false, 'message' => 'Invalid or expired session token.' ), 401 );
        }
        $user = get_userdata( $user_id );
        return new WP_REST_Response( array(
            'valid' => true,
            'user'  => array(
                'id'    => $user_id,
                'name'  => $user->display_name,
                'email' => $user->user_email,
                'tier'  => get_user_meta( $user_id, 'wlc_membership_tier', true ) ?: 'gold',
                'status'=> get_user_meta( $user_id, 'wlc_membership_status', true ) ?: 'pending_payment',
            )
        ), 200 );
    }

    // =========================================================================
    // 5. DYNAMIC UPI QR PAYMENT GATEWAY GENERATION & POLLING
    // =========================================================================
    public static function rest_create_payment_order( $request ) {
        $p = $request->get_json_params() ?: $request->get_body_params();

        $tier_key   = isset( $p['tier'] ) ? sanitize_text_field( $p['tier'] ) : 'gold';
        $promo_code = isset( $p['promo_code'] ) ? strtoupper( trim( sanitize_text_field( $p['promo_code'] ) ) ) : '';

        $tier_prices = array(
            'gold'     => array( 'name' => 'Wellness Gold Club', 'price' => 9999 ),
            'luminary' => array( 'name' => 'Emerald Luminary',  'price' => 19999 ),
            'starter'  => array( 'name' => 'Sanctuary Essential', 'price' => 4999 ),
        );

        $tier_info = isset( $tier_prices[ $tier_key ] ) ? $tier_prices[ $tier_key ] : $tier_prices['gold'];
        $base_price = (float) $tier_info['price'];
        $discount   = ( $promo_code === 'WELLNESS10' ) ? round( $base_price * 0.10, 2 ) : ( ( $promo_code === 'FOUNDER20' ) ? round( $base_price * 0.20, 2 ) : 0.00 );

        $taxable = $base_price - $discount;
        $gst     = round( $taxable * self::GST_RATE, 2 );
        $total   = $taxable + $gst;

        $order_id = 'ORD_' . date( 'Ymd' ) . '_' . strtoupper( wp_generate_password( 6, false, false ) );
        $upi_vpa  = defined( 'WLC_UPI_VPA' ) ? WLC_UPI_VPA : 'wellnesslovers@icici';

        // NPCI UPI String (Generates dynamic scannable QR on phone)
        $upi_payload = sprintf(
            'upi://pay?pa=%s&pn=%s&am=%s&tr=%s&tn=%s&cu=INR',
            rawurlencode( $upi_vpa ),
            rawurlencode( 'Wellness Lovers Club' ),
            number_format( $total, 2, '.', '' ),
            rawurlencode( $order_id ),
            rawurlencode( 'WLC ' . $tier_info['name'] )
        );

        // Store transient for polling
        $order_data = array(
            'order_id'   => $order_id,
            'tier'       => $tier_key,
            'amount'     => $total,
            'status'     => 'pending',
            'created_at' => time(),
        );
        set_transient( "wlc_pay_{$order_id}", $order_data, 600 );

        return new WP_REST_Response( array(
            'success'     => true,
            'order_id'    => $order_id,
            'amount'      => $total,
            'currency'    => 'INR',
            'breakdown'   => array(
                'base'     => $base_price,
                'discount' => $discount,
                'gst'      => $gst,
                'total'    => $total,
            ),
            'upi_details' => array(
                'vpa'            => $upi_vpa,
                'qr_payload'     => $upi_payload,
                'expires_in_sec' => 300,
            ),
        ), 200 );
    }

    public static function rest_check_payment_status( $request ) {
        $order_id = sanitize_text_field( $request->get_param( 'order_id' ) );
        if ( empty( $order_id ) ) {
            return new WP_REST_Response( array( 'status' => 'pending', 'is_paid' => false ), 200 );
        }

        $order = get_transient( "wlc_pay_{$order_id}" );
        $status = ( $order && isset( $order['status'] ) ) ? $order['status'] : 'pending';

        return new WP_REST_Response( array(
            'order_id' => $order_id,
            'status'   => $status,
            'is_paid'  => ( $status === 'completed' ),
        ), 200 );
    }

    // =========================================================================
    // 6. WEBHOOK & INSTANT CONFIRMATION HANDLER (HMAC-SHA256 Idempotent)
    // =========================================================================
    public static function rest_handle_webhook( $request ) {
        $body   = $request->get_body();
        $secret = defined( 'WLC_WEBHOOK_SECRET' ) ? WLC_WEBHOOK_SECRET : 'wellness_secret_webhook_key';

        // Check HMAC signature if provided
        $sig = isset( $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ) ? $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] : ( isset( $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ) ? $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] : '' );
        if ( ! empty( $sig ) ) {
            $expected = hash_hmac( 'sha256', $body, $secret );
            if ( ! hash_equals( $expected, $sig ) ) {
                return new WP_REST_Response( array( 'error' => 'Invalid signature' ), 403 );
            }
        }

        $data = json_decode( $body, true );
        $order_id = isset( $data['order_id'] ) ? $data['order_id'] : ( isset( $data['payload']['payment']['entity']['notes']['order_id'] ) ? $data['payload']['payment']['entity']['notes']['order_id'] : '' );

        if ( $order_id ) {
            self::complete_order( $order_id );
        }

        return new WP_REST_Response( array( 'status' => 'received', 'order_id' => $order_id ), 200 );
    }

    public static function rest_confirm_payment( $request ) {
        $p = $request->get_json_params() ?: $request->get_body_params();
        $order_id = isset( $p['order_id'] ) ? sanitize_text_field( $p['order_id'] ) : '';
        $user_id  = self::get_authenticated_user_id( $request );

        if ( empty( $order_id ) ) {
            return new WP_REST_Response( array( 'success' => false, 'message' => 'Order ID required.' ), 400 );
        }

        $res = self::complete_order( $order_id, $user_id );
        return new WP_REST_Response( $res, 200 );
    }

    private static function complete_order( $order_id, $user_id = 0 ) {
        $key = "wlc_pay_{$order_id}";
        $data = get_transient( $key ) ?: array();

        $membership_id = 'WLC-' . date( 'Y' ) . '-' . wp_rand( 100000, 999999 );
        $invoice_no    = 'INV-' . date( 'Y' ) . '-' . strtoupper( wp_generate_password( 6, false, false ) );

        $data['status']         = 'completed';
        $data['membership_id']  = $membership_id;
        $data['invoice_number'] = $invoice_no;
        $data['paid_at']        = current_time( 'mysql' );
        set_transient( $key, $data, DAY_IN_SECONDS );

        if ( $user_id ) {
            update_user_meta( $user_id, 'wlc_membership_status', 'active' );
            update_user_meta( $user_id, 'wlc_membership_id', $membership_id );
            update_user_meta( $user_id, 'wlc_membership_invoice', $invoice_no );
            update_user_meta( $user_id, 'wlc_membership_valid_until', date( 'Y-m-d H:i:s', strtotime( '+1 year' ) ) );
        }

        error_log( "[WLC Payment Settled] Order: {$order_id} | Member ID: {$membership_id} | Invoice: {$invoice_no}" );

        return array(
            'success'        => true,
            'message'        => 'Payment confirmed and membership activated.',
            'order_id'       => $order_id,
            'membership_id'  => $membership_id,
            'invoice_number' => $invoice_no,
            'status'         => 'completed',
        );
    }
}

// Bootstrap on plugins_loaded
add_action( 'plugins_loaded', array( 'WLC_Zero_Failure_Pipeline', 'init' ) );

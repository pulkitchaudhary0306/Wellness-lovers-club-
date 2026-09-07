<?php
/**
 * REST API Router and endpoint registration
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Global response helper if not already defined
if ( ! class_exists( 'Wellness_API_Response' ) ) {
    class Wellness_API_Response {
        public static function success( $data = array(), $status = 200 ) {
            return new WP_REST_Response( $data, $status );
        }

        public static function error( $code = 'error', $message = 'An error occurred', $status = 400, $additional_data = array() ) {
            $error_data = array( 'status' => $status );
            if ( ! empty( $additional_data ) ) {
                $error_data['data'] = $additional_data;
            }
            return new WP_Error( $code, $message, $error_data );
        }
    }
}

class WLC_Core_Router {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
        add_action( 'rest_api_init', array( $this, 'register_cors' ), 15 );
    }

    /**
     * CORS Filter setup with explicit production origin allowlist
     */
    public function register_cors() {
        remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
        add_filter( 'rest_pre_serve_request', array( __CLASS__, 'handle_cors' ), 15 );
    }

    public static function get_allowed_origins() {
        // Production Approved Origins
        $origins = array(
            'https://wellnessloversclub.com',
            'https://www.wellnessloversclub.com',
        );

        // Development origins (localhost / 127.0.0.1) enabled in development / non-production environments
        $is_production = ( function_exists( 'wp_get_environment_type' ) && wp_get_environment_type() === 'production' )
            || ( defined( 'WP_ENVIRONMENT_TYPE' ) && WP_ENVIRONMENT_TYPE === 'production' );

        if ( ! $is_production || ( defined( 'WLC_ALLOW_LOCALHOST' ) && WLC_ALLOW_LOCALHOST ) ) {
            $origins[] = 'http://localhost:3000';
            $origins[] = 'http://localhost:3001';
            $origins[] = 'http://127.0.0.1:3000';
            $origins[] = 'http://127.0.0.1:3001';
        }

        // 1. Support constant WLC_FRONTEND_URL or WLC_ALLOWED_ORIGINS (e.g. defined in wp-config.php)
        if ( defined( 'WLC_FRONTEND_URL' ) && ! empty( WLC_FRONTEND_URL ) ) {
            $frontend_url = rtrim( trim( WLC_FRONTEND_URL ), '/' );
            if ( ! in_array( $frontend_url, $origins, true ) ) {
                $origins[] = $frontend_url;
            }
        }

        if ( defined( 'WLC_ALLOWED_ORIGINS' ) && ! empty( WLC_ALLOWED_ORIGINS ) ) {
            if ( is_array( WLC_ALLOWED_ORIGINS ) ) {
                foreach ( WLC_ALLOWED_ORIGINS as $custom_origin ) {
                    $clean = rtrim( trim( $custom_origin ), '/' );
                    if ( ! empty( $clean ) && ! in_array( $clean, $origins, true ) ) {
                        $origins[] = $clean;
                    }
                }
            } elseif ( is_string( WLC_ALLOWED_ORIGINS ) ) {
                $split = explode( ',', WLC_ALLOWED_ORIGINS );
                foreach ( $split as $custom_origin ) {
                    $clean = rtrim( trim( $custom_origin ), '/' );
                    if ( ! empty( $clean ) && ! in_array( $clean, $origins, true ) ) {
                        $origins[] = $clean;
                    }
                }
            }
        }

        // 2. Support Environment Variables (getenv / $_ENV)
        $env_frontend = getenv( 'FRONTEND_URL' ) ?: getenv( 'NEXT_PUBLIC_SITE_URL' );
        if ( $env_frontend ) {
            $clean = rtrim( trim( $env_frontend ), '/' );
            if ( ! empty( $clean ) && ! in_array( $clean, $origins, true ) ) {
                $origins[] = $clean;
            }
        }

        // 3. Support WordPress database option
        $option_origin = get_option( 'wlc_frontend_url' );
        if ( ! empty( $option_origin ) ) {
            $clean = rtrim( trim( $option_origin ), '/' );
            if ( ! empty( $clean ) && ! in_array( $clean, $origins, true ) ) {
                $origins[] = $clean;
            }
        }

        // 4. WordPress filter hook for runtime extensibility
        return apply_filters( 'wlc_allowed_origins', $origins );
    }

    public static function handle_cors( $value ) {
        $allowed_origins = self::get_allowed_origins();
        $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? trim( $_SERVER['HTTP_ORIGIN'] ) : '';

        header( 'Vary: Origin' );

        $is_allowed = false;
        if ( $origin !== '' ) {
            $normalized_origin = strtolower( rtrim( $origin, '/' ) );
            foreach ( $allowed_origins as $allowed ) {
                if ( strtolower( rtrim( $allowed, '/' ) ) === $normalized_origin ) {
                    $is_allowed = true;
                    break;
                }
            }
        }

        if ( $is_allowed ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
            header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With, Origin, Accept, X-Razorpay-Signature, X-Webhook-Signature, X-Payment-Session' );
            header( 'Access-Control-Max-Age: 86400' );
        }

        if ( isset( $_SERVER['REQUEST_METHOD'] ) && strtoupper( $_SERVER['REQUEST_METHOD'] ) === 'OPTIONS' ) {
            if ( $is_allowed ) {
                status_header( 200 );
            } else {
                status_header( 403 );
            }
            exit;
        }

        return $value;
    }

    /**
     * Register REST API routes under namespaces
     */
    public function register_routes() {
        $namespace = 'custom/v1';

        $auth    = new WLC_Core_Auth_Controller();
        $profile = new WLC_Core_Profile_Controller();
        $contact = new WLC_Core_Contact_Controller();
        $news    = new WLC_Core_Newsletter_Controller();

        // ─── Public Custom Endpoints ────────────────────────────────────────
        register_rest_route( $namespace, '/register', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'register' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/login', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'login' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/forgot-password', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'forgot_password' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/reset-password', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'reset_password' ),
            'permission_callback' => '__return_true',
        ) );

        // ─── Razorpay Payment Gateway & Order Endpoints ─────────────────────────
        $payment = new WLC_Core_Payment_Controller();
        register_rest_route( $namespace, '/payment/config', array(
            'methods'             => 'GET',
            'callback'            => array( $payment, 'get_config' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/payment/create-order', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'create_order' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/payment/verify-payment', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'verify_payment' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/payment/verify', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'verify_payment' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/payment/check-status', array(
            'methods'             => 'GET',
            'callback'            => array( $payment, 'check_status' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/payment/webhook', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'handle_webhook' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/razorpay/create-order', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'create_order' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/razorpay/verify', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'verify_payment' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/razorpay/check-status', array(
            'methods'             => 'GET',
            'callback'            => array( $payment, 'check_status' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/razorpay/webhook', array(
            'methods'             => 'POST',
            'callback'            => array( $payment, 'handle_webhook' ),
            'permission_callback' => '__return_true',
        ) );


        // ─── Production Email OTP Verification Endpoints ─────────────────────────
        register_rest_route( $namespace, '/verify-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'verify_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/resend-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'resend_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/send-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'send_otp' ),
            'permission_callback' => '__return_true',
        ) );

        // Backward-compatible aliases for Email OTP
        register_rest_route( $namespace, '/send-email-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'send_email_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/verify-email-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'verify_email_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/resend-email-otp', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'resend_email_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/verify-email', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'verify_email_otp' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/resend-verification', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'resend_email_otp' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( $namespace, '/contact', array(
            'methods'             => 'POST',
            'callback'            => array( $contact, 'submit_contact' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/newsletter/subscribe', array(
            'methods'             => 'POST',
            'callback'            => array( $news, 'subscribe' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( $namespace, '/test-mail', array(
            'methods'             => 'POST',
            'callback'            => function( $request ) {
                $params = $request->get_json_params() ?: $request->get_body_params();
                $to     = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
                if ( empty( $to ) || ! is_email( $to ) ) {
                    return new WP_Error( 'invalid_email', 'Please provide a valid recipient email address.', array( 'status' => 400 ) );
                }

                $subject = 'WLC Native Mail Delivery Test';
                $body    = '<h3>Native Mail Test Successful</h3><p>This confirms that standard WordPress wp_mail() is working properly without SMTP errors.</p>';
                $headers = array(
                    'Content-Type: text/html; charset=UTF-8',
                    'From: Wellness Lovers Club <no-reply@wellnessloversclub.com>',
                );

                $last_error = null;
                $error_capture = function( $wp_error ) use ( &$last_error ) {
                    if ( is_wp_error( $wp_error ) ) {
                        $last_error = $wp_error->get_error_message();
                    }
                };
                add_action( 'wp_mail_failed', $error_capture );

                $sent = wp_mail( $to, $subject, $body, $headers );

                remove_action( 'wp_mail_failed', $error_capture );

                return new WP_REST_Response( array(
                    'success'  => (bool) $sent,
                    'message'  => $sent ? 'Test email accepted by server mail transport.' : ( $last_error ?: 'wp_mail failed.' ),
                    'provider' => 'native_wp_mail',
                ), 200 );
            },
            'permission_callback' => array( $this, 'require_admin_auth' ),
        ) );

        // ─── WLC Member Privileges & Partner Offers ─────────────────────────
        if ( class_exists( 'WLC_Core_Privileges_Controller' ) ) {
            $privileges = new WLC_Core_Privileges_Controller();
            register_rest_route( $namespace, '/privileges', array(
                'methods'             => 'GET',
                'callback'            => array( $privileges, 'get_privileges' ),
                'permission_callback' => '__return_true',
            ) );
            register_rest_route( $namespace, '/privileges/(?P<slug>[a-zA-Z0-9-]+)', array(
                'methods'             => 'GET',
                'callback'            => array( $privileges, 'get_privileges' ),
                'permission_callback' => '__return_true',
            ) );
        }

        // ─── Authenticated Custom Endpoints (Requires JWT) ───────────────────
        register_rest_route( $namespace, '/logout', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'logout' ),
            'permission_callback' => array( $this, 'require_auth' ),
        ) );
        register_rest_route( $namespace, '/change-password', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'change_password' ),
            'permission_callback' => array( $this, 'require_auth' ),
        ) );
        register_rest_route( $namespace, '/profile', array(
            array(
                'methods'             => 'GET',
                'callback'            => array( $profile, 'get_profile' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ),
            array(
                'methods'             => 'PUT',
                'callback'            => array( $profile, 'update_profile' ),
                'permission_callback' => array( $this, 'require_auth' ),
            )
        ) );
        register_rest_route( $namespace, '/membership', array(
            'methods'             => 'GET',
            'callback'            => array( $profile, 'get_membership' ),
            'permission_callback' => array( $this, 'require_auth' ),
        ) );
        register_rest_route( $namespace, '/membership-card', array(
            'methods'             => 'GET',
            'callback'            => array( $profile, 'get_membership_card' ),
            'permission_callback' => array( $this, 'require_auth' ),
        ) );
        register_rest_route( $namespace, '/admin/membership-card/(?P<user_id>\d+)', array(
            'methods'             => 'PUT',
            'callback'            => array( $profile, 'admin_update_membership_card' ),
            'permission_callback' => array( $this, 'require_admin_auth' ),
        ) );
        register_rest_route( $namespace, '/orders', array(
            'methods'             => 'GET',
            'callback'            => array( $profile, 'get_orders' ),
            'permission_callback' => array( $this, 'require_auth' ),
        ) );
        register_rest_route( $namespace, '/payments', array(
            'methods'             => 'GET',
            'callback'            => array( $profile, 'get_payments' ),
            'permission_callback' => array( $this, 'require_auth' ),
        ) );
    }

    /**
     * Route permission callback checking JWT validation
     */
    public function require_auth( $request ) {
        return WLC_Core_JWT::authenticate_request( $request );
    }

    /**
     * Route permission callback checking Administrator capability
     */
    public function require_admin_auth( $request ) {
        $auth_result = WLC_Core_JWT::authenticate_request( $request );
        if ( is_wp_error( $auth_result ) ) {
            return $auth_result;
        }
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error( 'forbidden', 'Administrator permissions required.', array( 'status' => 403 ) );
        }
        return true;
    }
}

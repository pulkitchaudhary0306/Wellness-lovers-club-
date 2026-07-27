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
     * CORS Filter setup for headless frontend compatibility
     */
    public function register_cors() {
        remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
        
        add_filter( 'rest_pre_serve_request', function( $value ) {
            if ( isset( $_SERVER['HTTP_ORIGIN'] ) ) {
                header( "Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN'] );
                header( "Access-Control-Allow-Credentials: true" );
            } else {
                header( "Access-Control-Allow-Origin: *" );
            }
            header( "Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS" );
            header( "Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With, Origin, Accept" );
            return $value;
        } );
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

        // ─── JWT Authentication fallback endpoints ─────────────────────────
        register_rest_route( 'jwt-auth/v1', '/token', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'login' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( 'jwt-auth/v1', '/token/validate', array(
            'methods'             => 'POST',
            'callback'            => function() {
                $auth_header = isset( $_SERVER['HTTP_AUTHORIZATION'] ) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
                $valid = WLC_Core_JWT::validate_token( $auth_header );
                if ( $valid ) {
                    return Wellness_API_Response::success( array( 'code' => 'jwt_auth_valid_token', 'data' => array( 'status' => 200 ) ) );
                }
                return new WP_Error( 'jwt_auth_invalid_token', 'Invalid token.', array( 'status' => 403 ) );
            },
            'permission_callback' => '__return_true',
        ) );

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
        register_rest_route( $namespace, '/verify-email', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'verify_email' ),
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
}

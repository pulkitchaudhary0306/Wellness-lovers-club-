<?php
namespace AntigravityB\API\Middleware;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Cors {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'init', array( $this, 'handle_cors' ) );
    }

    /**
     * Send CORS headers and intercept preflights
     */
    public function handle_cors() {
        // Dynamic origin lookup
        if ( isset( $_SERVER['HTTP_ORIGIN'] ) ) {
            $origin = $_SERVER['HTTP_ORIGIN'];
            
            // Allow localhost:3000 (Next.js) or any custom production domains
            if ( preg_match( '/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin ) || str_contains( $origin, 'wellnessloversclub.com' ) ) {
                header( "Access-Control-Allow-Origin: $origin" );
                header( 'Access-Control-Allow-Credentials: true' );
                header( 'Access-Control-Max-Age: 86400' );
            } else {
                header( "Access-Control-Allow-Origin: *" );
            }
        } else {
            header( "Access-Control-Allow-Origin: *" );
        }

        // Allow request methods
        if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
            header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
        } else {
            header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
        }

        // Allow headers requested dynamically
        if ( isset( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ) ) {
            header( "Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}" );
        } else {
            header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With, Origin, Accept' );
        }

        // Preflight request early escape
        if ( $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
            status_header( 200 );
            header( 'Content-Length: 0' );
            header( 'Content-Type: text/plain' );
            exit;
        }
    }
}

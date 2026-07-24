<?php
namespace AntigravityB\API\Middleware;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class RateLimiter {

    /**
     * Resolve the client IP address
     */
    private static function get_client_ip() {
        if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        if ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
            return explode( ',', $_SERVER['HTTP_X_FORWARDED_FOR'] )[0];
        }
        return isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
    }

    /**
     * Check if a request exceeds limits
     */
    public static function check_limit( $key, $limit = 60, $seconds = 60 ) {
        $ip          = self::get_client_ip();
        $clean_ip    = sanitize_key( str_replace( array( '.', ':' ), '_', $ip ) );
        $transient   = 'agb_rate_limit_' . $key . '_' . $clean_ip;

        $requests = get_transient( $transient );
        if ( false === $requests ) {
            set_transient( $transient, 1, $seconds );
            return true;
        }

        if ( $requests >= $limit ) {
            return new \WP_Error(
                'too_many_requests',
                'Too many requests. Please slow down.',
                array( 'status' => 429 )
            );
        }

        set_transient( $transient, $requests + 1, $seconds );
        return true;
    }
}

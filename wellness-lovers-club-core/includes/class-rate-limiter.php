<?php
/**
 * IP-based endpoint rate limiter using transients
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Rate_Limiter {

    /**
     * Check if the client IP has exceeded rate limit for an action
     *
     * @param string $action   Unique action identifier (e.g. 'login', 'register', 'contact')
     * @param int    $max_reqs Maximum allowed requests
     * @param int    $period   Expiration period in seconds
     * @return bool|WP_Error   True if allowed, WP_Error if blocked
     */
    public static function check_limit( $action, $max_reqs = 5, $period = 900 ) {
        $ip = self::get_client_ip();
        $transient_key = 'wlc_limit_' . md5( $action . '_' . $ip );

        $requests = get_transient( $transient_key );

        if ( false === $requests ) {
            // First request in the window
            set_transient( $transient_key, 1, $period );
            return true;
        }

        if ( intval( $requests ) >= $max_reqs ) {
            $minutes = ceil( $period / 60 );
            return new WP_Error(
                'rate_limit_exceeded',
                sprintf( 'Too many attempts. Please try again after %d minutes.', $minutes ),
                array( 'status' => 429 )
            );
        }

        // Increment count
        set_transient( $transient_key, intval( $requests ) + 1, $period );
        return true;
    }

    /**
     * Helper to retrieve client IP address
     */
    private static function get_client_ip() {
        if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
            // Can be a comma-separated list
            $parts = explode( ',', $_SERVER['HTTP_X_FORWARDED_FOR'] );
            return trim( $parts[0] );
        }
        return isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
    }
}

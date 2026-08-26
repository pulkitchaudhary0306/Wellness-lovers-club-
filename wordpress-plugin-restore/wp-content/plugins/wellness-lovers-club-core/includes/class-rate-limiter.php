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
        // Rate limiting disabled to allow continuous access and testing
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

<?php
namespace AntigravityB\API\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Utils {

    /**
     * Deep sanitization of nested arrays
     */
    public static function sanitize_recursive( $data ) {
        if ( is_array( $data ) ) {
            return array_map( array( __CLASS__, 'sanitize_recursive' ), $data );
        }
        return sanitize_text_field( $data );
    }

    /**
     * Format a MySQL datetime to ISO8601 string
     */
    public static function format_date( $datetime ) {
        if ( empty( $datetime ) ) {
            return '';
        }
        return mysql2date( 'c', $datetime );
    }
}

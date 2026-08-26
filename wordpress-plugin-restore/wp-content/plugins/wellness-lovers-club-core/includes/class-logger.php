<?php
/**
 * Simple file logging utility for security & audit trails
 *
 * Implements strict redaction filters to ensure sensitive data (OTPs, API keys,
 * passwords, JWT tokens) are never written to disk or error_log.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Logger {

    /**
     * Sanitize and redact sensitive information from log entries
     *
     * @param string $message
     * @return string
     */
    public static function sanitize_log_message( $message ) {
        if ( ! is_string( $message ) ) {
            return '';
        }

        // Redact Bearer tokens & JWTs
        $message = preg_replace( '/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/i', 'Bearer [REDACTED]', $message );

        // Redact explicit key/secret/password/otp patterns
        $message = preg_replace( '/(api[_-]?key|secret|password|otp|hash)[\s:=]+([^\s,;]+)/i', '$1: [REDACTED]', $message );

        return $message;
    }

    /**
     * Write an entry to the custom log file
     *
     * @param string $message Log entry text
     * @param string $level   Log severity level (INFO, WARNING, ERROR, SECURITY)
     */
    public static function log( $message, $level = 'INFO' ) {
        $safe_message = self::sanitize_log_message( $message );

        $upload_dir = wp_upload_dir();
        $log_dir = path_join( $upload_dir['basedir'], 'wlc-logs' );

        if ( ! file_exists( $log_dir ) ) {
            wp_mkdir_p( $log_dir );
            // Add index.php and .htaccess to protect log files
            file_put_contents( path_join( $log_dir, 'index.php' ), '<?php // Silence' );
            file_put_contents( path_join( $log_dir, '.htaccess' ), "Order deny,allow\nDeny from all" );
        }

        $log_file  = path_join( $log_dir, 'activity.log' );
        $timestamp = current_time( 'mysql' );
        $ip        = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';

        $log_entry = sprintf( "[%s] [%s] [IP: %s] %s\n", $timestamp, strtoupper( $level ), $ip, $safe_message );

        // Append to log file safely without generating PHP fatal warning
        @file_put_contents( $log_file, $log_entry, FILE_APPEND );

        // Also write to standard WordPress error log if WP_DEBUG is enabled
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'WLC-CORE: ' . $log_entry );
        }
    }
}

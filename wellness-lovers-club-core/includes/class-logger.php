<?php
/**
 * Simple file logging utility for security & audit trails
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Logger {

    /**
     * Write an entry to the custom log file
     *
     * @param string $message Log entry text
     * @param string $level   Log severity level (INFO, WARNING, ERROR, SECURITY)
     */
    public static function log( $message, $level = 'INFO' ) {
        $upload_dir = wp_upload_dir();
        $log_dir = path_join( $upload_dir['basedir'], 'wlc-logs' );

        if ( ! file_exists( $log_dir ) ) {
            wp_mkdir_p( $log_dir );
            // Add index.php and .htaccess to protect log files
            file_put_contents( path_join( $log_dir, 'index.php' ), '<?php // Silence' );
            file_put_contents( path_join( $log_dir, '.htaccess' ), "Order deny,allow\nDeny from all" );
        }

        $log_file = path_join( $log_dir, 'activity.log' );
        $timestamp = current_time( 'mysql' );
        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';

        $log_entry = sprintf( "[%s] [%s] [IP: %s] %s\n", $timestamp, strtoupper( $level ), $ip, $message );

        // Append to log file
        file_put_contents( $log_file, $log_entry, FILE_APPEND );
        
        // Also write to standard WordPress error log if WP_DEBUG is enabled
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'WLC-CORE: ' . $log_entry );
        }
    }
}

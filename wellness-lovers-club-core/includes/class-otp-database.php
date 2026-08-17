<?php
/**
 * Database Table Management for WLC Email OTPs
 *
 * Manages {$wpdb->prefix}wlc_email_otps schema creation using dbDelta().
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_OTP_Database {

    /**
     * Get the dynamic table name
     *
     * @return string
     */
    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'wlc_email_otps';
    }

    /**
     * Create or update the table schema
     */
    public static function create_table() {
        global $wpdb;

        $table_name      = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            email varchar(255) NOT NULL,
            otp_hash varchar(255) NOT NULL,
            expires_at datetime NOT NULL,
            attempts int(10) unsigned NOT NULL DEFAULT 0,
            max_attempts int(10) unsigned NOT NULL DEFAULT 5,
            resend_count int(10) unsigned NOT NULL DEFAULT 0,
            last_sent_at datetime DEFAULT NULL,
            created_at datetime NOT NULL,
            verified_at datetime DEFAULT NULL,
            status varchar(20) NOT NULL DEFAULT 'pending',
            PRIMARY KEY  (id),
            KEY email (email(191)),
            KEY user_id (user_id),
            KEY expires_at (expires_at)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }
}

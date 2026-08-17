<?php
/**
 * Database handler for WLC Email OTP Plugin
 *
 * Manages table schema creation, upgrades, and table name resolution.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Email_OTP_Database {

    /**
     * Get the table name with proper WordPress prefix
     *
     * @return string
     */
    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . 'wlc_email_otps';
    }

    /**
     * Create or update the OTP database table using dbDelta
     */
    public static function create_tables() {
        global $wpdb;

        $table_name      = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned DEFAULT NULL,
            email varchar(255) NOT NULL,
            otp_hash varchar(255) NOT NULL,
            attempts int(11) NOT NULL DEFAULT 0,
            expires_at datetime NOT NULL,
            last_sent_at datetime NOT NULL,
            verified_at datetime DEFAULT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY email (email(191)),
            KEY user_id (user_id),
            KEY expires_at (expires_at)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }
}

<?php
/**
 * Database migrations and cleanup handler
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Db {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Run database table creation on init in case activation hook was skipped on local dev
        add_action( 'init', array( $this, 'create_tables' ) );
    }

    /**
     * Plugin Activation callback: create tables & cleanup old ones
     */
    public static function activate() {
        self::create_tables();
        self::cleanup_obsolete_tables();
    }

    /**
     * Plugin Deactivation callback
     */
    public static function deactivate() {
        // Keep user data safe; do not drop tables on deactivation
    }

    /**
     * Create necessary custom database tables
     */
    public static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $table_contacts       = $wpdb->prefix . 'wlc_contacts';
        $table_newsletter     = $wpdb->prefix . 'wlc_newsletter';
        $table_email_logs     = $wpdb->prefix . 'wlc_email_logs';
        $table_email_queue    = $wpdb->prefix . 'wlc_email_queue';
        $table_email_verify   = $wpdb->prefix . 'wlc_email_verification';
        $table_dual_verify    = $wpdb->prefix . 'wlc_dual_verification';
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        // 1. Contacts Table
        $sql_contacts = "CREATE TABLE IF NOT EXISTS $table_contacts (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            first_name varchar(100) DEFAULT '',
            last_name varchar(100) DEFAULT '',
            email varchar(100) NOT NULL,
            phone varchar(50) DEFAULT '',
            subject varchar(200) DEFAULT '',
            message text NOT NULL,
            status varchar(20) DEFAULT 'New' NOT NULL,
            ip_address varchar(45) DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta( $sql_contacts );

        // 2. Newsletter Table
        $sql_newsletter = "CREATE TABLE IF NOT EXISTS $table_newsletter (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL,
            status varchar(20) DEFAULT 'Active' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY email (email)
        ) $charset_collate;";
        dbDelta( $sql_newsletter );

        // 3. Email Logs Table
        $sql_email_logs = "CREATE TABLE IF NOT EXISTS $table_email_logs (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            recipient varchar(255) NOT NULL,
            subject varchar(255) NOT NULL,
            email_type varchar(50) DEFAULT '',
            success tinyint(1) DEFAULT 1 NOT NULL,
            failure_reason text DEFAULT '',
            smtp_response text DEFAULT '',
            delivery_status varchar(50) DEFAULT 'Sent' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta( $sql_email_logs );

        // 4. Email Queue Table
        $sql_email_queue = "CREATE TABLE IF NOT EXISTS $table_email_queue (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            recipient varchar(255) NOT NULL,
            subject varchar(255) NOT NULL,
            body longtext NOT NULL,
            headers text DEFAULT '',
            email_type varchar(50) DEFAULT '',
            attempts int(11) DEFAULT 0 NOT NULL,
            status varchar(20) DEFAULT 'Pending' NOT NULL,
            last_attempt datetime DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta( $sql_email_queue );

        // 5. Email Verification Table (OTP-based, hashed storage)
        $sql_email_verify = "CREATE TABLE IF NOT EXISTS $table_email_verify (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            email varchar(100) NOT NULL,
            otp_hash varchar(255) NOT NULL,
            expires_at datetime NOT NULL,
            attempts int(11) DEFAULT 0 NOT NULL,
            resend_count int(11) DEFAULT 0 NOT NULL,
            last_resent_at datetime DEFAULT NULL,
            verified tinyint(1) DEFAULT 0 NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY email (email)
        ) $charset_collate;";
        dbDelta( $sql_email_verify );

        // 6. Dual OTP Registration Pending Sessions Table
        $sql_dual_verify = "CREATE TABLE IF NOT EXISTS $table_dual_verify (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            session_token varchar(64) NOT NULL,
            email varchar(100) NOT NULL,
            phone varchar(50) NOT NULL,
            registration_payload longtext NOT NULL,
            email_otp_hash varchar(255) NOT NULL,
            phone_otp_hash varchar(255) NOT NULL,
            email_verified tinyint(1) DEFAULT 0 NOT NULL,
            phone_verified tinyint(1) DEFAULT 0 NOT NULL,
            expires_at datetime NOT NULL,
            attempts int(11) DEFAULT 0 NOT NULL,
            resend_count int(11) DEFAULT 0 NOT NULL,
            last_resent_at datetime DEFAULT NULL,
            user_id bigint(20) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY session_token (session_token),
            KEY email (email),
            KEY phone (phone)
        ) $charset_collate;";
        dbDelta( $sql_dual_verify );
    }

    /**
     * Safely drop old redundant tables
     */
    public static function cleanup_obsolete_tables() {
        global $wpdb;
        $obsolete_tables = array(
            $wpdb->prefix . 'agb_contacts',
            $wpdb->prefix . 'agb_newsletter',
            $wpdb->prefix . 'contact_messages',
            $wpdb->prefix . 'inquiries',
            $wpdb->prefix . 'contact'
        );

        foreach ( $obsolete_tables as $table ) {
            if ( $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table ) ) === $table ) {
                $wpdb->query( "DROP TABLE IF EXISTS $table" );
            }
        }
    }
}

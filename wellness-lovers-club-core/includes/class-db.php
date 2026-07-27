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

        $table_contacts   = $wpdb->prefix . 'wlc_contacts';
        $table_newsletter = $wpdb->prefix . 'wlc_newsletter';

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
            status varchar(20) DEFAULT 'New' NOT NULL, -- New, Read
            ip_address varchar(45) DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta( $sql_contacts );

        // 2. Newsletter Table
        $sql_newsletter = "CREATE TABLE IF NOT EXISTS $table_newsletter (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL,
            status varchar(20) DEFAULT 'Active' NOT NULL, -- Active, Unsubscribed
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY email (email)
        ) $charset_collate;";
        dbDelta( $sql_newsletter );
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

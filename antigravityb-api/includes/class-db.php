<?php
namespace AntigravityB\API\Includes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Db {

    /**
     * Create custom tables on activation
     */
    public static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $table_contacts   = $wpdb->prefix . 'agb_contacts';
        $table_newsletter = $wpdb->prefix . 'agb_newsletter';

        $sql = "CREATE TABLE $table_contacts (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            message text NOT NULL,
            ip_address varchar(45) DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;

        CREATE TABLE $table_newsletter (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            email varchar(100) NOT NULL,
            status varchar(20) DEFAULT 'Active' NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY email (email)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );

        update_option( 'agb_api_db_version', '1.0.0' );
    }
}

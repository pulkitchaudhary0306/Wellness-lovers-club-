<?php
/**
 * Clean uninstallation handler for Wellness Lovers Club Email OTP Plugin
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

global $wpdb;

// Clean up OTP database table
$table_name = $wpdb->prefix . 'wlc_email_otps';
$wpdb->query( "DROP TABLE IF EXISTS {$table_name}" );

<?php
/**
 * Fired when the plugin is uninstalled.
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

global $wpdb;

// Drop custom tables
$table_contacts   = $wpdb->prefix . 'agb_contacts';
$table_newsletter = $wpdb->prefix . 'agb_newsletter';

$wpdb->query( "DROP TABLE IF EXISTS {$table_contacts}" );
$wpdb->query( "DROP TABLE IF EXISTS {$table_newsletter}" );

// Delete registered options
delete_option( 'agb_api_db_version' );
delete_option( 'agb_api_settings' );

// Clear transients
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_agb_rate_limit_%'" );
$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_agb_rate_limit_%'" );

<?php
/**
 * Global Helpers for Wellness API plugin.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Prefix a key name for Wellness metadata
 */
function wlc_meta_prefix( $key ) {
    return 'wlc_' . $key;
}

/**
 * List of custom metadata keys collected during registration / profile
 */
function wlc_get_custom_meta_keys() {
    return array(
        'phone'                 => wlc_meta_prefix( 'phone' ),
        'profession'            => wlc_meta_prefix( 'profession' ),
        'companyName'           => wlc_meta_prefix( 'company_name' ),
        'correspondenceAddress' => wlc_meta_prefix( 'correspondence_address' ),
        'preferences'           => wlc_meta_prefix( 'preferences' ),
        'membershipStatus'      => wlc_meta_prefix( 'membership_status' ),
        'membershipTier'        => wlc_meta_prefix( 'membership_tier' ),
    );
}

/**
 * Safely get custom user metadata
 */
function wlc_get_user_meta( $user_id, $key, $single = true ) {
    $keys = wlc_get_custom_meta_keys();
    $meta_key = isset( $keys[$key] ) ? $keys[$key] : $key;
    return get_user_meta( $user_id, $meta_key, $single );
}

/**
 * Safely update custom user metadata
 */
function wlc_update_user_meta( $user_id, $key, $value ) {
    $keys = wlc_get_custom_meta_keys();
    $meta_key = isset( $keys[$key] ) ? $keys[$key] : $key;
    return update_user_meta( $user_id, $meta_key, $value );
}

/**
 * Check if a plugin is active
 */
function wlc_is_plugin_active( $plugin ) {
    return in_array( $plugin, (array) get_option( 'active_plugins', array() ), true ) || class_exists( 'WooCommerce' );
}

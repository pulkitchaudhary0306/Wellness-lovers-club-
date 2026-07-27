<?php
/**
 * Settings and Option Management for SMTP credentials
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Email_Settings {

    private static $option_name = 'wlc_smtp_settings';
    private static $cached_settings = null;

    /**
     * Default SMTP configuration parameters
     */
    public static function get_defaults() {
        return array(
            'smtp_host'       => '',
            'smtp_port'       => '587',
            'smtp_encryption' => 'tls', // tls, ssl, none
            'smtp_auth'       => '1',   // 1 = ON, 0 = OFF
            'smtp_user'       => '',
            'smtp_pass'       => '',
            'from_email'      => get_option( 'admin_email' ),
            'from_name'       => get_option( 'blogname' ),
            'reply_to_email'  => '',
            'timeout'         => '10',
            'debug_mode'      => '0'    // 1 = ON, 0 = OFF
        );
    }

    /**
     * Load settings from database with caching
     */
    public static function get_all() {
        if ( null !== self::$cached_settings ) {
            return self::$cached_settings;
        }

        $settings = get_option( self::$option_name, array() );
        $defaults = self::get_defaults();
        
        $merged = array_merge( $defaults, $settings );
        
        // Decrypt password
        if ( ! empty( $merged['smtp_pass'] ) ) {
            $merged['smtp_pass'] = WLC_Core_Email_Security::decrypt( $merged['smtp_pass'] );
        }
        
        self::$cached_settings = $merged;
        return $merged;
    }

    /**
     * Get a specific setting value
     */
    public static function get( $key, $default = '' ) {
        $settings = self::get_all();
        return isset( $settings[$key] ) ? $settings[$key] : $default;
    }

    /**
     * Save settings to database after sanitization and password encryption
     */
    public static function save( $input ) {
        if ( ! current_user_can( 'manage_options' ) ) {
            return false;
        }

        $defaults = self::get_defaults();
        $sanitized = array();

        // Standard sanitization
        $sanitized['smtp_host']       = sanitize_text_field( $input['smtp_host'] );
        $sanitized['smtp_port']       = sanitize_text_field( $input['smtp_port'] );
        $sanitized['smtp_encryption'] = in_array( $input['smtp_encryption'], array( 'tls', 'ssl', 'none' ) ) ? $input['smtp_encryption'] : 'tls';
        $sanitized['smtp_auth']       = isset( $input['smtp_auth'] ) && $input['smtp_auth'] === '1' ? '1' : '0';
        $sanitized['smtp_user']       = sanitize_text_field( $input['smtp_user'] );
        $sanitized['from_email']      = sanitize_email( $input['from_email'] );
        $sanitized['from_name']       = sanitize_text_field( $input['from_name'] );
        $sanitized['reply_to_email']  = ! empty( $input['reply_to_email'] ) ? sanitize_email( $input['reply_to_email'] ) : '';
        $sanitized['timeout']         = intval( $input['timeout'] ) > 0 ? (string) intval( $input['timeout'] ) : '10';
        $sanitized['debug_mode']      = isset( $input['debug_mode'] ) && $input['debug_mode'] === '1' ? '1' : '0';

        // Password handling:
        // If password is not modified (remains masked), keep existing saved password.
        $existing = get_option( self::$option_name, array() );
        $input_pass = isset( $input['smtp_pass'] ) ? $input['smtp_pass'] : '';

        if ( $input_pass === WLC_Core_Email_Security::mask_value('placeholder') || empty( $input_pass ) ) {
            // Keep existing password
            $sanitized['smtp_pass'] = isset( $existing['smtp_pass'] ) ? $existing['smtp_pass'] : '';
        } else {
            // Encrypt and save new password
            $sanitized['smtp_pass'] = WLC_Core_Email_Security::encrypt( $input_pass );
        }

        // Save
        $saved = update_option( self::$option_name, $sanitized );
        
        // Reset cache
        self::$cached_settings = null;
        
        return $saved;
    }
}

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
     * Default SMTP configuration parameters (Disabled by default to use native server mail)
     */
    public static function get_defaults() {
        return array(
            'smtp_enabled'    => '0',   // 0 = OFF (Native wp_mail), 1 = ON (Custom SMTP)
            'smtp_host'       => defined( 'WLC_SMTP_HOST' ) ? WLC_SMTP_HOST : '',
            'smtp_port'       => defined( 'WLC_SMTP_PORT' ) ? (string) WLC_SMTP_PORT : '587',
            'smtp_encryption' => defined( 'WLC_SMTP_ENCRYPTION' ) ? WLC_SMTP_ENCRYPTION : 'tls', // tls, ssl, none
            'smtp_auth'       => defined( 'WLC_SMTP_AUTH' ) && WLC_SMTP_AUTH ? '1' : '0',
            'smtp_user'       => defined( 'WLC_SMTP_USER' ) ? WLC_SMTP_USER : '',
            'smtp_pass'       => defined( 'WLC_SMTP_PASS' ) ? WLC_SMTP_PASS : '',
            'from_email'      => defined( 'WLC_SMTP_FROM_EMAIL' ) ? WLC_SMTP_FROM_EMAIL : 'no-reply@wellnessloversclub.com',
            'from_name'       => defined( 'WLC_SMTP_FROM_NAME' ) ? WLC_SMTP_FROM_NAME : 'Wellness Lovers Club',
            'reply_to_email'  => defined( 'WLC_SMTP_REPLY_TO' ) ? WLC_SMTP_REPLY_TO : 'no-reply@wellnessloversclub.com',
            'timeout'         => '10',
            'debug_mode'      => '0'    // 1 = ON, 0 = OFF
        );
    }

    /**
     * Load settings from database with caching and constant overrides
     */
    public static function get_all() {
        if ( null !== self::$cached_settings ) {
            return self::$cached_settings;
        }

        $settings = get_option( self::$option_name, array() );
        $defaults = self::get_defaults();
        
        $merged = array_merge( $defaults, array_filter( $settings ) );
        
        // Decrypt password if it came from stored settings and not constant
        if ( ! defined( 'WLC_SMTP_PASS' ) && ! empty( $merged['smtp_pass'] ) ) {
            $merged['smtp_pass'] = WLC_Core_Email_Security::decrypt( $merged['smtp_pass'] );
        }

        // Allow PHP constants to override database settings if set in wp-config.php
        if ( defined( 'WLC_SMTP_HOST' ) )       $merged['smtp_host']       = WLC_SMTP_HOST;
        if ( defined( 'WLC_SMTP_PORT' ) )       $merged['smtp_port']       = (string) WLC_SMTP_PORT;
        if ( defined( 'WLC_SMTP_ENCRYPTION' ) ) $merged['smtp_encryption'] = WLC_SMTP_ENCRYPTION;
        if ( defined( 'WLC_SMTP_AUTH' ) )       $merged['smtp_auth']       = WLC_SMTP_AUTH ? '1' : '0';
        if ( defined( 'WLC_SMTP_USER' ) )       $merged['smtp_user']       = WLC_SMTP_USER;
        if ( defined( 'WLC_SMTP_PASS' ) )       $merged['smtp_pass']       = WLC_SMTP_PASS;
        if ( defined( 'WLC_SMTP_FROM_EMAIL' ) ) $merged['from_email']      = WLC_SMTP_FROM_EMAIL;
        if ( defined( 'WLC_SMTP_FROM_NAME' ) )  $merged['from_name']       = WLC_SMTP_FROM_NAME;
        if ( defined( 'WLC_SMTP_REPLY_TO' ) )   $merged['reply_to_email']  = WLC_SMTP_REPLY_TO;
        
        self::$cached_settings = $merged;
        return $merged;
    }

    /**
     * Get a specific setting value
     */
    public static function get( $key, $default = '' ) {
        $settings = self::get_all();
        return isset( $settings[$key] ) && $settings[$key] !== '' ? $settings[$key] : $default;
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

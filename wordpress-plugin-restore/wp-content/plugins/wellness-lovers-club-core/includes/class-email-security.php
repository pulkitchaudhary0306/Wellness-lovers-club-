<?php
/**
 * Security and Encryption Handler for SMTP module credentials
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Email_Security {

    /**
     * Get encryption key derived from WordPress salts
     */
    private static function get_key() {
        if ( defined( 'LOGGED_IN_SALT' ) && strlen( LOGGED_IN_SALT ) >= 32 ) {
            return substr( LOGGED_IN_SALT, 0, 32 );
        }
        return 'wlc_default_salt_key_32_chars_!@#';
    }

    /**
     * Encrypt a sensitive string (like the SMTP password)
     */
    public static function encrypt( $value ) {
        if ( empty( $value ) ) {
            return '';
        }

        $key = self::get_key();
        $cipher = 'aes-256-cbc';
        $iv_length = openssl_cipher_iv_length( $cipher );
        $iv = openssl_random_pseudo_bytes( $iv_length );
        
        $encrypted = openssl_encrypt( $value, $cipher, $key, 0, $iv );
        if ( false === $encrypted ) {
            return '';
        }

        return base64_encode( $iv . $encrypted );
    }

    /**
     * Decrypt an encrypted string
     */
    public static function decrypt( $value ) {
        if ( empty( $value ) ) {
            return '';
        }

        $key = self::get_key();
        $cipher = 'aes-256-cbc';
        $data = base64_decode( $value );
        $iv_length = openssl_cipher_iv_length( $cipher );
        
        if ( strlen( $data ) <= $iv_length ) {
            return '';
        }

        $iv = substr( $data, 0, $iv_length );
        $encrypted = substr( $data, $iv_length );
        
        $decrypted = openssl_decrypt( $encrypted, $cipher, $key, 0, $iv );
        return ( false === $decrypted ) ? '' : $decrypted;
    }

    /**
     * Mask a sensitive value for rendering in HTML inputs
     */
    public static function mask_value( $value ) {
        if ( empty( $value ) ) {
            return '';
        }
        return '************************';
    }
}

<?php
/**
 * Request parameter validator class.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Validator {

    /**
     * Validate registration parameters
     */
    public static function validate_registration( $params ) {
        $required = array( 'name', 'phone', 'email', 'password', 'profession', 'correspondenceAddress' );

        foreach ( $required as $field ) {
            if ( empty( $params[$field] ) ) {
                return new WP_Error( 'missing_field', sprintf( 'Field "%s" is required.', $field ), array( 'status' => 400 ) );
            }
        }

        // Validate email format
        if ( ! is_email( $params['email'] ) ) {
            return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        // Check duplicate email
        if ( email_exists( $params['email'] ) ) {
            return new WP_Error( 'email_taken', 'This email address is already registered.', array( 'status' => 400 ) );
        }

        // Validate password length
        if ( strlen( $params['password'] ) < 8 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 8 characters long.', array( 'status' => 400 ) );
        }

        return true;
    }
}

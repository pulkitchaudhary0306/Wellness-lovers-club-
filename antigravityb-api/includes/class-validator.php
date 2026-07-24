<?php
namespace AntigravityB\API\Includes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Validator {

    /**
     * Check payload validation rules
     */
    public static function validate_registration( $params ) {
        $required = array( 'firstName', 'lastName', 'email', 'password' );

        foreach ( $required as $field ) {
            if ( empty( $params[$field] ) ) {
                return new \WP_Error( 'missing_field', sprintf( 'Field "%s" is required.', $field ), array( 'status' => 400 ) );
            }
        }

        if ( ! is_email( $params['email'] ) ) {
            return new \WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        if ( email_exists( $params['email'] ) ) {
            return new \WP_Error( 'email_taken', 'This email address is already registered.', array( 'status' => 400 ) );
        }

        if ( username_exists( $params['email'] ) ) {
            return new \WP_Error( 'username_taken', 'This username is already taken.', array( 'status' => 400 ) );
        }

        if ( strlen( $params['password'] ) < 6 ) {
            return new \WP_Error( 'weak_password', 'Password must be at least 6 characters long.', array( 'status' => 400 ) );
        }

        return true;
    }
}

<?php
namespace AntigravityB\API\Middleware;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Auth {

    /**
     * Authenticate request using Bearer token
     */
    public static function authenticate() {
        $headers = apache_request_headers();
        $auth_header = isset( $headers['Authorization'] ) ? $headers['Authorization'] : '';

        if ( empty( $auth_header ) && isset( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
            $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
        }

        if ( empty( $auth_header ) ) {
            return false;
        }

        list( $token ) = sscanf( $auth_header, 'Bearer %s' );
        if ( empty( $token ) ) {
            return false;
        }

        $decoded = Jwt::validate_token( $token );
        if ( ! $decoded || ! isset( $decoded['data']['user']['id'] ) ) {
            return false;
        }

        $user_id = intval( $decoded['data']['user']['id'] );
        wp_set_current_user( $user_id );
        return $user_id;
    }

    /**
     * Check if user is logged in
     */
    public static function check_auth() {
        // Perform authentication
        self::authenticate();

        if ( ! is_user_logged_in() ) {
            return new \WP_Error(
                'rest_forbidden',
                'You must be authenticated to access this endpoint.',
                array( 'status' => 401 )
            );
        }
        return true;
    }

    /**
     * Guard endpoint for administrative access
     */
    public static function check_admin() {
        self::authenticate();

        if ( ! current_user_can( 'manage_options' ) ) {
            return new \WP_Error(
                'rest_forbidden',
                'Administrative privileges are required.',
                array( 'status' => 403 )
            );
        }
        return true;
    }
}

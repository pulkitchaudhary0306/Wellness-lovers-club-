<?php
/**
 * Auth REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Auth {

    /**
     * Register endpoints
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/logout', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( $this, 'logout' ),
            'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
        ) );
    }

    /**
     * Log out endpoint
     */
    public function logout( $request ) {
        // JWT is stateless on the server; client clearing token is main operation.
        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'User logged out successfully.'
        ) );
    }
}

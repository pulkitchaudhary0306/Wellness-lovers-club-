<?php
/**
 * Register REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Register {

    /**
     * Register endpoints
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/register', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( $this, 'register' ),
            'permission_callback' => '__return_true', // Public endpoint
        ) );
    }

    /**
     * Create user registration endpoint
     */
    public function register( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Validate request
        $validation = Wellness_API_Validator::validate_registration( $params );
        if ( is_wp_error( $validation ) ) {
            return Wellness_API_Response::error( $validation->get_error_code(), $validation->get_error_message(), 400 );
        }

        // Parse names
        $parts = explode( ' ', trim( $params['name'] ), 2 );
        $first_name = isset( $parts[0] ) ? $parts[0] : '';
        $last_name = isset( $parts[1] ) ? $parts[1] : '';

        // Create user in WordPress
        $user_id = wp_insert_user( array(
            'user_login' => $params['email'],
            'user_email' => $params['email'],
            'user_pass'  => $params['password'],
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'role'       => 'subscriber'
        ) );

        if ( is_wp_error( $user_id ) ) {
            return Wellness_API_Response::error( 'registration_error', $user_id->get_error_message(), 500 );
        }

        // Save custom metadata
        wlc_update_user_meta( $user_id, 'phone', $params['phone'] );
        wlc_update_user_meta( $user_id, 'profession', $params['profession'] );
        
        if ( ! empty( $params['companyName'] ) ) {
            wlc_update_user_meta( $user_id, 'companyName', $params['companyName'] );
        }
        
        wlc_update_user_meta( $user_id, 'correspondenceAddress', $params['correspondenceAddress'] );
        
        if ( ! empty( $params['preferences'] ) ) {
            wlc_update_user_meta( $user_id, 'preferences', (array) $params['preferences'] );
        }

        // Set default membership details
        wlc_update_user_meta( $user_id, 'membershipStatus', 'Pending' );
        wlc_update_user_meta( $user_id, 'membershipTier', 'Lotus Club' );

        // Generate JWT token by performing internal loopback login call
        $token = '';
        $token_url = rest_url( '/jwt-auth/v1/token' );
        $token_response = wp_remote_post( $token_url, array(
            'body' => array(
                'username' => $params['email'],
                'password' => $params['password'],
            ),
            'sslverify' => false,
        ) );

        if ( ! is_wp_error( $token_response ) && wp_remote_retrieve_response_code( $token_response ) === 200 ) {
            $token_body = json_decode( wp_remote_retrieve_body( $token_response ), true );
            $token = isset( $token_body['token'] ) ? $token_body['token'] : '';
        } else {
            // Fallback mock token for local testing environments if JWT is not enabled
            $token = base64_encode( json_encode( array( 'user_id' => $user_id, 'exp' => time() + DAY_IN_SECONDS ) ) );
        }

        // Prepare response user shape matching User type in Next.js
        $user_data = array(
            'id'               => (string) $user_id,
            'firstName'        => $first_name,
            'lastName'         => $last_name,
            'email'            => $params['email'],
            'phone'            => $params['phone'],
            'profession'       => $params['profession'],
            'companyName'      => isset( $params['companyName'] ) ? $params['companyName'] : '',
            'country'          => '',
            'membershipStatus' => 'Pending',
            'membershipTier'   => 'Lotus Club'
        );

        return Wellness_API_Response::success( array(
            'token'         => $token,
            'refresh_token' => '',
            'user'          => $user_data
        ), 201 );
    }
}

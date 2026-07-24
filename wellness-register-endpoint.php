<?php
/**
 * ==============================================================================
 * Wellness Lovers Club Custom Register REST API Endpoint
 * ==============================================================================
 * 
 * Add this code block to your active theme's functions.php file (e.g. at
 * /var/www/cms/wp-content/themes/twentytwentyfive/functions.php).
 * 
 * Registers: POST /wp-json/custom/v1/register
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'rest_api_init', function () {
    register_rest_route( 'custom/v1', '/register', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_rest_register_user',
        'permission_callback' => '__return_true', // Public endpoint
    ) );
} );

/**
 * Handle user registration REST request
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function wlc_rest_register_user( WP_REST_Request $request ) {
    // Retrieve JSON parameters or form-urlencoded parameters
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    // ─── 1. Validation ────────────────────────────────────────────────────────
    
    // Required fields
    if ( empty( $params['firstName'] ) ) {
        return new WP_Error( 'missing_first_name', 'First name is required.', array( 'status' => 400 ) );
    }
    if ( empty( $params['lastName'] ) ) {
        return new WP_Error( 'missing_last_name', 'Last name is required.', array( 'status' => 400 ) );
    }
    if ( empty( $params['email'] ) ) {
        return new WP_Error( 'missing_email', 'Email address is required.', array( 'status' => 400 ) );
    }
    if ( empty( $params['password'] ) ) {
        return new WP_Error( 'missing_password', 'Password is required.', array( 'status' => 400 ) );
    }

    $firstName = sanitize_text_field( $params['firstName'] );
    $lastName  = sanitize_text_field( $params['lastName'] );
    $email     = sanitize_email( $params['email'] );
    $password  = $params['password'];

    // Verify email format
    if ( ! is_email( $email ) ) {
        return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
    }

    // Verify password length
    if ( strlen( $password ) < 6 ) {
        return new WP_Error( 'weak_password', 'Password must be at least 6 characters long.', array( 'status' => 400 ) );
    }

    // Deriving username from email
    $username = $email;

    // Reject duplicate email/username
    if ( email_exists( $email ) ) {
        return new WP_Error( 'email_taken', 'This email address is already registered.', array( 'status' => 400 ) );
    }
    if ( username_exists( $username ) ) {
        return new WP_Error( 'username_taken', 'This username is already taken.', array( 'status' => 400 ) );
    }

    // ─── 2. User Creation ─────────────────────────────────────────────────────
    
    $user_id = wp_create_user( $username, $password, $email );
    if ( is_wp_error( $user_id ) ) {
        return new WP_Error( 'registration_failed', $user_id->get_error_message(), array( 'status' => 400 ) );
    }

    // Configure display name and name fields
    $display_name = trim( "$firstName $lastName" );
    wp_update_user( array(
        'ID'           => $user_id,
        'first_name'   => $firstName,
        'last_name'    => $lastName,
        'display_name' => $display_name,
    ) );

    // Store phone as user_meta
    $phone = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
    update_user_meta( $user_id, 'phone', $phone );

    // Handle any additional optional fields sent
    foreach ( $params as $key => $value ) {
        if ( ! in_array( $key, array( 'firstName', 'lastName', 'email', 'password', 'phone' ) ) ) {
            if ( is_array( $value ) ) {
                $sanitized_value = array_map( 'sanitize_text_field', $value );
            } else {
                $sanitized_value = sanitize_text_field( $value );
            }
            update_user_meta( $user_id, $key, $sanitized_value );
            update_user_meta( $user_id, 'wlc_' . $key, $sanitized_value );
        }
    }

    // Set default membership meta fields
    update_user_meta( $user_id, 'membership_status', 'Inactive' );
    update_user_meta( $user_id, 'membership_tier', 'Lotus Club' );

    // ─── 3. JWT Token Generation ─────────────────────────────────────────────
    
    $token = null;

    if ( defined( 'JWT_AUTH_SECRET_KEY' ) ) {
        // Manually generate token compatible with "JWT Authentication for WP REST API" plugin
        $header = json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) );
        
        $issuedAt = time();
        $expire   = $issuedAt + ( defined( 'JWT_AUTH_EXPIRE' ) ? JWT_AUTH_EXPIRE : DAY_IN_SECONDS * 7 );
        
        $payload = json_encode( array(
            'iss'  => get_bloginfo( 'url' ),
            'iat'  => $issuedAt,
            'nbf'  => $issuedAt,
            'exp'  => $expire,
            'data' => array(
                'user' => array(
                    'id' => $user_id
                )
            )
        ) );

        $base64UrlHeader    = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $header ) );
        $base64UrlPayload   = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $payload ) );
        $signature          = hash_hmac( 'sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_AUTH_SECRET_KEY, true );
        $base64UrlSignature = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $signature ) );

        $token = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    // ─── 4. Response Dispatch ─────────────────────────────────────────────────
    
    if ( ! empty( $token ) ) {
        // Automatically authenticated response
        $response_data = array(
            'token'         => $token,
            'refresh_token' => '',
            'user'          => array(
                'id'                => $user_id,
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'user_email'        => $email,
                'avatar_url'        => get_avatar_url( $user_id, array( 'size' => 96 ) ),
                'membership_status' => 'Inactive',
                'membership_tier'   => 'Lotus Club',
            ),
        );
    } else {
        // Fallback response with setup message
        $response_data = array(
            'success' => true,
            'message' => 'User created successfully, but automatic JWT token generation requires JWT_AUTH_SECRET_KEY to be defined in your wp-config.php.',
            'user'    => array(
                'id'                => $user_id,
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'user_email'        => $email,
                'avatar_url'        => get_avatar_url( $user_id, array( 'size' => 96 ) ),
                'membership_status' => 'Inactive',
                'membership_tier'   => 'Lotus Club',
            ),
        );
    }

    return rest_ensure_response( $response_data );
}

<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use AntigravityB\API\Middleware\Jwt;
use AntigravityB\API\Middleware\RateLimiter;
use AntigravityB\API\Includes\Wellness_API_Response;
use AntigravityB\API\Includes\Wellness_API_Validator;

class AuthController {

    /**
     * Authenticate and login user
     */
    public function login( \WP_REST_Request $request ) {
        // Rate limit: Max 5 logins per minute
        $limiter = RateLimiter::check_limit( 'login', 5, 60 );
        if ( is_wp_error( $limiter ) ) {
            return $limiter;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $username = isset( $params['username'] ) ? sanitize_text_field( $params['username'] ) : '';
        $password = isset( $params['password'] ) ? $params['password'] : '';

        if ( empty( $username ) || empty( $password ) ) {
            return new \WP_Error( 'missing_credentials', 'Username and password are required.', array( 'status' => 400 ) );
        }

        $user = wp_authenticate( $username, $password );
        if ( is_wp_error( $user ) ) {
            return new \WP_Error( 'invalid_credentials', 'Invalid username or password.', array( 'status' => 401 ) );
        }

        $token = Jwt::generate_token( $user->ID );

        // Read profile metadata
        $profile_controller = new ProfileController();
        $profile_data = $profile_controller->get_user_profile_data( $user->ID );

        return new \WP_REST_Response( array(
            'token'         => $token,
            'refresh_token' => '',
            'user'          => $profile_data
        ), 200 );
    }

    /**
     * Register new subscriber account
     */
    public function register( \WP_REST_Request $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Validate
        $validation = \AntigravityB\API\Includes\Wellness_API_Validator::validate_registration( $params );
        if ( is_wp_error( $validation ) ) {
            return $validation;
        }

        $firstName = sanitize_text_field( $params['firstName'] );
        $lastName  = sanitize_text_field( $params['lastName'] );
        $email     = sanitize_email( $params['email'] );
        $password  = $params['password'];

        $user_id = wp_create_user( $email, $password, $email );
        if ( is_wp_error( $user_id ) ) {
            return new \WP_Error( 'registration_failed', $user_id->get_error_message(), array( 'status' => 400 ) );
        }

        // Save Names
        wp_update_user( array(
            'ID'           => $user_id,
            'first_name'   => $firstName,
            'last_name'    => $lastName,
            'display_name' => trim( "$firstName $lastName" ),
        ) );

        // Custom User Meta Fields
        $phone   = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
        $company = isset( $params['company'] ) ? sanitize_text_field( $params['company'] ) : '';
        $address = isset( $params['address'] ) ? sanitize_textarea_field( $params['address'] ) : '';
        $city    = isset( $params['city'] ) ? sanitize_text_field( $params['city'] ) : '';
        $country = isset( $params['country'] ) ? sanitize_text_field( $params['country'] ) : '';
        $bio     = isset( $params['bio'] ) ? sanitize_textarea_field( $params['bio'] ) : '';

        update_user_meta( $user_id, 'wlc_phone', $phone );
        update_user_meta( $user_id, 'wlc_company_name', $company );
        update_user_meta( $user_id, 'wlc_correspondence_address', $address );
        update_user_meta( $user_id, 'wlc_city', $city );
        update_user_meta( $user_id, 'wlc_country', $country );
        update_user_meta( $user_id, 'wlc_bio', $bio );
        
        update_user_meta( $user_id, 'wlc_membership_status', 'Inactive' );
        update_user_meta( $user_id, 'wlc_membership_tier', 'Lotus Club' );

        // Generate and send registration OTP
        $otp = (string) rand( 100000, 999999 );
        update_user_meta( $user_id, 'wlc_reset_otp', $otp );
        update_user_meta( $user_id, 'wlc_reset_otp_time', time() );

        $subject = 'Verify Your Email | Wellness Lovers Club';
        $message = "Hello " . $firstName . ",\n\nWelcome to Wellness Lovers Club! Please verify your email address to activate your membership.\n\nYour Verification OTP Code: " . $otp . "\n\nThis OTP will expire in 15 minutes.\n";
        wp_mail( $email, $subject, $message );

        $token = Jwt::generate_token( $user_id );

        $profile_controller = new ProfileController();
        $profile_data = $profile_controller->get_user_profile_data( $user_id );

        return new \WP_REST_Response( array(
            'token'         => $token,
            'refresh_token' => '',
            'user'          => $profile_data
        ), 201 );
    }

    /**
     * Terminate user session
     */
    public function logout( \WP_REST_Request $request ) {
        return new \WP_REST_Response( array(
            'success' => true,
            'message' => 'Logged out successfully.'
        ), 200 );
    }

    /**
     * Send password reset request email
     */
    public function forgot_password( \WP_REST_Request $request ) {
        // Rate limit: Max 3 reset requests every 15 minutes
        $limiter = RateLimiter::check_limit( 'forgot_pass', 3, 900 );
        if ( is_wp_error( $limiter ) ) {
            return $limiter;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        if ( empty( $email ) ) {
            return new \WP_Error( 'missing_email', 'Email is required.', array( 'status' => 400 ) );
        }

        $user = get_user_by( 'email', $email );
        if ( ! $user ) {
            // Avoid user enumeration: return success anyway
            return new \WP_REST_Response( array(
                'success' => true,
                'message' => 'Password reset email sent if account exists.'
            ), 200 );
        }

        $key = get_password_reset_key( $user );
        $otp = (string) rand( 100000, 999999 );
        update_user_meta( $user->ID, 'wlc_reset_otp', $otp );
        update_user_meta( $user->ID, 'wlc_reset_otp_time', time() );

        $reset_url = home_url( "/reset-password?key={$key}&login=" . rawurlencode( $user->user_login ) );
        $subject   = 'Password Reset Request';
        $message   = "Hello,\n\nReset your password here:\n{$reset_url}\n\nOTP Verification Code: {$otp}\n";

        wp_mail( $email, $subject, $message );

        return new \WP_REST_Response( array(
            'success' => true,
            'message' => 'Password reset email sent.'
        ), 200 );
    }

    /**
     * Reset password using token key
     */
    public function reset_password( \WP_REST_Request $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $key      = isset( $params['key'] ) ? sanitize_text_field( $params['key'] ) : '';
        $login    = isset( $params['login'] ) ? sanitize_text_field( $params['login'] ) : '';
        $password = isset( $params['password'] ) ? $params['password'] : '';

        if ( empty( $key ) || empty( $login ) || empty( $password ) ) {
            return new \WP_Error( 'missing_fields', 'Key, login, and password are required.', array( 'status' => 400 ) );
        }

        $user = check_password_reset_key( $key, $login );
        if ( is_wp_error( $user ) ) {
            return new \WP_Error( 'invalid_key', 'The reset token is invalid or expired.', array( 'status' => 400 ) );
        }

        if ( strlen( $password ) < 8 ) {
            return new \WP_Error( 'weak_password', 'Password must be at least 8 characters long.', array( 'status' => 400 ) );
        }

        reset_password( $user, $password );

        return new \WP_REST_Response( array(
            'success' => true,
            'message' => 'Your password has been successfully reset.'
        ), 200 );
    }

    /**
     * Verify email OTP code
     */
    public function verify_email( \WP_REST_Request $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $otp   = isset( $params['otp'] ) ? sanitize_text_field( $params['otp'] ) : '';

        if ( empty( $email ) || empty( $otp ) ) {
            return new \WP_Error( 'missing_fields', 'Email and OTP are required.', array( 'status' => 400 ) );
        }

        $user = get_user_by( 'email', $email );
        if ( ! $user ) {
            return new \WP_Error( 'user_not_found', 'User account not found.', 404 );
        }

        $saved_otp = get_user_meta( $user->ID, 'wlc_reset_otp', true );
        $otp_time  = get_user_meta( $user->ID, 'wlc_reset_otp_time', true );

        if ( ! $saved_otp || $saved_otp !== $otp || ( time() - intval( $otp_time ) ) > 900 ) {
            return new \WP_Error( 'invalid_otp', 'The OTP code is incorrect or expired.', 400 );
        }

        delete_user_meta( $user->ID, 'wlc_reset_otp' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_time' );

        // Update membership status to Active
        update_user_meta( $user->ID, 'wlc_membership_status', 'Active' );

        return new \WP_REST_Response( array(
            'success' => true,
            'message' => 'OTP verification successful.'
        ), 200 );
    }

    /**
     * Refresh expired token session
     */
    public function refresh_token( \WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        if ( ! $user_id ) {
            return new \WP_Error( 'unauthorized', 'Session invalid.', array( 'status' => 401 ) );
        }

        $token = Jwt::generate_token( $user_id );

        return new \WP_REST_Response( array(
            'token'         => $token,
            'refresh_token' => ''
        ), 200 );
    }

    /**
     * Verify token signature validity
     */
    public function verify_token( \WP_REST_Request $request ) {
        $headers = apache_request_headers();
        $auth    = isset( $headers['Authorization'] ) ? $headers['Authorization'] : '';

        if ( empty( $auth ) && isset( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
            $auth = $_SERVER['HTTP_AUTHORIZATION'];
        }

        if ( empty( $auth ) ) {
            return new \WP_Error( 'missing_token', 'No authorization header found.', array( 'status' => 400 ) );
        }

        list( $token ) = sscanf( $auth, 'Bearer %s' );
        $decoded = Jwt::validate_token( $token );

        if ( ! $decoded ) {
            return new \WP_Error( 'invalid_token', 'Token is expired or invalid.', array( 'status' => 401 ) );
        }

        return new \WP_REST_Response( array(
            'success' => true,
            'valid'   => true
        ), 200 );
    }
}

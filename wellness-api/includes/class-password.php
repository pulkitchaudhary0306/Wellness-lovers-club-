<?php
/**
 * Password and verification REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Password {

    /**
     * Register routes
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/forgot-password', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( $this, 'forgot_password' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( $namespace, '/reset-password', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( $this, 'reset_password' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( $namespace, '/verify-email', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( $this, 'verify_email' ),
            'permission_callback' => '__return_true',
        ) );

        register_rest_route( $namespace, '/change-password', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array( $this, 'change_password' ),
            'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
        ) );
    }

    /**
     * Forgot Password Endpoint
     */
    public function forgot_password( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['email'] ) ) {
            return Wellness_API_Response::error( 'missing_email', 'Email field is required.', 400 );
        }

        $email = sanitize_email( $params['email'] );
        $user = get_user_by( 'email', $email );

        // Avoid user enumeration: return success even if user doesn't exist
        if ( ! $user ) {
            return Wellness_API_Response::success( array(
                'success' => true,
                'message' => 'If the account exists, a reset link and OTP has been sent.'
            ) );
        }

        // Generate WordPress reset key
        $key = get_password_reset_key( $user );
        if ( is_wp_error( $key ) ) {
            return Wellness_API_Response::error( 'key_failed', 'Could not generate reset key.', 500 );
        }

        // Generate 6-digit OTP for fallback verification
        $otp = (string) rand( 100000, 999999 );
        update_user_meta( $user->ID, 'wlc_reset_otp', $otp );
        update_user_meta( $user->ID, 'wlc_reset_otp_time', time() );

        // Send reset email
        $reset_url = home_url( "/reset-password?key={$key}&login=" . rawurlencode( $user->user_login ) );
        $subject = 'Password Reset Request | Wellness Lovers Club';
        $message = "Hello,\n\nWe received a request to reset your password for Wellness Lovers Club.\n\n";
        $message .= "You can reset your password using the following link:\n{$reset_url}\n\n";
        $message .= "Or enter this 6-digit OTP code to verify your identity:\n{$otp}\n\n";
        $message .= "If you did not request this password reset, please ignore this email.\n";

        wp_mail( $email, $subject, $message );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'Password reset email sent.'
        ) );
    }

    /**
     * Reset Password Endpoint
     */
    public function reset_password( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['key'] ) || empty( $params['login'] ) || empty( $params['password'] ) ) {
            return Wellness_API_Response::error( 'missing_fields', 'Key, login, and password are required.', 400 );
        }

        $key = sanitize_text_field( $params['key'] );
        $login = sanitize_text_field( $params['login'] );
        $password = $params['password'];

        $user = check_password_reset_key( $key, $login );
        if ( is_wp_error( $user ) ) {
            return Wellness_API_Response::error( 'invalid_key', 'The reset token is invalid or has expired.', 400 );
        }

        if ( strlen( $password ) < 8 ) {
            return Wellness_API_Response::error( 'weak_password', 'Password must be at least 8 characters long.', 400 );
        }

        reset_password( $user, $password );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'Your password has been successfully reset.'
        ) );
    }

    /**
     * Verify OTP / Email Endpoint
     */
    public function verify_email( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['email'] ) || empty( $params['otp'] ) ) {
            return Wellness_API_Response::error( 'missing_fields', 'Email and OTP are required.', 400 );
        }

        $email = sanitize_email( $params['email'] );
        $otp = sanitize_text_field( $params['otp'] );

        $user = get_user_by( 'email', $email );
        if ( ! $user ) {
            return Wellness_API_Response::error( 'user_not_found', 'User account not found.', 404 );
        }

        $saved_otp = get_user_meta( $user->ID, 'wlc_reset_otp', true );
        $otp_time = get_user_meta( $user->ID, 'wlc_reset_otp_time', true );

        // Validate OTP and time limits (15 minutes expiration)
        if ( ! $saved_otp || $saved_otp !== $otp || ( time() - intval( $otp_time ) ) > 900 ) {
            return Wellness_API_Response::error( 'invalid_otp', 'The OTP code is incorrect or expired.', 400 );
        }

        // Clean up OTP meta
        delete_user_meta( $user->ID, 'wlc_reset_otp' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_time' );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'OTP verification successful.'
        ) );
    }

    /**
     * Change Password Endpoint for Logged In User
     */
    public function change_password( $request ) {
        $user_id = get_current_user_id();
        $user = get_userdata( $user_id );
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['current_password'] ) || empty( $params['new_password'] ) ) {
            return Wellness_API_Response::error( 'missing_passwords', 'Current and new passwords are required.', 400 );
        }

        $current_pass = $params['current_password'];
        $new_pass = $params['new_password'];

        if ( ! wp_check_password( $current_pass, $user->user_pass, $user_id ) ) {
            return Wellness_API_Response::error( 'incorrect_password', 'Current password is incorrect.', 400 );
        }

        if ( strlen( $new_pass ) < 8 ) {
            return Wellness_API_Response::error( 'weak_password', 'New password must be at least 8 characters long.', 400 );
        }

        wp_set_password( $new_pass, $user_id );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'Password changed successfully.'
        ) );
    }
}

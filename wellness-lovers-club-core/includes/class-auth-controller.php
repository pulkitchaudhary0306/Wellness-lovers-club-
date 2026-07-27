<?php
/**
 * Authentication and Account flow handler
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Auth_Controller {

    private static function wlc_meta_prefix( $key ) {
        return 'wlc_' . $key;
    }

    public static function wlc_get_custom_meta_keys() {
        return array(
            'phone'                 => self::wlc_meta_prefix( 'phone' ),
            'profession'            => self::wlc_meta_prefix( 'profession' ),
            'companyName'           => self::wlc_meta_prefix( 'company_name' ),
            'correspondenceAddress' => self::wlc_meta_prefix( 'correspondence_address' ),
            'preferences'           => self::wlc_meta_prefix( 'preferences' ),
            'membershipStatus'      => self::wlc_meta_prefix( 'membership_status' ),
            'membershipTier'        => self::wlc_meta_prefix( 'membership_tier' ),
        );
    }

    public static function update_wlc_user_meta( $user_id, $key, $value ) {
        $keys = self::wlc_get_custom_meta_keys();
        $meta_key = isset( $keys[$key] ) ? $keys[$key] : $key;
        return update_user_meta( $user_id, $meta_key, $value );
    }

    public static function get_wlc_user_meta( $user_id, $key, $single = true ) {
        $keys = self::wlc_get_custom_meta_keys();
        $meta_key = isset( $keys[$key] ) ? $keys[$key] : $key;
        return get_user_meta( $user_id, $meta_key, $single );
    }

    /**
     * User registration handler
     */
    public function register( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Validation
        if ( empty( $params['name'] ) || empty( $params['email'] ) || empty( $params['password'] ) || empty( $params['phone'] ) ) {
            return new WP_Error( 'missing_fields', 'Required registration fields are missing.', array( 'status' => 400 ) );
        }

        $email = sanitize_email( $params['email'] );
        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        if ( email_exists( $email ) ) {
            return new WP_Error( 'email_taken', 'This email address is already registered.', array( 'status' => 400 ) );
        }

        if ( strlen( $params['password'] ) < 8 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 8 characters long.', array( 'status' => 400 ) );
        }

        $parts = explode( ' ', trim( $params['name'] ), 2 );
        $first_name = isset( $parts[0] ) ? sanitize_text_field( $parts[0] ) : '';
        $last_name  = isset( $parts[1] ) ? sanitize_text_field( $parts[1] ) : '';

        // Create User
        $user_id = wp_insert_user( array(
            'user_login' => $email,
            'user_email' => $email,
            'user_pass'  => $params['password'],
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'role'       => 'subscriber'
        ) );

        if ( is_wp_error( $user_id ) ) {
            return new WP_Error( 'registration_error', $user_id->get_error_message(), array( 'status' => 500 ) );
        }

        // Save Custom Metadata
        self::update_wlc_user_meta( $user_id, 'phone', sanitize_text_field( $params['phone'] ) );
        self::update_wlc_user_meta( $user_id, 'profession', isset( $params['profession'] ) ? sanitize_text_field( $params['profession'] ) : '' );
        self::update_wlc_user_meta( $user_id, 'companyName', isset( $params['companyName'] ) ? sanitize_text_field( $params['companyName'] ) : '' );
        self::update_wlc_user_meta( $user_id, 'correspondenceAddress', isset( $params['correspondenceAddress'] ) ? sanitize_textarea_field( $params['correspondenceAddress'] ) : '' );
        
        if ( ! empty( $params['preferences'] ) ) {
            $prefs = is_array( $params['preferences'] ) ? array_map( 'sanitize_text_field', $params['preferences'] ) : array( sanitize_text_field( $params['preferences'] ) );
            self::update_wlc_user_meta( $user_id, 'preferences', $prefs );
        }

        self::update_wlc_user_meta( $user_id, 'membershipStatus', 'Inactive' );
        self::update_wlc_user_meta( $user_id, 'membershipTier', 'Lotus Club' );

        // Generate Registration OTP
        $otp = (string) rand( 100000, 999999 );
        update_user_meta( $user_id, 'wlc_reset_otp', $otp );
        update_user_meta( $user_id, 'wlc_reset_otp_time', time() );

        // Log Event
        WLC_Core_Logger::log( "User registered successfully: ID {$user_id}, Email {$email}", 'INFO' );

        // Send OTP Verification Email
        WLC_Core_Emails::send_verification_otp( $email, $first_name, $otp );

        // Generate JWT Token
        $token = WLC_Core_JWT::generate_token( $user_id );

        // Prepare Frontend User Data
        $user_data = array(
            'id'               => (string) $user_id,
            'firstName'        => $first_name,
            'lastName'         => $last_name,
            'email'            => $email,
            'phone'            => sanitize_text_field( $params['phone'] ),
            'profession'       => isset( $params['profession'] ) ? sanitize_text_field( $params['profession'] ) : '',
            'companyName'      => isset( $params['companyName'] ) ? sanitize_text_field( $params['companyName'] ) : '',
            'country'          => '',
            'membershipStatus' => 'Inactive',
            'membershipTier'   => 'Lotus Club'
        );

        return new WP_REST_Response( array(
            'token'         => $token,
            'refresh_token' => '',
            'user'          => $user_data
        ), 201 );
    }

    /**
     * User Login handler
     */
    public function login( $request ) {
        // Rate limit: Max 5 login attempts per 5 minutes
        $limit = WLC_Core_Rate_Limiter::check_limit( 'login', 5, 300 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Support both custom login format and standard username/password format
        $username = isset( $params['usernameOrEmail'] ) ? sanitize_text_field( $params['usernameOrEmail'] ) : ( isset( $params['username'] ) ? sanitize_text_field( $params['username'] ) : '' );
        $password = isset( $params['password'] ) ? $params['password'] : '';

        if ( empty( $username ) || empty( $password ) ) {
            return new WP_Error( 'missing_credentials', 'Username and password are required.', array( 'status' => 400 ) );
        }

        // Authenticate User
        $user = wp_authenticate( $username, $password );

        if ( is_wp_error( $user ) ) {
            WLC_Core_Logger::log( "Failed login attempt for user: {$username}", 'WARNING' );
            return new WP_Error( 'invalid_credentials', 'The username or password entered is incorrect.', array( 'status' => 401 ) );
        }

        // Check if user is active (OTP verified)
        $status = self::get_wlc_user_meta( $user->ID, 'membershipStatus' );
        if ( $status === 'Inactive' ) {
            // Generate a fresh OTP and resend
            $otp = (string) rand( 100000, 999999 );
            update_user_meta( $user->ID, 'wlc_reset_otp', $otp );
            update_user_meta( $user->ID, 'wlc_reset_otp_time', time() );
            WLC_Core_Emails::send_verification_otp( $user->user_email, $user->first_name, $otp );
        }

        WLC_Core_Logger::log( "User logged in successfully: ID {$user->ID}", 'INFO' );

        // Generate JWT Token
        $token = WLC_Core_JWT::generate_token( $user->ID );

        $user_data = array(
            'id'               => (string) $user->ID,
            'firstName'        => $user->first_name,
            'lastName'         => $user->last_name,
            'email'            => $user->user_email,
            'phone'            => self::get_wlc_user_meta( $user->ID, 'phone' ),
            'profession'       => self::get_wlc_user_meta( $user->ID, 'profession' ),
            'companyName'      => self::get_wlc_user_meta( $user->ID, 'companyName' ),
            'country'          => '',
            'membershipStatus' => $status ?: 'Inactive',
            'membershipTier'   => self::get_wlc_user_meta( $user->ID, 'membershipTier' ) ?: 'Lotus Club'
        );

        return new WP_REST_Response( array(
            'token'         => $token,
            'refresh_token' => '',
            'user'          => $user_data
        ), 200 );
    }

    /**
     * User Logout handler
     */
    public function logout( $request ) {
        WLC_Core_Logger::log( "User logged out: ID " . get_current_user_id(), 'INFO' );
        return new WP_REST_Response( array( 'success' => true, 'message' => 'Logged out successfully.' ), 200 );
    }

    /**
     * Forgot Password handler: Sends reset OTP
     */
    public function forgot_password( $request ) {
        // Rate limit: Max 3 password reset requests per 15 minutes
        $limit = WLC_Core_Rate_Limiter::check_limit( 'forgot_password', 3, 900 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['email'] ) ) {
            return new WP_Error( 'missing_email', 'Email address is required.', array( 'status' => 400 ) );
        }

        $email = sanitize_email( $params['email'] );
        $user = get_user_by( 'email', $email );

        if ( ! $user ) {
            // Avoid user enumeration: return success even if email doesn't exist
            return new WP_REST_Response( array( 'success' => true, 'message' => 'If the account exists, a reset code has been sent.' ), 200 );
        }

        $key = get_password_reset_key( $user );
        $otp = (string) rand( 100000, 999999 );
        
        update_user_meta( $user->ID, 'wlc_reset_otp', $otp );
        update_user_meta( $user->ID, 'wlc_reset_otp_time', time() );

        $reset_url = home_url( "/reset-password?key={$key}&login=" . rawurlencode( $user->user_login ) );

        WLC_Core_Logger::log( "Password reset requested for: {$email}", 'INFO' );

        WLC_Core_Emails::send_password_reset_otp( $email, $otp, $reset_url );

        return new WP_REST_Response( array( 'success' => true, 'message' => 'Password reset email sent.' ), 200 );
    }

    /**
     * Reset Password handler
     */
    public function reset_password( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['key'] ) || empty( $params['login'] ) || empty( $params['password'] ) ) {
            return new WP_Error( 'missing_fields', 'Required reset parameters are missing.', array( 'status' => 400 ) );
        }

        $user = check_password_reset_key( $params['key'], $params['login'] );
        if ( is_wp_error( $user ) ) {
            return new WP_Error( 'invalid_key', 'The reset link is invalid or expired.', array( 'status' => 400 ) );
        }

        if ( strlen( $params['password'] ) < 8 ) {
            return new WP_Error( 'weak_password', 'New password must be at least 8 characters long.', array( 'status' => 400 ) );
        }

        reset_password( $user, $params['password'] );
        WLC_Core_Logger::log( "Password reset successful for user ID: {$user->ID}", 'INFO' );

        return new WP_REST_Response( array( 'success' => true, 'message' => 'Your password has been successfully reset.' ), 200 );
    }

    /**
     * Email / OTP verification handler
     */
    public function verify_email( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['email'] ) || empty( $params['otp'] ) ) {
            return new WP_Error( 'missing_fields', 'Email and OTP are required.', array( 'status' => 400 ) );
        }

        $email = sanitize_email( $params['email'] );
        $otp   = sanitize_text_field( $params['otp'] );

        $user = get_user_by( 'email', $email );
        if ( ! $user ) {
            return new WP_Error( 'user_not_found', 'User account not found.', array( 'status' => 404 ) );
        }

        $saved_otp = get_user_meta( $user->ID, 'wlc_reset_otp', true );
        $otp_time  = get_user_meta( $user->ID, 'wlc_reset_otp_time', true );

        if ( ! $saved_otp || $saved_otp !== $otp || ( time() - intval( $otp_time ) ) > 900 ) {
            WLC_Core_Logger::log( "Failed OTP verification attempt for User ID: {$user->ID}", 'WARNING' );
            return new WP_Error( 'invalid_otp', 'The OTP code is incorrect or expired.', array( 'status' => 400 ) );
        }

        // Clean up OTP metadata
        delete_user_meta( $user->ID, 'wlc_reset_otp' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_time' );

        // Activate User Account
        self::update_wlc_user_meta( $user->ID, 'membershipStatus', 'Active' );

        WLC_Core_Logger::log( "Successful OTP email verification for User ID: {$user->ID}", 'INFO' );

        // Send Welcome email
        WLC_Core_Emails::send_welcome_email( $email, $user->first_name );

        return new WP_REST_Response( array( 'success' => true, 'message' => 'OTP verification successful.' ), 200 );
    }

    /**
     * Change Password handler (Authenticated users only)
     */
    public function change_password( $request ) {
        $user_id = get_current_user_id();
        $user = get_userdata( $user_id );
        
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['current_password'] ) || empty( $params['new_password'] ) ) {
            return new WP_Error( 'missing_passwords', 'Current and new passwords are required.', array( 'status' => 400 ) );
        }

        if ( ! wp_check_password( $params['current_password'], $user->user_pass, $user_id ) ) {
            return new WP_Error( 'incorrect_password', 'Current password is incorrect.', array( 'status' => 400 ) );
        }

        if ( strlen( $params['new_password'] ) < 8 ) {
            return new WP_Error( 'weak_password', 'New password must be at least 8 characters long.', array( 'status' => 400 ) );
        }

        wp_set_password( $params['new_password'], $user_id );
        WLC_Core_Logger::log( "Changed password successfully for user ID: {$user_id}", 'INFO' );

        return new WP_REST_Response( array( 'success' => true, 'message' => 'Your password has been changed successfully.' ), 200 );
    }
}

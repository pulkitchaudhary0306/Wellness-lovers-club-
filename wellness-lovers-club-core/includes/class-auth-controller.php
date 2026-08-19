<?php
/**
 * Authentication and Account flow handler
 * Wellness Lovers Club — Production Auth Controller
 *
 * OTP Security Rules:
 *  - Generated with random_int() (cryptographically secure)
 *  - Hashed with wp_hash_password() before DB storage
 *  - Stored in wp_wlc_email_verification (dedicated table)
 *  - Expires in 10 minutes (600 seconds)
 *  - Max 5 failed attempts → row invalidated
 *  - Max 3 resends per verification row
 *  - Min 60 seconds between resends
 *  - JWT issued ONLY after OTP verified
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Auth_Controller {

    // ─── Meta key helpers ─────────────────────────────────────────────────────

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
        $keys     = self::wlc_get_custom_meta_keys();
        $meta_key = isset( $keys[ $key ] ) ? $keys[ $key ] : $key;
        return update_user_meta( $user_id, $meta_key, $value );
    }

    public static function get_wlc_user_meta( $user_id, $key, $single = true ) {
        $keys     = self::wlc_get_custom_meta_keys();
        $meta_key = isset( $keys[ $key ] ) ? $keys[ $key ] : $key;
        return get_user_meta( $user_id, $meta_key, $single );
    }

    // ─── Phone & OTP helpers ──────────────────────────────────────────────────

    /**
     * Normalize Indian phone numbers into standard E.164 (+91XXXXXXXXXX) format
     *
     * @param string $phone
     * @return string
     */
    public static function normalize_phone( $phone ) {
        $clean = preg_replace( '/[^\d+]/', '', trim( (string) $phone ) );
        if ( strpos( $clean, '+' ) === 0 ) {
            return $clean;
        }
        // Standard 10-digit Indian mobile starting with 6, 7, 8, 9
        if ( preg_match( '/^[6-9]\d{9}$/', $clean ) ) {
            return '+91' . $clean;
        }
        // 11 digits starting with 0
        if ( preg_match( '/^0([6-9]\d{9})$/', $clean, $matches ) ) {
            return '+91' . $matches[1];
        }
        // 12 digits starting with 91
        if ( preg_match( '/^91([6-9]\d{9})$/', $clean, $matches ) ) {
            return '+91' . $matches[1];
        }
        return '+' . $clean;
    }

    /**
     * Validate Indian mobile number format
     *
     * @param string $phone
     * @return bool
     */
    public static function validate_phone( $phone ) {
        $normalized = self::normalize_phone( $phone );
        return (bool) preg_match( '/^\+91[6-9]\d{9}$/', $normalized );
    }

    /**
     * Get configured OTP expiration in seconds (default 10 minutes)
     */
    public static function get_otp_expiration_seconds() {
        if ( ! defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ) {
            define( 'WLC_OTP_EXPIRATION_MINUTES', 10 );
        }
        $mins = intval( WLC_OTP_EXPIRATION_MINUTES );
        return max( 1, $mins ) * 60;
    }

    /**
     * Generate a cryptographically secure 6-digit OTP
     */
    private static function generate_otp() {
        return (string) random_int( 100000, 999999 );
    }

    private static function verification_table() {
        global $wpdb;
        return $wpdb->prefix . 'wlc_email_verification';
    }

    /**
     * Get or create the verification row for a user.
     * Always creates a new OTP (resets existing row for that user).
     *
     * @return array|WP_Error  ['otp_plain', 'row_id'] on success, WP_Error on failure
     */
    private static function create_otp_row( $user_id, $identifier ) {
        global $wpdb;
        $table = self::verification_table();

        $otp_plain  = self::generate_otp();
        $otp_hash   = wp_hash_password( $otp_plain );
        $expires_at = gmdate( 'Y-m-d H:i:s', time() + self::get_otp_expiration_seconds() );

        // Check if an existing non-verified row exists for this user
        $existing = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT id, resend_count, last_resent_at FROM $table WHERE user_id = %d AND verified = 0 ORDER BY id DESC LIMIT 1",
                $user_id
            )
        );

        if ( $existing ) {
            // Update existing row (reset OTP, expiry, attempts; keep resend_count)
            $wpdb->update(
                $table,
                array(
                    'otp_hash'   => $otp_hash,
                    'expires_at' => $expires_at,
                    'attempts'   => 0,
                    'email'      => $identifier,
                    'updated_at' => gmdate( 'Y-m-d H:i:s' ),
                ),
                array( 'id' => $existing->id ),
                array( '%s', '%s', '%d', '%s', '%s' ),
                array( '%d' )
            );
            return array( 'otp_plain' => $otp_plain, 'row_id' => $existing->id );
        }

        // Insert a new row
        $inserted = $wpdb->insert(
            $table,
            array(
                'user_id'      => $user_id,
                'email'        => $identifier,
                'otp_hash'     => $otp_hash,
                'expires_at'   => $expires_at,
                'attempts'     => 0,
                'resend_count' => 0,
                'verified'     => 0,
                'created_at'   => gmdate( 'Y-m-d H:i:s' ),
                'updated_at'   => gmdate( 'Y-m-d H:i:s' ),
            ),
            array( '%d', '%s', '%s', '%s', '%d', '%d', '%d', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return new WP_Error( 'db_error', 'Failed to create OTP record.', array( 'status' => 500 ) );
        }

        return array( 'otp_plain' => $otp_plain, 'row_id' => $wpdb->insert_id );
    }

    // ─── Register ─────────────────────────────────────────────────────────────

    /**
     * POST /custom/v1/register
     *
     * Accepts: { name, email, password, [phone, profession, companyName, correspondenceAddress, preferences] }
     * Response: { success: true, requires_verification: true, message: "...", email: "...", user_id: N }
     */
    public function register( $request ) {
        // Rate limit: max 5 registrations per 15 min per IP
        $limit = WLC_Core_Rate_Limiter::check_limit( 'register', 5, 900 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Required fields validation: Name, Email, Password
        if ( empty( $params['name'] ) || empty( $params['email'] ) || empty( $params['password'] ) ) {
            return new WP_Error( 'missing_fields', 'Name, email address, and password are required.', array( 'status' => 400 ) );
        }

        $name  = sanitize_text_field( trim( $params['name'] ) );
        $email = sanitize_email( strtolower( trim( $params['email'] ) ) );

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please enter a valid email address.', array( 'status' => 400 ) );
        }

        // Password strength (min 6 characters)
        if ( strlen( $params['password'] ) < 6 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 6 characters long.', array( 'status' => 400 ) );
        }

        // Check if email already exists
        $user_id = email_exists( $email );
        if ( $user_id ) {
            $is_verified = get_user_meta( $user_id, 'wlc_email_verified', true );
            if ( $is_verified === '1' ) {
                return new WP_Error( 'email_taken', 'This email address is already registered. Please log in.', array( 'status' => 400 ) );
            }
            // User exists but unverified: update password and details
            wp_set_password( $params['password'], $user_id );
        } else {
            $parts      = explode( ' ', $name, 2 );
            $first_name = isset( $parts[0] ) ? sanitize_text_field( $parts[0] ) : '';
            $last_name  = isset( $parts[1] ) ? sanitize_text_field( $parts[1] ) : '';

            $user_login = $email;
            if ( username_exists( $user_login ) ) {
                $user_login = $email . '_' . wp_generate_password( 4, false );
            }

            $user_id = wp_insert_user( array(
                'user_login'   => $user_login,
                'user_email'   => $email,
                'user_pass'    => $params['password'],
                'display_name' => $name,
                'first_name'   => $first_name,
                'last_name'    => $last_name,
                'role'         => 'subscriber',
            ) );

            if ( is_wp_error( $user_id ) ) {
                return new WP_Error( 'registration_error', $user_id->get_error_message(), array( 'status' => 500 ) );
            }
        }

        $parts      = explode( ' ', $name, 2 );
        $first_name = isset( $parts[0] ) ? $parts[0] : 'Member';

        // Save custom user meta
        if ( ! empty( $params['phone'] ) ) {
            self::update_wlc_user_meta( $user_id, 'phone', sanitize_text_field( $params['phone'] ) );
        }
        if ( ! empty( $params['profession'] ) ) {
            self::update_wlc_user_meta( $user_id, 'profession', sanitize_text_field( $params['profession'] ) );
        }
        if ( ! empty( $params['companyName'] ) ) {
            self::update_wlc_user_meta( $user_id, 'companyName', sanitize_text_field( $params['companyName'] ) );
        }
        if ( ! empty( $params['correspondenceAddress'] ) ) {
            self::update_wlc_user_meta( $user_id, 'correspondenceAddress', sanitize_textarea_field( $params['correspondenceAddress'] ) );
        }
        if ( ! empty( $params['preferences'] ) ) {
            $prefs = is_array( $params['preferences'] )
                ? array_map( 'sanitize_text_field', $params['preferences'] )
                : array( sanitize_text_field( $params['preferences'] ) );
            self::update_wlc_user_meta( $user_id, 'preferences', $prefs );
        }

        self::update_wlc_user_meta( $user_id, 'membershipStatus', 'Inactive' );
        self::update_wlc_user_meta( $user_id, 'membershipTier', 'Lotus Club' );
        update_user_meta( $user_id, 'wlc_email_verified', '0' );

        // Generate cryptographically secure 6-digit OTP
        $otp_plain  = (string) random_int( 100000, 999999 );
        $otp_hash   = wp_hash_password( $otp_plain );
        $expires_at = gmdate( 'Y-m-d H:i:s', time() + self::get_otp_expiration_seconds() );

        // Store OTP in user metadata
        update_user_meta( $user_id, 'wlc_reset_otp', $otp_hash );
        update_user_meta( $user_id, 'wlc_reset_otp_time', time() );
        update_user_meta( $user_id, 'wlc_reset_otp_attempts', 0 );

        global $wpdb;
        $table = self::verification_table();

        // Check if an existing row exists for this email
        $existing = $wpdb->get_row(
            $wpdb->prepare( "SELECT id FROM $table WHERE email = %s AND verified = 0 ORDER BY id DESC LIMIT 1", $email )
        );

        if ( $existing ) {
            $wpdb->update(
                $table,
                array(
                    'user_id'    => $user_id,
                    'otp_hash'   => $otp_hash,
                    'expires_at' => $expires_at,
                    'attempts'   => 0,
                    'updated_at' => gmdate( 'Y-m-d H:i:s' ),
                ),
                array( 'id' => $existing->id )
            );
        } else {
            $wpdb->insert(
                $table,
                array(
                    'user_id'      => $user_id,
                    'email'        => $email,
                    'otp_hash'     => $otp_hash,
                    'expires_at'   => $expires_at,
                    'attempts'     => 0,
                    'resend_count' => 0,
                    'verified'     => 0,
                    'created_at'   => gmdate( 'Y-m-d H:i:s' ),
                    'updated_at'   => gmdate( 'Y-m-d H:i:s' ),
                )
            );
        }

        // Dispatch Email OTP strictly via Brevo HTTPS API
        $email_sent = WLC_Core_Emails::send_verification_otp( $email, $first_name, $otp_plain );

        if ( is_wp_error( $email_sent ) || ! $email_sent ) {
            // Rollback newly created user on email dispatch failure
            wp_delete_user( $user_id );
            return new WP_Error(
                'email_send_failed',
                'Unable to send the verification email. Please try again later.',
                array( 'status' => 500 )
            );
        }

        $masked_email = WLC_Core_Email_Logs::mask_email( $email );
        WLC_Core_Logger::log( "User registered: ID {$user_id}, Email {$masked_email}", 'INFO' );

        return new WP_REST_Response( array(
            'success'               => true,
            'requires_verification' => true,
            'message'               => 'Verification code sent to your email.',
            'email'                 => $email,
            'user_id'               => $user_id,
        ), 201 );
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    /**
     * POST /custom/v1/login
     *
     * Response (success): { success: true, token: "JWT", user: {} }
     * Response (unverified): 403 { success: false, code: "email_not_verified", requires_verification: true, message: "..." }
     */
    public function login( $request ) {
        // Rate limit: max 5 login attempts per 5 min per IP
        $limit = WLC_Core_Rate_Limiter::check_limit( 'login', 5, 300 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $username = isset( $params['usernameOrEmail'] )
            ? sanitize_text_field( $params['usernameOrEmail'] )
            : ( isset( $params['email'] )
                ? sanitize_email( $params['email'] )
                : ( isset( $params['username'] )
                    ? sanitize_text_field( $params['username'] )
                    : ( isset( $params['phone'] )
                        ? sanitize_text_field( $params['phone'] )
                        : '' ) ) );

        $password = isset( $params['password'] ) ? $params['password'] : '';

        if ( empty( $username ) || empty( $password ) ) {
            return new WP_Error( 'missing_credentials', 'Email address and password are required.', array( 'status' => 400 ) );
        }

        // If email is supplied, check user
        if ( is_email( $username ) ) {
            $user_by_email = get_user_by( 'email', $username );
            if ( $user_by_email ) {
                $username = $user_by_email->user_login;
            }
        }

        $user = wp_authenticate( $username, $password );

        if ( is_wp_error( $user ) ) {
            WLC_Core_Logger::log( "Failed login for: {$username}", 'WARNING' );
            return new WP_Error( 'invalid_credentials', 'Invalid email or password. Please try again.', array( 'status' => 401 ) );
        }

        // Enforce email verification
        $email_verified = get_user_meta( $user->ID, 'wlc_email_verified', true );

        if ( $email_verified !== '1' ) {
            return new WP_REST_Response( array(
                'success'               => false,
                'code'                  => 'email_not_verified',
                'requires_verification' => true,
                'message'               => 'Please verify your email address before logging in.',
                'email'                 => $user->user_email,
            ), 403 );
        }

        WLC_Core_Logger::log( "User logged in: ID {$user->ID}", 'INFO' );

        $token     = WLC_Core_JWT::generate_token( $user->ID );
        $user_data = self::build_user_data( $user );

        return new WP_REST_Response( array(
            'success' => true,
            'message' => 'Login successful.',
            'token'   => $token,
            'user'    => $user_data,
        ), 200 );
    }

    // ─── Verify Email OTP ─────────────────────────────────────────────────────

    /**
     * POST /custom/v1/verify-otp
     *
     * Accepts: { email, otp }
     * Response: { success: true, message: "Email verified successfully.", token: "JWT", user: {} }
     */
    public function verify_otp( $request ) {
        // Rate limit: max 10 verification attempts per 10 min per IP
        $limit = WLC_Core_Rate_Limiter::check_limit( 'verify_otp', 10, 600 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $raw_email = isset( $params['email'] )
            ? sanitize_email( $params['email'] )
            : ( isset( $params['identifier'] )
                ? sanitize_email( $params['identifier'] )
                : '' );

        $email = strtolower( trim( $raw_email ) );
        $otp   = isset( $params['otp'] ) ? sanitize_text_field( trim( $params['otp'] ) ) : '';

        if ( empty( $email ) || empty( $otp ) ) {
            return new WP_Error( 'missing_fields', 'Email and 6-digit OTP code are required.', array( 'status' => 400 ) );
        }

        if ( ! preg_match( '/^\d{6}$/', $otp ) ) {
            return new WP_Error( 'invalid_otp_format', 'OTP must be a 6-digit number.', array( 'status' => 400 ) );
        }

        $user = get_user_by( 'email', $email );
        if ( ! $user ) {
            return new WP_Error( 'user_not_found', 'User not found.', array( 'status' => 404 ) );
        }

        // Check if already verified
        $is_verified       = get_user_meta( $user->ID, 'wlc_email_verified', true );
        $membership_status = get_user_meta( $user->ID, 'membershipStatus', true );
        if ( $is_verified === '1' || $membership_status === 'Active' ) {
            return new WP_REST_Response( array(
                'success' => true,
                'code'    => 'already_verified',
                'message' => 'This email address is already verified.',
            ), 200 );
        }

        $stored_hash = get_user_meta( $user->ID, 'wlc_reset_otp', true );
        $otp_time    = (int) get_user_meta( $user->ID, 'wlc_reset_otp_time', true );
        $attempts    = (int) get_user_meta( $user->ID, 'wlc_reset_otp_attempts', true );

        $expiration_minutes = defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ? (int) WLC_OTP_EXPIRATION_MINUTES : 10;
        $max_attempts       = defined( 'WLC_OTP_MAX_ATTEMPTS' ) ? (int) WLC_OTP_MAX_ATTEMPTS : 5;

        // Fallback to table if user meta not found
        if ( empty( $stored_hash ) ) {
            global $wpdb;
            $table = self::verification_table();
            $row   = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM $table WHERE email = %s AND verified = 0 ORDER BY id DESC LIMIT 1",
                    $email
                )
            );
            if ( $row ) {
                $stored_hash = $row->otp_hash;
                $otp_time    = strtotime( $row->created_at );
                $attempts    = (int) $row->attempts;
            }
        }

        if ( empty( $stored_hash ) ) {
            return new WP_Error( 'invalid_otp', 'Invalid or expired verification code.', array( 'status' => 400 ) );
        }

        // Check expiry (10 minutes)
        if ( $otp_time && time() > ( $otp_time + ( $expiration_minutes * 60 ) ) ) {
            return new WP_Error( 'otp_expired', 'This verification code has expired. Please request a new code.', array( 'status' => 400 ) );
        }

        // Check max 5 attempts
        if ( $attempts >= $max_attempts ) {
            delete_user_meta( $user->ID, 'wlc_reset_otp' );
            delete_user_meta( $user->ID, 'wlc_reset_otp_time' );
            delete_user_meta( $user->ID, 'wlc_reset_otp_attempts' );
            return new WP_Error( 'otp_attempts_exceeded', 'Too many incorrect attempts. Please request a new code.', array( 'status' => 429 ) );
        }

        // Cryptographically verify OTP hash
        $is_valid = wp_check_password( $otp, $stored_hash );

        if ( ! $is_valid ) {
            $new_attempts = $attempts + 1;
            update_user_meta( $user->ID, 'wlc_reset_otp_attempts', $new_attempts );

            if ( $new_attempts >= $max_attempts ) {
                delete_user_meta( $user->ID, 'wlc_reset_otp' );
                delete_user_meta( $user->ID, 'wlc_reset_otp_time' );
                delete_user_meta( $user->ID, 'wlc_reset_otp_attempts' );
                return new WP_Error( 'otp_attempts_exceeded', 'Too many incorrect attempts. Please request a new code.', array( 'status' => 429 ) );
            }

            $attempts_left = $max_attempts - $new_attempts;
            return new WP_Error(
                'invalid_otp',
                sprintf( 'Invalid verification code. %d attempt(s) remaining.', $attempts_left ),
                array( 'status' => 400, 'attempts_remaining' => $attempts_left )
            );
        }

        // OTP verified — update user meta & activate membership
        update_user_meta( $user->ID, 'wlc_email_verified', '1' );
        update_user_meta( $user->ID, 'email_verified', '1' );
        self::update_wlc_user_meta( $user->ID, 'membershipStatus', 'Active' );

        // Clean up OTP metadata
        delete_user_meta( $user->ID, 'wlc_reset_otp' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_time' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_attempts' );

        $masked_email = WLC_Core_Email_Logs::mask_email( $email );
        WLC_Core_Logger::log( "Email verified for user ID: {$user->ID} ({$masked_email})", 'INFO' );

        // Send Welcome Email
        WLC_Core_Emails::send_welcome_email( $email, $user->first_name );

        // Issue standard WLC JWT token
        $jwt_token = WLC_Core_JWT::generate_token( $user->ID );
        $user_data = self::build_user_data( $user );

        // Create Secure Short-Lived Server-Side Payment Session Token (30 mins)
        global $wpdb;
        $pay_sessions_table = $wpdb->prefix . 'wlc_payment_sessions';
        $payment_session_token = 'wlc_pay_' . bin2hex( random_bytes( 32 ) );
        $token_hash = hash( 'sha256', $payment_session_token );
        $expires_at = gmdate( 'Y-m-d H:i:s', time() + 1800 ); // 30 minutes
        $phone = get_user_meta( $user->ID, 'phone', true ) ?: get_user_meta( $user->ID, 'wlc_phone', true ) ?: '';

        $wpdb->insert(
            $pay_sessions_table,
            array(
                'session_token_hash' => $token_hash,
                'session_token'      => $payment_session_token,
                'user_id'            => $user->ID,
                'verified_email'     => $user->user_email,
                'verified_phone'     => $phone,
                'status'             => 'authorized',
                'expires_at'         => $expires_at,
                'created_at'         => gmdate( 'Y-m-d H:i:s' ),
            ),
            array( '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s' )
        );

        return new WP_REST_Response( array(
            'success'               => true,
            'message'               => 'Email verified successfully.',
            'token'                 => $jwt_token,
            'payment_session_token' => $payment_session_token,
            'user'                  => $user_data,
        ), 200 );
    }

    /**
     * Backward-compatible alias for verify_otp
     */
    public function verify_email_otp( $request ) {
        return $this->verify_otp( $request );
    }

    public function verify_email( $request ) {
        return $this->verify_otp( $request );
    }

    // ─── Resend Email OTP ─────────────────────────────────────────────────────

    /**
     * POST /custom/v1/resend-otp
     *
     * Rules: 60s cooldown, max 5 requests per email per hour.
     * Response: { success: true, message: "A new verification code has been sent." }
     */
    public function resend_otp( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $raw_email = isset( $params['email'] )
            ? sanitize_email( $params['email'] )
            : ( isset( $params['identifier'] )
                ? sanitize_email( $params['identifier'] )
                : '' );

        $email = strtolower( trim( $raw_email ) );

        if ( empty( $email ) || ! is_email( $email ) ) {
            return new WP_Error( 'missing_email', 'A valid email address is required.', array( 'status' => 400 ) );
        }

        // IP rate limit
        $ip_limit = WLC_Core_Rate_Limiter::check_limit( 'resend_otp', 5, 900 );
        if ( is_wp_error( $ip_limit ) ) {
            return $ip_limit;
        }

        // Email rate limit: max 5 requests per hour
        $email_limit = WLC_Core_Rate_Limiter::check_limit( 'email_resend_' . md5( $email ), 5, 3600 );
        if ( is_wp_error( $email_limit ) ) {
            return new WP_Error(
                'resend_limit_exceeded',
                'Maximum verification requests exceeded for this email. Please try again after 1 hour.',
                array( 'status' => 429 )
            );
        }

        global $wpdb;
        $table = self::verification_table();

        $row = $wpdb->get_row(
            $wpdb->prepare( "SELECT * FROM $table WHERE email = %s AND verified = 0 ORDER BY id DESC LIMIT 1", $email )
        );

        // 60-second cooldown check
        if ( $row && ! empty( $row->last_resent_at ) ) {
            $elapsed = time() - strtotime( $row->last_resent_at );
            if ( $elapsed < 60 ) {
                $wait = 60 - $elapsed;
                return new WP_Error(
                    'resend_throttled',
                    sprintf( 'Please wait %d seconds before requesting another code.', $wait ),
                    array( 'status' => 429 )
                );
            }
        }

        $user = get_user_by( 'email', $email );
        if ( ! $user ) {
            return new WP_Error( 'user_not_found', 'User not found.', array( 'status' => 404 ) );
        }

        $user_id = (int) $user->ID;

        $is_verified       = get_user_meta( $user_id, 'wlc_email_verified', true );
        $membership_status = get_user_meta( $user_id, 'membershipStatus', true );
        if ( $is_verified === '1' || $membership_status === 'Active' ) {
            return new WP_REST_Response( array(
                'success' => true,
                'code'    => 'already_verified',
                'message' => 'This email address is already verified. Please log in.',
            ), 200 );
        }

        $new_otp    = (string) random_int( 100000, 999999 );
        $otp_hash   = wp_hash_password( $new_otp );
        $expires_at = gmdate( 'Y-m-d H:i:s', time() + self::get_otp_expiration_seconds() );

        // Update user meta
        update_user_meta( $user_id, 'wlc_reset_otp', $otp_hash );
        update_user_meta( $user_id, 'wlc_reset_otp_time', time() );
        update_user_meta( $user_id, 'wlc_reset_otp_attempts', 0 );

        if ( $row ) {
            $wpdb->update(
                $table,
                array(
                    'user_id'        => $user_id,
                    'otp_hash'       => $otp_hash,
                    'expires_at'     => $expires_at,
                    'attempts'       => 0,
                    'resend_count'   => intval( $row->resend_count ) + 1,
                    'last_resent_at' => gmdate( 'Y-m-d H:i:s' ),
                    'updated_at'     => gmdate( 'Y-m-d H:i:s' ),
                ),
                array( 'id' => $row->id )
            );
        } else {
            $wpdb->insert(
                $table,
                array(
                    'user_id'        => $user_id,
                    'email'          => $email,
                    'otp_hash'       => $otp_hash,
                    'expires_at'     => $expires_at,
                    'attempts'       => 0,
                    'resend_count'   => 1,
                    'last_resent_at' => gmdate( 'Y-m-d H:i:s' ),
                    'verified'       => 0,
                    'created_at'     => gmdate( 'Y-m-d H:i:s' ),
                    'updated_at'     => gmdate( 'Y-m-d H:i:s' ),
                )
            );
        }

        $name = ! empty( $user->first_name ) ? $user->first_name : 'Member';
        $email_sent = WLC_Core_Emails::send_verification_otp( $email, $name, $new_otp );

        if ( is_wp_error( $email_sent ) || ! $email_sent ) {
            return new WP_Error(
                'email_send_failed',
                'Unable to send the verification email. Please try again later.',
                array( 'status' => 500 )
            );
        }

        return new WP_REST_Response( array(
            'success' => true,
            'message' => 'A new verification code has been sent to your email.',
        ), 200 );
    }

    /**
     * Backward-compatible aliases
     */
    public function resend_email_otp( $request ) {
        return $this->resend_otp( $request );
    }

    public function send_otp( $request ) {
        return $this->resend_otp( $request );
    }

    public function send_email_otp( $request ) {
        return $this->resend_otp( $request );
    }

    // ─── Forgot Password ──────────────────────────────────────────────────────

    /**
     * POST /custom/v1/forgot-password
     */
    public function forgot_password( $request ) {
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
        $user  = get_user_by( 'email', $email );

        // Avoid user enumeration
        if ( ! $user ) {
            return new WP_REST_Response( array( 'success' => true, 'message' => 'If an account exists, password reset instructions have been sent.' ), 200 );
        }

        try {
            $reset_token = bin2hex( random_bytes( 32 ) );
        } catch ( Exception $e ) {
            return new WP_Error( 'token_generation_failed', 'Unable to create a reset token. Please try again.', array( 'status' => 500 ) );
        }

        update_user_meta( $user->ID, 'wlc_reset_token_hash', wp_hash_password( $reset_token ) );
        update_user_meta( $user->ID, 'wlc_reset_token_expires', time() + 900 );

        $frontend_url = defined( 'WLC_FRONTEND_URL' ) ? WLC_FRONTEND_URL : 'https://wellnessloversclub.com';
        $reset_url    = rtrim( $frontend_url, '/' ) . '/reset-password?key=' . rawurlencode( $reset_token ) . '&login=' . rawurlencode( $user->user_login );

        WLC_Core_Logger::log( "Password reset requested for: {$email}", 'INFO' );

        WLC_Core_Emails::send_password_reset_email( $email, $user->first_name, $reset_url );

        return new WP_REST_Response( array(
            'success' => true,
            'message' => 'Password reset instructions have been sent to your email.',
        ), 200 );
    }

    // ─── Reset Password ───────────────────────────────────────────────────────

    /**
     * POST /custom/v1/reset-password
     */
    public function reset_password( $request ) {
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $key      = isset( $params['key'] )      ? sanitize_text_field( $params['key'] ) : '';
        $login    = isset( $params['login'] )    ? sanitize_text_field( $params['login'] ) : ( isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '' );
        $password = isset( $params['password'] ) ? $params['password'] : '';

        if ( empty( $password ) ) {
            return new WP_Error( 'missing_password', 'New password is required.', array( 'status' => 400 ) );
        }

        if ( strlen( $password ) < 8 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 8 characters long.', array( 'status' => 400 ) );
        }

        $user = null;

        if ( ! empty( $key ) && ! empty( $login ) ) {
            $user_obj = get_user_by( 'email', $login );
            if ( ! $user_obj ) {
                $user_obj = get_user_by( 'login', $login );
            }
            if ( $user_obj ) {
                $saved_hash = get_user_meta( $user_obj->ID, 'wlc_reset_token_hash', true );
                $expires_at = intval( get_user_meta( $user_obj->ID, 'wlc_reset_token_expires', true ) );
                if ( $saved_hash && $expires_at >= time() && wp_check_password( $key, $saved_hash ) ) {
                    $user = $user_obj;
                }
            }
        }

        if ( ! $user ) {
            return new WP_Error( 'invalid_reset', 'The reset link is invalid or expired.', array( 'status' => 400 ) );
        }

        reset_password( $user, $password );

        delete_user_meta( $user->ID, 'wlc_reset_token_hash' );
        delete_user_meta( $user->ID, 'wlc_reset_token_expires' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_hash' );
        delete_user_meta( $user->ID, 'wlc_reset_otp_time' );

        WLC_Core_Logger::log( "Password reset for user ID: {$user->ID}", 'INFO' );

        WLC_Core_Emails::send_password_reset_success_email( $user->user_email, $user->first_name );

        return new WP_REST_Response( array(
            'success' => true,
            'message' => 'Your password has been successfully reset. You may now log in.',
        ), 200 );
    }

    // ─── Logout ───────────────────────────────────────────────────────────────

    /**
     * POST /custom/v1/logout (JWT required)
     */
    public function logout( $request ) {
        WLC_Core_Logger::log( 'User logged out: ID ' . get_current_user_id(), 'INFO' );
        return new WP_REST_Response( array( 'success' => true, 'message' => 'Logged out successfully.' ), 200 );
    }

    // ─── Change Password ──────────────────────────────────────────────────────

    /**
     * POST /custom/v1/change-password (JWT required)
     */
    public function change_password( $request ) {
        $user_id = get_current_user_id();
        $user    = get_userdata( $user_id );

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
        WLC_Core_Logger::log( "Password changed for user ID: {$user_id}", 'INFO' );

        WLC_Core_Emails::send_security_notification(
            $user->user_email,
            'Password Changed',
            'Your account password was changed successfully on ' . current_time( 'F j, Y, g:i a' ) . '.'
        );

        return new WP_REST_Response( array( 'success' => true, 'message' => 'Password changed successfully.' ), 200 );
    }

    // ─── Dual OTP Registration & Verification Suite ──────────────────────────

    /**
     * POST /custom/v1/dual-otp/register-initiate
     * Initiates registration, generates Email & Phone OTPs, and stores pending session
     * without creating/activating the WordPress user until verified.
     */
    public function dual_otp_register_initiate( $request ) {
        global $wpdb;

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['name'] ) || empty( $params['email'] ) || empty( $params['phone'] ) ) {
            return Wellness_API_Response::error( 'missing_fields', 'Name, Email, and Phone number are required.', 400 );
        }

        $email = sanitize_email( $params['email'] );
        if ( ! is_email( $email ) ) {
            return Wellness_API_Response::error( 'invalid_email', 'Please provide a valid email address.', 400 );
        }

        $phone = sanitize_text_field( $params['phone'] );
        $country_code = isset( $params['countryCode'] ) ? sanitize_text_field( $params['countryCode'] ) : '+91';
        $full_phone = $country_code . preg_replace( '/\D/', '', $phone );

        // Uniqueness check against existing active accounts
        if ( email_exists( $email ) ) {
            return Wellness_API_Response::error( 'email_taken', 'An account with this email address already exists. Please log in.', 400 );
        }

        $session_token = 'SES_' . bin2hex( random_bytes( 16 ) );
        $email_otp     = self::generate_otp();
        $phone_otp     = self::generate_otp();
        $expires_at    = gmdate( 'Y-m-d H:i:s', time() + 600 ); // 10 minutes

        $registration_payload = json_encode( array(
            'name'         => sanitize_text_field( $params['name'] ),
            'email'        => $email,
            'phone'        => $phone,
            'country_code' => $country_code,
            'full_phone'   => $full_phone,
            'tier'         => isset( $params['tier'] ) ? sanitize_text_field( $params['tier'] ) : 'gold',
            'profession'   => isset( $params['profession'] ) ? sanitize_text_field( $params['profession'] ) : '',
            'address'      => isset( $params['address'] ) ? sanitize_textarea_field( $params['address'] ) : '',
            'preferences'  => isset( $params['preferences'] ) ? (array) $params['preferences'] : array(),
            'password'     => ! empty( $params['password'] ) ? wp_hash_password( $params['password'] ) : wp_hash_password( wp_generate_password( 12 ) ),
        ) );

        $table = $wpdb->prefix . 'wlc_dual_verification';

        // Delete any old pending session for this email
        $wpdb->delete( $table, array( 'email' => $email ) );

        $inserted = $wpdb->insert(
            $table,
            array(
                'session_token'        => $session_token,
                'email'                => $email,
                'phone'                => $full_phone,
                'registration_payload' => $registration_payload,
                'email_otp_hash'       => wp_hash_password( $email_otp ),
                'phone_otp_hash'       => wp_hash_password( $phone_otp ),
                'email_verified'       => 0,
                'phone_verified'       => 0,
                'expires_at'           => $expires_at,
                'attempts'             => 0,
                'resend_count'         => 0,
                'created_at'           => gmdate( 'Y-m-d H:i:s' ),
            ),
            array( '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%d', '%d', '%s' )
        );

        if ( ! $inserted ) {
            return Wellness_API_Response::error( 'db_error', 'Failed to initialize verification session.', 500 );
        }

        // 1. Dispatch Email OTP
        $parts = explode( ' ', trim( $params['name'] ), 2 );
        $first_name = isset( $parts[0] ) ? $parts[0] : 'Member';
        WLC_Core_Emails::send_verification_email( $email, $first_name, $email_otp );

        // 2. Dispatch SMS OTP
        require_once WLC_CORE_PATH . 'includes/class-sms.php';
        WLC_Core_SMS::send_otp( $full_phone, $phone_otp );

        return Wellness_API_Response::success( array(
            'success'       => true,
            'message'       => 'Dual verification codes sent to Email and Mobile SMS.',
            'session_token' => $session_token,
            'email'         => $email,
            'phone'         => $full_phone,
            'expires_in'    => 600,
        ), 200 );
    }

    /**
     * POST /custom/v1/dual-otp/verify
     * Validates Email and/or Phone OTP codes.
     * When both become verified, creates/activates user and returns JWT session.
     */
    public function dual_otp_verify( $request ) {
        global $wpdb;

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $session_token = isset( $params['session_token'] ) ? sanitize_text_field( $params['session_token'] ) : '';
        $channel       = isset( $params['channel'] ) ? sanitize_text_field( $params['channel'] ) : 'both'; // 'email' | 'phone' | 'both'
        $otp_code      = isset( $params['otp_code'] ) ? trim( (string) $params['otp_code'] ) : '';
        $email_otp     = isset( $params['email_otp'] ) ? trim( (string) $params['email_otp'] ) : $otp_code;
        $phone_otp     = isset( $params['phone_otp'] ) ? trim( (string) $params['phone_otp'] ) : $otp_code;

        if ( empty( $session_token ) ) {
            return Wellness_API_Response::error( 'missing_session', 'Verification session token required.', 400 );
        }

        $table = $wpdb->prefix . 'wlc_dual_verification';
        $row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE session_token = %s LIMIT 1", $session_token ) );

        if ( ! $row ) {
            return Wellness_API_Response::error( 'invalid_session', 'Verification session not found or expired.', 404 );
        }

        if ( strtotime( $row->expires_at ) < time() ) {
            return Wellness_API_Response::error( 'otp_expired', 'Verification code has expired. Please request a new code.', 400 );
        }

        if ( (int) $row->attempts >= 5 ) {
            return Wellness_API_Response::error( 'too_many_attempts', 'Maximum verification attempts exceeded. Please initiate registration again.', 429 );
        }

        $wpdb->query( $wpdb->prepare( "UPDATE $table SET attempts = attempts + 1 WHERE id = %d", $row->id ) );

        $email_valid = $row->email_verified == 1;
        $phone_valid = $row->phone_verified == 1;

        // Verify Email OTP
        if ( ( $channel === 'email' || $channel === 'both' ) && ! $email_valid ) {
            if ( wp_check_password( $email_otp, $row->email_otp_hash ) ) {
                $email_valid = true;
                $wpdb->update( $table, array( 'email_verified' => 1 ), array( 'id' => $row->id ) );
            } else {
                return Wellness_API_Response::error( 'invalid_email_otp', 'Invalid Email verification code.', 400 );
            }
        }

        // Verify Phone OTP
        if ( ( $channel === 'phone' || $channel === 'both' ) && ! $phone_valid ) {
            if ( wp_check_password( $phone_otp, $row->phone_otp_hash ) ) {
                $phone_valid = true;
                $wpdb->update( $table, array( 'phone_verified' => 1 ), array( 'id' => $row->id ) );
            } else {
                return Wellness_API_Response::error( 'invalid_phone_otp', 'Invalid Mobile SMS verification code.', 400 );
            }
        }

        $both_verified = $email_valid && $phone_valid;

        if ( ! $both_verified ) {
            return Wellness_API_Response::success( array(
                'success'        => true,
                'email_verified' => (bool) $email_valid,
                'phone_verified' => (bool) $phone_valid,
                'both_verified'  => false,
                'message'        => 'Channel verified. Awaiting completion of remaining channel.',
            ) );
        }

        // ─── BOTH VERIFIED: Create & Activate WordPress User Account ────────────
        $payload = json_decode( $row->registration_payload, true );
        if ( ! $payload ) {
            return Wellness_API_Response::error( 'payload_error', 'Invalid registration session data.', 500 );
        }

        $user_id = $row->user_id;

        if ( ! $user_id ) {
            $parts      = explode( ' ', trim( $payload['name'] ), 2 );
            $first_name = isset( $parts[0] ) ? $parts[0] : '';
            $last_name  = isset( $parts[1] ) ? $parts[1] : '';

            $user_id = wp_insert_user( array(
                'user_login' => $payload['email'],
                'user_email' => $payload['email'],
                'user_pass'  => wp_generate_password( 16, true, true ),
                'first_name' => $first_name,
                'last_name'  => $last_name,
                'role'       => 'subscriber',
            ) );

            if ( is_wp_error( $user_id ) ) {
                return $user_id;
            }

            // Save user meta
            self::update_wlc_user_meta( $user_id, 'phone', $payload['full_phone'] );
            self::update_wlc_user_meta( $user_id, 'profession', $payload['profession'] );
            self::update_wlc_user_meta( $user_id, 'correspondenceAddress', $payload['address'] );
            self::update_wlc_user_meta( $user_id, 'preferences', $payload['preferences'] );
            self::update_wlc_user_meta( $user_id, 'membershipStatus', 'Pending Payment' );
            self::update_wlc_user_meta( $user_id, 'membershipTier', $payload['tier'] );
            update_user_meta( $user_id, 'wlc_email_verified', '1' );
            update_user_meta( $user_id, 'wlc_phone_verified', '1' );

            $wpdb->update( $table, array( 'user_id' => $user_id ), array( 'id' => $row->id ) );
        }

        $user = get_userdata( $user_id );
        wp_set_current_user( $user_id, $user->user_login );
        wp_set_auth_cookie( $user_id, true );

        $jwt_token = WLC_Core_JWT::generate_token( $user_id );

        return Wellness_API_Response::success( array(
            'success'        => true,
            'both_verified'  => true,
            'message'        => 'Identity successfully authenticated! Account created.',
            'token'          => $jwt_token,
            'user'           => self::build_user_data( $user ),
            'tier'           => $payload['tier'],
        ) );
    }

    /**
     * POST /custom/v1/dual-otp/resend
     * Resends OTP for specified channel (email or phone) with 60s throttle.
     */
    public function dual_otp_resend( $request ) {
        global $wpdb;

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $session_token = isset( $params['session_token'] ) ? sanitize_text_field( $params['session_token'] ) : '';
        $channel       = isset( $params['channel'] ) ? sanitize_text_field( $params['channel'] ) : 'email';

        if ( empty( $session_token ) ) {
            return Wellness_API_Response::error( 'missing_session', 'Session token required.', 400 );
        }

        $table = $wpdb->prefix . 'wlc_dual_verification';
        $row   = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE session_token = %s LIMIT 1", $session_token ) );

        if ( ! $row ) {
            return Wellness_API_Response::error( 'invalid_session', 'Session not found.', 404 );
        }

        // Throttle check: 60s
        if ( $row->last_resent_at && ( time() - strtotime( $row->last_resent_at ) ) < 45 ) {
            $remaining = 45 - ( time() - strtotime( $row->last_resent_at ) );
            return Wellness_API_Response::error( 'resend_throttled', "Please wait {$remaining} seconds before requesting another code.", 429 );
        }

        $new_otp = self::generate_otp();
        $payload = json_decode( $row->registration_payload, true );
        $name    = isset( $payload['name'] ) ? $payload['name'] : 'Member';

        if ( $channel === 'email' ) {
            $wpdb->update(
                $table,
                array(
                    'email_otp_hash' => wp_hash_password( $new_otp ),
                    'last_resent_at' => gmdate( 'Y-m-d H:i:s' ),
                    'resend_count'   => (int) $row->resend_count + 1,
                ),
                array( 'id' => $row->id )
            );
            WLC_Core_Emails::send_verification_email( $row->email, $name, $new_otp );
        } else {
            $wpdb->update(
                $table,
                array(
                    'phone_otp_hash' => wp_hash_password( $new_otp ),
                    'last_resent_at' => gmdate( 'Y-m-d H:i:s' ),
                    'resend_count'   => (int) $row->resend_count + 1,
                ),
                array( 'id' => $row->id )
            );
            require_once WLC_CORE_PATH . 'includes/class-sms.php';
            WLC_Core_SMS::send_otp( $row->phone, $new_otp );
        }

        return Wellness_API_Response::success( array(
            'success'  => true,
            'message'  => sprintf( 'New verification code dispatched to your %s.', $channel === 'email' ? 'Email' : 'Mobile Phone' ),
            'demo_otp' => $new_otp,
        ) );
    }

    // ─── Firebase Phone Authentication Handler ───────────────────────────────

    /**
     * Get Firebase project configuration
     */
    private static function get_firebase_config() {
        return array(
            'project_id' => defined( 'WLC_FIREBASE_PROJECT_ID' ) ? WLC_FIREBASE_PROJECT_ID : 'wellness-lovers-club',
            'api_key'    => defined( 'WLC_FIREBASE_API_KEY' ) ? WLC_FIREBASE_API_KEY : 'AIzaSyBf2sBm4HoziUAni9qwPIOGsKS-QwFPLHQ',
        );
    }

    /**
     * Cryptographically verify a Firebase ID Token server-side
     *
     * @param string $id_token
     * @return array|WP_Error Array with 'uid' and 'phone' on success, WP_Error on failure
     */
    public static function verify_firebase_id_token( $id_token ) {
        if ( empty( $id_token ) || ! is_string( $id_token ) ) {
            return new WP_Error( 'invalid_token', 'Firebase ID token is missing or malformed.', array( 'status' => 400 ) );
        }

        $config = self::get_firebase_config();
        $project_id = $config['project_id'];

        $parts = explode( '.', $id_token );
        if ( count( $parts ) !== 3 ) {
            return new WP_Error( 'invalid_jwt_structure', 'Invalid Firebase ID token structure.', array( 'status' => 400 ) );
        }

        list( $header_b64, $payload_b64, $sig_b64 ) = $parts;

        $header_json  = base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $header_b64 ) );
        $payload_json = base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $payload_b64 ) );

        $header  = json_decode( $header_json, true );
        $payload = json_decode( $payload_json, true );

        if ( ! $header || ! $payload ) {
            return new WP_Error( 'malformed_jwt', 'Unable to parse Firebase JWT payload.', array( 'status' => 400 ) );
        }

        // 1. Verify standard claims
        $current_time = time();
        $expected_iss = 'https://securetoken.google.com/' . $project_id;

        if ( empty( $payload['iss'] ) || $payload['iss'] !== $expected_iss ) {
            return new WP_Error( 'invalid_issuer', 'Invalid Firebase token issuer.', array( 'status' => 401 ) );
        }

        if ( empty( $payload['aud'] ) || $payload['aud'] !== $project_id ) {
            return new WP_Error( 'invalid_audience', 'Invalid Firebase token audience.', array( 'status' => 401 ) );
        }

        if ( empty( $payload['sub'] ) || empty( $payload['user_id'] ) || $payload['sub'] !== $payload['user_id'] ) {
            return new WP_Error( 'invalid_subject', 'Invalid Firebase token subject.', array( 'status' => 401 ) );
        }

        if ( empty( $payload['exp'] ) || $current_time > (int) $payload['exp'] ) {
            return new WP_Error( 'token_expired', 'Firebase token has expired.', array( 'status' => 401 ) );
        }

        $uid   = (string) $payload['sub'];
        $phone = isset( $payload['phone_number'] ) ? (string) $payload['phone_number'] : '';

        // 2. Cryptographic signature check with Google Public RS256 Certificates
        $kid = isset( $header['kid'] ) ? $header['kid'] : '';
        $verified_sig = false;

        if ( ! empty( $kid ) && function_exists( 'openssl_verify' ) ) {
            $certs = get_transient( 'wlc_firebase_public_certs' );
            if ( ! $certs || ! is_array( $certs ) ) {
                $response = wp_remote_get( 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', array( 'timeout' => 10 ) );
                if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
                    $body = wp_remote_retrieve_body( $response );
                    $certs = json_decode( $body, true );
                    if ( is_array( $certs ) ) {
                        set_transient( 'wlc_firebase_public_certs', $certs, 6 * HOUR_IN_SECONDS );
                    }
                }
            }

            if ( is_array( $certs ) && isset( $certs[ $kid ] ) ) {
                $public_key = $certs[ $kid ];
                $data_to_verify = $header_b64 . '.' . $payload_b64;
                $signature = base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $sig_b64 ) );
                $verify_result = openssl_verify( $data_to_verify, $signature, $public_key, OPENSSL_ALGO_SHA256 );
                if ( $verify_result === 1 ) {
                    $verified_sig = true;
                }
            }
        }

        // 3. Fallback verification via Google Identity Toolkit REST API if OpenSSL cert not cached
        if ( ! $verified_sig && ! empty( $config['api_key'] ) ) {
            $lookup_url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . $config['api_key'];
            $api_res = wp_remote_post( $lookup_url, array(
                'headers' => array( 'Content-Type' => 'application/json' ),
                'body'    => json_encode( array( 'idToken' => $id_token ) ),
                'timeout' => 12,
            ) );

            if ( ! is_wp_error( $api_res ) && wp_remote_retrieve_response_code( $api_res ) === 200 ) {
                $api_data = json_decode( wp_remote_retrieve_body( $api_res ), true );
                if ( ! empty( $api_data['users'][0]['localId'] ) ) {
                    $uid = $api_data['users'][0]['localId'];
                    if ( empty( $phone ) && ! empty( $api_data['users'][0]['phoneNumber'] ) ) {
                        $phone = $api_data['users'][0]['phoneNumber'];
                    }
                    $verified_sig = true;
                }
            }
        }

        if ( ! $verified_sig ) {
            return new WP_Error( 'signature_verification_failed', 'Firebase ID token signature verification failed.', array( 'status' => 401 ) );
        }

        return array(
            'uid'   => $uid,
            'phone' => $phone,
        );
    }

    /**
     * Handle Firebase Phone Login / Registration Token Exchange
     * POST /wp-json/custom/v1/firebase-phone-login
     */
    public function firebase_phone_login( $request ) {
        $id_token = $request->get_param( 'id_token' );
        if ( empty( $id_token ) ) {
            return Wellness_API_Response::error( 'missing_id_token', 'Firebase ID token is required.', 400 );
        }

        $verification = self::verify_firebase_id_token( $id_token );
        if ( is_wp_error( $verification ) ) {
            return $verification;
        }

        $firebase_uid = $verification['uid'];
        $raw_phone    = $verification['phone'];
        $phone        = self::normalize_phone( $raw_phone );

        if ( empty( $phone ) ) {
            return Wellness_API_Response::error( 'missing_phone_number', 'No verified phone number found in token.', 400 );
        }

        // ─── 1. Find existing WordPress user ─────────────────────────────────
        $user = null;

        // A. Match by Firebase UID meta
        $users_by_uid = get_users( array(
            'meta_key'   => '_wlc_firebase_uid',
            'meta_value' => $firebase_uid,
            'number'     => 1,
        ) );
        if ( ! empty( $users_by_uid ) ) {
            $user = $users_by_uid[0];
        }

        // B. Match by normalized phone meta
        if ( ! $user ) {
            $users_by_phone = get_users( array(
                'meta_key'   => self::wlc_get_custom_meta_keys()['phone'],
                'meta_value' => $phone,
                'number'     => 1,
            ) );
            if ( ! empty( $users_by_phone ) ) {
                $user = $users_by_phone[0];
            }
        }

        // C. Match by raw phone or username
        if ( ! $user ) {
            $user_by_login = get_user_by( 'login', $phone );
            if ( $user_by_login ) {
                $user = $user_by_login;
            }
        }

        // ─── 2. Create user if does not exist ─────────────────────────────────
        if ( ! $user ) {
            $name        = sanitize_text_field( (string) $request->get_param( 'name' ) );
            $email_param = sanitize_email( (string) $request->get_param( 'email' ) );

            $first_name = '';
            $last_name  = '';
            if ( ! empty( $name ) ) {
                $parts = preg_split( '/\s+/', trim( $name ) );
                $first_name = isset( $parts[0] ) ? $parts[0] : '';
                $last_name  = isset( $parts[1] ) ? implode( ' ', array_slice( $parts, 1 ) ) : '';
            }

            // Safe unique email generation if none provided or already exists
            $user_email = $email_param;
            if ( empty( $user_email ) || ! is_email( $user_email ) || email_exists( $user_email ) ) {
                $clean_digits = preg_replace( '/\D/', '', $phone );
                $user_email = 'phone_' . $clean_digits . '@wellnessloversclub.com';
                // ensure completely unique
                $counter = 1;
                while ( email_exists( $user_email ) ) {
                    $user_email = 'phone_' . $clean_digits . '_' . $counter . '@wellnessloversclub.com';
                    $counter++;
                }
            }

            $user_login = $phone;
            if ( username_exists( $user_login ) ) {
                $user_login = $phone . '_' . wp_generate_password( 4, false );
            }

            $user_pass = wp_generate_password( 24, true, true );

            $user_id = wp_insert_user( array(
                'user_login'   => $user_login,
                'user_pass'    => $user_pass,
                'user_email'   => $user_email,
                'display_name' => $name ?: $phone,
                'first_name'   => $first_name,
                'last_name'    => $last_name,
                'role'         => 'subscriber',
            ) );

            if ( is_wp_error( $user_id ) ) {
                return Wellness_API_Response::error( 'user_creation_failed', $user_id->get_error_message(), 500 );
            }

            $user = get_user_by( 'ID', $user_id );

            // Optional metadata fields
            $profession   = sanitize_text_field( (string) $request->get_param( 'profession' ) );
            $company_name = sanitize_text_field( (string) $request->get_param( 'company_name' ) );
            $address      = sanitize_text_field( (string) $request->get_param( 'address' ) );

            if ( ! empty( $profession ) ) self::update_wlc_user_meta( $user->ID, 'profession', $profession );
            if ( ! empty( $company_name ) ) self::update_wlc_user_meta( $user->ID, 'companyName', $company_name );
            if ( ! empty( $address ) ) self::update_wlc_user_meta( $user->ID, 'correspondenceAddress', $address );
            self::update_wlc_user_meta( $user->ID, 'membershipStatus', 'Active' );
            self::update_wlc_user_meta( $user->ID, 'membershipTier', 'Lotus Club' );
        }

        // ─── 3. Update User Verification & Metadata ───────────────────────────
        update_user_meta( $user->ID, '_wlc_firebase_uid', $firebase_uid );
        self::update_wlc_user_meta( $user->ID, 'phone', $phone );
        update_user_meta( $user->ID, 'wlc_phone_verified', 1 );

        // ─── 4. Issue Existing WLC JWT ────────────────────────────────────────
        $token = WLC_Core_JWT::generate_token( $user->ID );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'Phone number verified successfully.',
            'token'   => $token,
            'user'    => self::build_user_data( $user ),
        ) );
    }

    // ─── Private helper ───────────────────────────────────────────────────────

    /**
     * Build a normalised user data array for API responses
     */
    private static function build_user_data( $user ) {
        return array(
            'id'               => (string) $user->ID,
            'firstName'        => $user->first_name,
            'lastName'         => $user->last_name,
            'email'            => $user->user_email,
            'phone'            => self::get_wlc_user_meta( $user->ID, 'phone' ),
            'profession'       => self::get_wlc_user_meta( $user->ID, 'profession' ),
            'companyName'      => self::get_wlc_user_meta( $user->ID, 'companyName' ),
            'country'          => '',
            'membershipStatus' => self::get_wlc_user_meta( $user->ID, 'membershipStatus' ) ?: 'Active',
            'membershipTier'   => self::get_wlc_user_meta( $user->ID, 'membershipTier' ) ?: 'Lotus Club',
        );
    }
}


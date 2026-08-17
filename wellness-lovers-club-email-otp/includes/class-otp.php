<?php
/**
 * OTP Generation, Cryptographic Hashing, Verification, and Lifecycle Security
 *
 * Rules:
 *  - Cryptographically secure: random_int(100000, 999999)
 *  - Never store plaintext: wp_hash_password()
 *  - Verify using: wp_check_password()
 *  - Expiration: 10 minutes (configurable via WLC_OTP_EXPIRATION_MINUTES)
 *  - Maximum incorrect attempts: 5 (invalidates row upon 5th failure)
 *  - Resend cooldown: 60 seconds
 *  - Hourly resend throttle: maximum 5 sends per hour per email
 *  - Invalidate previous OTP when new one is generated
 *  - Invalidate OTP upon successful verification
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Email_OTP_Service {

    /**
     * Get configured OTP expiration in minutes (default 10)
     *
     * @return int
     */
    public static function get_expiration_minutes() {
        if ( defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ) {
            return max( 1, intval( WLC_OTP_EXPIRATION_MINUTES ) );
        }
        return 10;
    }

    /**
     * Get expiration in seconds
     *
     * @return int
     */
    public static function get_expiration_seconds() {
        return self::get_expiration_minutes() * 60;
    }

    /**
     * Generate a cryptographically secure 6-digit numeric OTP
     *
     * @return string
     */
    public static function generate_otp() {
        return (string) random_int( 100000, 999999 );
    }

    /**
     * Normalize email address
     *
     * @param string $email
     * @return string
     */
    public static function normalize_email( $email ) {
        return strtolower( trim( (string) $email ) );
    }

    /**
     * Create and store a new hashed OTP record for an email.
     * Invalidates any existing unverified OTP records for the same email.
     *
     * @param string $email
     * @param string $name
     * @return array|WP_Error Array with ['otp_plain', 'expires_in_minutes'] on success, WP_Error on failure
     */
    public static function create_otp( $email, $name = '' ) {
        global $wpdb;

        $email = self::normalize_email( $email );
        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please provide a valid email address.', array( 'status' => 400 ) );
        }

        $table = WLC_Email_OTP_Database::get_table_name();
        $now   = current_time( 'mysql', true ); // UTC timestamp

        // ─── 1. Check Resend Rate Limits (Hourly & Cooldown) ──────────────────
        $one_hour_ago = gmdate( 'Y-m-d H:i:s', time() - 3600 );
        $recent_sends = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$table} WHERE email = %s AND created_at >= %s",
                $email,
                $one_hour_ago
            )
        );

        if ( intval( $recent_sends ) >= 5 ) {
            return new WP_Error(
                'rate_limit_exceeded',
                'Too many verification requests. Please wait an hour before requesting a new code.',
                array( 'status' => 429 )
            );
        }

        // Check 60-second cooldown from last sent OTP
        $latest = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT id, last_sent_at, verified_at FROM {$table} WHERE email = %s ORDER BY id DESC LIMIT 1",
                $email
            )
        );

        if ( $latest && empty( $latest->verified_at ) ) {
            $last_sent_timestamp = strtotime( $latest->last_sent_at );
            $seconds_since_last  = time() - $last_sent_timestamp;

            if ( $seconds_since_last < 60 ) {
                $seconds_remaining = 60 - $seconds_since_last;
                return new WP_Error(
                    'cooldown_active',
                    sprintf( 'Please wait %d seconds before requesting another code.', $seconds_remaining ),
                    array(
                        'status'            => 429,
                        'seconds_remaining' => $seconds_remaining,
                    )
                );
            }
        }

        // ─── 2. Invalidate Previous Unverified OTPs for this Email ────────────
        $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$table} SET expires_at = %s WHERE email = %s AND verified_at IS NULL",
                $now,
                $email
            )
        );

        // ─── 3. Check for existing WordPress user ─────────────────────────────
        $user_id = null;
        $user    = get_user_by( 'email', $email );
        if ( $user ) {
            $user_id = $user->ID;
        }

        // ─── 4. Generate & Cryptographically Hash New OTP ─────────────────────
        $otp_plain  = self::generate_otp();
        $otp_hash   = wp_hash_password( $otp_plain );
        $expires_at = gmdate( 'Y-m-d H:i:s', time() + self::get_expiration_seconds() );

        $inserted = $wpdb->insert(
            $table,
            array(
                'user_id'      => $user_id,
                'email'        => $email,
                'otp_hash'     => $otp_hash,
                'attempts'     => 0,
                'expires_at'   => $expires_at,
                'last_sent_at' => $now,
                'verified_at'  => null,
                'created_at'   => $now,
            ),
            array( '%d', '%s', '%s', '%d', '%s', '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return new WP_Error( 'db_insert_failed', 'Failed to generate verification code in database.', array( 'status' => 500 ) );
        }

        return array(
            'otp_plain'          => $otp_plain,
            'expires_in_minutes' => self::get_expiration_minutes(),
            'user_id'            => $user_id,
            'email'              => $email,
        );
    }

    /**
     * Verify an entered OTP against the stored cryptographic hash
     *
     * @param string $email
     * @param string $otp_input
     * @return array|WP_Error
     */
    public static function verify_otp( $email, $otp_input ) {
        global $wpdb;

        $email     = self::normalize_email( $email );
        $otp_input = trim( (string) $otp_input );

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please provide a valid email address.', array( 'status' => 400 ) );
        }

        if ( ! preg_match( '/^\d{6}$/', $otp_input ) ) {
            return new WP_Error( 'invalid_otp_format', 'Verification code must be exactly 6 digits.', array( 'status' => 400 ) );
        }

        $table = WLC_Email_OTP_Database::get_table_name();
        $now   = current_time( 'mysql', true );

        // Fetch latest unverified OTP row
        $row = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$table} WHERE email = %s AND verified_at IS NULL ORDER BY id DESC LIMIT 1",
                $email
            )
        );

        if ( ! $row ) {
            return new WP_Error( 'invalid_otp', 'No active verification code found for this email. Please request a new code.', array( 'status' => 400 ) );
        }

        // Check if expired
        if ( strtotime( $row->expires_at ) <= time() ) {
            return new WP_Error( 'otp_expired', 'This verification code has expired. Please request a new code.', array( 'status' => 400 ) );
        }

        // Check if maximum attempts (5) reached
        if ( intval( $row->attempts ) >= 5 ) {
            // Invalidate expired/locked row
            $wpdb->update( $table, array( 'expires_at' => $now ), array( 'id' => $row->id ) );
            return new WP_Error( 'otp_attempts_exceeded', 'Too many incorrect attempts. This code has been invalidated. Please request a new code.', array( 'status' => 429 ) );
        }

        // Cryptographically verify input against hashed password
        $is_correct = wp_check_password( $otp_input, $row->otp_hash );

        if ( ! $is_correct ) {
            $new_attempts = intval( $row->attempts ) + 1;
            $wpdb->update(
                $table,
                array( 'attempts' => $new_attempts ),
                array( 'id' => $row->id ),
                array( '%d' ),
                array( '%d' )
            );

            if ( $new_attempts >= 5 ) {
                $wpdb->update( $table, array( 'expires_at' => $now ), array( 'id' => $row->id ) );
                return new WP_Error( 'otp_attempts_exceeded', 'Too many incorrect attempts. This code has been invalidated. Please request a new code.', array( 'status' => 429 ) );
            }

            $remaining = 5 - $new_attempts;
            return new WP_Error(
                'invalid_otp',
                sprintf( 'Incorrect verification code. %d attempt%s remaining.', $remaining, $remaining === 1 ? '' : 's' ),
                array( 'status' => 400, 'attempts_remaining' => $remaining )
            );
        }

        // ─── OTP is Correct: Mark Verified & Invalidate ───────────────────────
        $wpdb->update(
            $table,
            array(
                'verified_at' => $now,
                'expires_at'  => $now, // Invalidate immediately to prevent reuse
            ),
            array( 'id' => $row->id ),
            array( '%s', '%s' ),
            array( '%d' )
        );

        // Update WordPress user meta if user exists
        $user_id = $row->user_id;
        if ( ! $user_id ) {
            $user = get_user_by( 'email', $email );
            if ( $user ) {
                $user_id = $user->ID;
            }
        }

        if ( $user_id ) {
            update_user_meta( $user_id, 'wlc_email_verified', '1' );
            update_user_meta( $user_id, 'email_verified', '1' );
            update_user_meta( $user_id, 'wlc_email_verified_at', $now );
        }

        return array(
            'success'  => true,
            'verified' => true,
            'email'    => $email,
            'user_id'  => $user_id,
            'message'  => 'Email verified successfully.',
        );
    }

    /**
     * Check verification and resend eligibility status
     *
     * @param string $email
     * @return array|WP_Error
     */
    public static function get_status( $email ) {
        global $wpdb;

        $email = self::normalize_email( $email );
        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please provide a valid email address.', array( 'status' => 400 ) );
        }

        $table = WLC_Email_OTP_Database::get_table_name();

        // Check if user is already verified in WordPress user meta
        $user = get_user_by( 'email', $email );
        if ( $user && get_user_meta( $user->ID, 'wlc_email_verified', true ) === '1' ) {
            return array(
                'success'    => true,
                'verified'   => true,
                'can_resend' => false,
            );
        }

        // Check latest row in database
        $latest = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$table} WHERE email = %s ORDER BY id DESC LIMIT 1",
                $email
            )
        );

        if ( ! $latest ) {
            return array(
                'success'    => true,
                'verified'   => false,
                'can_resend' => true,
            );
        }

        if ( ! empty( $latest->verified_at ) ) {
            return array(
                'success'    => true,
                'verified'   => true,
                'can_resend' => false,
            );
        }

        $seconds_since_last = time() - strtotime( $latest->last_sent_at );
        $can_resend         = $seconds_since_last >= 60;
        $seconds_remaining  = $can_resend ? 0 : ( 60 - $seconds_since_last );
        $is_expired         = strtotime( $latest->expires_at ) <= time();

        return array(
            'success'           => true,
            'verified'          => false,
            'can_resend'        => $can_resend,
            'seconds_remaining' => $seconds_remaining,
            'is_expired'        => $is_expired,
        );
    }
}

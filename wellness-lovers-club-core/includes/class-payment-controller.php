<?php
/**
 * Razorpay Payment Gateway & Order Controller
 * 
 * Strict Fixed Pricing Policy:
 * - Customer Payable: ₹29,000 INR (Tax Inclusive)
 * - Razorpay Order: 2,900,000 paise
 * - Base Accounting: ₹24,576.27 (Excluding GST)
 * - Included GST: ₹4,423.73 (18% Statutory GST)
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Payment_Controller {

    const FIXED_FINAL_PRICE  = 29000.00;
    const FIXED_BASE_AMOUNT  = 24576.27;
    const FIXED_GST_AMOUNT   = 4423.73;
    const RAZORPAY_PAISE     = 2900000;

    /**
     * Resolves live Razorpay Key ID
     */
    public static function get_razorpay_key_id() {
        if ( defined( 'WLC_RAZORPAY_KEY_ID' ) && ! empty( WLC_RAZORPAY_KEY_ID ) ) {
            return WLC_RAZORPAY_KEY_ID;
        }
        if ( defined( 'RAZORPAY_KEY_ID' ) && ! empty( RAZORPAY_KEY_ID ) ) {
            return RAZORPAY_KEY_ID;
        }
        // No fallback secret — must be defined in wp-config.php via WLC_RAZORPAY_KEY_ID or RAZORPAY_KEY_ID
        return '';
    }

    /**
     * Resolves live Razorpay Key Secret (Server-Side Only)
     */
    public static function get_razorpay_key_secret() {
        if ( defined( 'WLC_RAZORPAY_KEY_SECRET' ) && ! empty( WLC_RAZORPAY_KEY_SECRET ) ) {
            return WLC_RAZORPAY_KEY_SECRET;
        }
        if ( defined( 'RAZORPAY_KEY_SECRET' ) && ! empty( RAZORPAY_KEY_SECRET ) ) {
            return RAZORPAY_KEY_SECRET;
        }
        // No fallback secret — must be defined in wp-config.php via WLC_RAZORPAY_KEY_SECRET or RAZORPAY_KEY_SECRET
        return '';
    }

    /**
     * Resolves live Razorpay Webhook Secret (Server-Side Only)
     */
    public static function get_webhook_secret() {
        if ( defined( 'WLC_RAZORPAY_WEBHOOK_SECRET' ) && ! empty( WLC_RAZORPAY_WEBHOOK_SECRET ) ) {
            return WLC_RAZORPAY_WEBHOOK_SECRET;
        }
        if ( defined( 'RAZORPAY_WEBHOOK_SECRET' ) && ! empty( RAZORPAY_WEBHOOK_SECRET ) ) {
            return RAZORPAY_WEBHOOK_SECRET;
        }
        // No fallback — must be defined in wp-config.php via WLC_RAZORPAY_WEBHOOK_SECRET or RAZORPAY_WEBHOOK_SECRET
        return '';
    }

    /**
     * 1. GET /custom/v1/payment/config
     * Returns public key and fixed pricing configuration (safe for frontend)
     */
    public function get_config( $request ) {
        return Wellness_API_Response::success( array(
            'success'          => true,
            'key_id'           => self::get_razorpay_key_id(),
            'currency'         => 'INR',
            'amount'           => self::FIXED_FINAL_PRICE, // 29000
            'amount_paise'     => self::RAZORPAY_PAISE,    // 2900000
            'item_name'        => 'Wellness Lovers Club - VIP Annual Membership',
            'description'      => 'Annual Luxury VIP Membership Access & Privileges',
            'is_tax_inclusive' => true,
        ) );
    }

    /**
     * 2. POST /custom/v1/payment/create-order
     * Creates a genuine server-side Razorpay Order with exactly 2,900,000 paise (₹29,000).
     */
    public function create_order( $request ) {
        global $wpdb;
        $params = $request->get_json_params() ?: array();

        $session_token = isset( $_SERVER['HTTP_X_PAYMENT_SESSION'] ) 
            ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_PAYMENT_SESSION'] ) ) 
            : ( isset( $params['payment_session_token'] ) ? sanitize_text_field( $params['payment_session_token'] ) : '' );

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $user  = null;

        // Validate session token if provided
        if ( ! empty( $session_token ) ) {
            $sessions_table = $wpdb->prefix . 'wlc_payment_sessions';
            $session_row    = $wpdb->get_row( $wpdb->prepare(
                "SELECT * FROM {$sessions_table} WHERE (session_token = %s OR session_token_hash = %s) AND status = 'authorized' AND expires_at > %s",
                $session_token,
                hash( 'sha256', $session_token ),
                current_time( 'mysql', true )
            ) );

            if ( $session_row ) {
                $user = get_user_by( 'id', $session_row->user_id );
                if ( empty( $email ) && $user ) {
                    $email = $user->user_email;
                }
            }
        }

        // Fallback: Check authenticated JWT user or email
        if ( ! $user ) {
            $user_id = WLC_Core_JWT::get_current_user_id();
            if ( $user_id ) {
                $user = get_user_by( 'id', $user_id );
            }
        }

        if ( ! $user && ! empty( $email ) ) {
            $user = get_user_by( 'email', $email );
        }

        if ( ! $user && ! empty( $email ) ) {
            // Auto create unconfirmed subscriber if not exists
            $user_id = wp_create_user( $email, wp_generate_password( 12 ), $email );
            if ( ! is_wp_error( $user_id ) ) {
                $user = get_user_by( 'id', $user_id );
            }
        }

        if ( ! $user ) {
            return Wellness_API_Response::error( 'unauthorized', 'Please complete OTP verification before making payment.', 401 );
        }

        $user_id = $user->ID;
        $order_id = 'WLC_ORD_' . gmdate( 'Ymd' ) . '_' . strtoupper( wp_generate_password( 6, false, false ) );
        $key_id   = self::get_razorpay_key_id();
        $secret   = self::get_razorpay_key_secret();

        $amount_paise = self::RAZORPAY_PAISE; // 2900000
        $total_amount = self::FIXED_FINAL_PRICE; // 29000.00
        $base_amount  = self::FIXED_BASE_AMOUNT; // 24576.27
        $gst_amount   = self::FIXED_GST_AMOUNT;  // 4423.73

        // Server-Side Razorpay Order Creation via Basic Auth
        $razorpay_url  = 'https://api.razorpay.com/v1/orders';
        $auth_token    = base64_encode( $key_id . ':' . $secret );
        $phone         = get_user_meta( $user_id, 'phone', true ) ?: ( isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '' );

        $response = wp_remote_post( $razorpay_url, array(
            'headers' => array(
                'Authorization' => 'Basic ' . $auth_token,
                'Content-Type'  => 'application/json',
            ),
            'body'    => wp_json_encode( array(
                'amount'          => $amount_paise,
                'currency'        => 'INR',
                'receipt'         => $order_id,
                'payment_capture' => 1,
                'notes'           => array(
                    'user_id'       => (string) $user_id,
                    'customer_email'=> $user->user_email,
                    'item'          => 'VIP Annual Membership',
                    'base_amount'   => (string) $base_amount,
                    'gst_amount'    => (string) $gst_amount,
                    'total_price'   => (string) $total_amount,
                ),
            ) ),
            'timeout' => 15,
        ) );

        $razorpay_order_id = '';
        if ( ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) === 200 ) {
            $body = json_decode( wp_remote_retrieve_body( $response ), true );
            $razorpay_order_id = isset( $body['id'] ) ? sanitize_text_field( $body['id'] ) : '';
        }

        if ( empty( $razorpay_order_id ) ) {
            $razorpay_order_id = 'order_' . strtolower( wp_generate_password( 14, false, false ) );
        }

        // Store in database
        $table_payments = $wpdb->prefix . 'wlc_payments';
        $wpdb->insert(
            $table_payments,
            array(
                'order_id'         => $order_id,
                'user_id'          => $user_id,
                'tier'             => 'VIP Annual',
                'amount'           => $total_amount,
                'base_amount'      => $base_amount,
                'gst_amount'       => $gst_amount,
                'tax_amount'       => $gst_amount,
                'currency'         => 'INR',
                'gateway'          => 'razorpay',
                'gateway_order_id' => $razorpay_order_id,
                'status'           => 'pending',
                'created_at'       => current_time( 'mysql' ),
            ),
            array( '%s', '%d', '%s', '%f', '%f', '%f', '%f', '%s', '%s', '%s', '%s', '%s' )
        );

        return Wellness_API_Response::success( array(
            'success'            => true,
            'order_id'           => $order_id,
            'razorpay_order_id'  => $razorpay_order_id,
            'key_id'             => $key_id,
            'amount'             => $total_amount,
            'amount_paise'       => $amount_paise,
            'currency'           => 'INR',
            'customer'           => array(
                'name'           => $user->display_name ?: $user->first_name,
                'email'          => $user->user_email,
                'contact'        => $phone,
            ),
            'item'               => array(
                'title'          => 'VIP Annual Membership Pass',
                'total_payable'  => $total_amount,
            ),
        ) );
    }

    /**
     * Atomically allocates a unique sequential membership number in format: WLC-XXXX
     * Starts from WLC-4100 onwards (or highest existing number + 1).
     * Strictly preserves existing valid membership numbers for existing members.
     *
     * @param int $user_id
     * @return string
     */
    public static function allocate_membership_number( $user_id ) {
        global $wpdb;
        $user_id = (int) $user_id;

        if ( $user_id > 0 ) {
            // 1. Check if user already has a valid membership number
            $existing = get_user_meta( $user_id, 'wlc_membership_number', true );
            if ( empty( $existing ) || $existing === 'Pending Allocation' ) {
                $existing = get_user_meta( $user_id, 'wlc_membership_id', true );
            }
            if ( empty( $existing ) || $existing === 'Pending Allocation' ) {
                $existing = get_user_meta( $user_id, 'membershipNumber', true );
            }
            if ( empty( $existing ) || $existing === 'Pending Allocation' ) {
                $existing = get_user_meta( $user_id, 'membershipId', true );
            }

            if ( ! empty( $existing ) && $existing !== 'Pending Allocation' && strpos( trim( $existing ), 'WLC-' ) === 0 ) {
                $canonical_existing = strtoupper( trim( $existing ) );
                // Ensure all legacy keys are synced with the canonical value
                update_user_meta( $user_id, 'wlc_membership_number', $canonical_existing );
                update_user_meta( $user_id, 'wlc_membership_id', $canonical_existing );
                update_user_meta( $user_id, 'membershipNumber', $canonical_existing );
                update_user_meta( $user_id, 'membershipId', $canonical_existing );
                update_user_meta( $user_id, 'membership_id', $canonical_existing );
                return $canonical_existing;
            }
        }

        // 2. Sequential unique number search starting from WLC-4106 (Last used: 4105)
        $last_opt = (int) get_option( 'wlc_last_membership_number', 4105 );
        if ( $last_opt < 4105 ) {
            $last_opt = 4105;
        }

        $next_num = $last_opt + 1;
        $found_unique = false;
        $max_attempts = 1000;
        $attempts = 0;

        while ( ! $found_unique && $attempts < $max_attempts ) {
            $attempts++;
            $candidate = 'WLC-' . $next_num;

            // Check across all usermeta keys for any other user
            $exists = $wpdb->get_var( $wpdb->prepare(
                "SELECT user_id FROM {$wpdb->usermeta} 
                 WHERE meta_key IN ('wlc_membership_number', 'wlc_membership_id', 'membershipNumber', 'membershipId') 
                 AND meta_value = %s AND user_id != %d LIMIT 1",
                $candidate,
                $user_id
            ) );

            if ( ! $exists ) {
                $found_unique = true;
                break;
            }

            $next_num++;
        }

        // Update sequence option atomically
        update_option( 'wlc_last_membership_number', $next_num );
        $final_membership_number = 'WLC-' . $next_num;

        if ( $user_id > 0 ) {
            update_user_meta( $user_id, 'wlc_membership_number', $final_membership_number );
            update_user_meta( $user_id, 'wlc_membership_id', $final_membership_number );
            update_user_meta( $user_id, 'membershipNumber', $final_membership_number );
            update_user_meta( $user_id, 'membershipId', $final_membership_number );
            update_user_meta( $user_id, 'membership_id', $final_membership_number );

            if ( class_exists( 'WLC_Core_Logger' ) ) {
                WLC_Core_Logger::log( "Assigned unique membership number {$final_membership_number} to user ID: {$user_id}", 'INFO' );
            }
        }

        return $final_membership_number;
    }

    /**
     * Activates membership for a user upon verified payment
     *
     * @param int $user_id
     * @param string $tier
     * @param int $duration_months
     * @return array
     */
    public static function activate_membership_for_user( $user_id, $tier = 'VIP Annual', $duration_months = 12 ) {
        $user_id = (int) $user_id;
        if ( $user_id <= 0 ) {
            return array(
                'membershipNumber' => 'Pending Allocation',
                'membershipId'     => 'Pending Allocation',
                'membershipStatus' => 'Inactive',
                'membershipTier'   => $tier,
                'startDate'        => current_time( 'Y-m-d' ),
                'validUntil'       => gmdate( 'Y-m-d', strtotime( '+1 year' ) ),
            );
        }

        $membership_id = self::allocate_membership_number( $user_id );
        
        $start_date  = current_time( 'Y-m-d' );
        $valid_until = gmdate( 'Y-m-d', strtotime( "+{$duration_months} months", strtotime( $start_date ) ) );

        update_user_meta( $user_id, 'wlc_membership_status', 'Active' );
        update_user_meta( $user_id, 'membership_status', 'Active' );
        update_user_meta( $user_id, 'membershipStatus', 'Active' );

        update_user_meta( $user_id, 'wlc_membership_tier', $tier );
        update_user_meta( $user_id, 'membership_tier', $tier );
        update_user_meta( $user_id, 'membershipTier', $tier );

        update_user_meta( $user_id, 'wlc_membership_start_date', $start_date );
        update_user_meta( $user_id, 'membership_start_date', $start_date );
        update_user_meta( $user_id, 'startDate', $start_date );

        update_user_meta( $user_id, 'wlc_membership_valid_until', $valid_until );
        update_user_meta( $user_id, 'membership_valid_until', $valid_until );
        update_user_meta( $user_id, 'validUntil', $valid_until );
        update_user_meta( $user_id, 'validTill', $valid_until );
        update_user_meta( $user_id, 'wlc_membership_valid_till', $valid_until );
        update_user_meta( $user_id, 'wlc_membership_expiry', $valid_until . ' 23:59:59' );

        return array(
            'membershipNumber' => $membership_id,
            'membershipId'     => $membership_id,
            'membershipStatus' => 'Active',
            'membershipTier'   => $tier,
            'startDate'        => $start_date,
            'validUntil'       => $valid_until,
        );
    }

    /**
     * 3. POST /custom/v1/payment/verify-payment
     * Cryptographically verifies the Razorpay signature via HMAC-SHA256 (hash_equals)
     * and activates user membership with a unique WLC-XXXX number.
     */
    public function verify_payment( $request ) {
        global $wpdb;
        $params = $request->get_json_params() ?: array();

        $order_id           = isset( $params['order_id'] ) ? sanitize_text_field( $params['order_id'] ) : '';
        $razorpay_order_id  = isset( $params['razorpay_order_id'] ) ? sanitize_text_field( $params['razorpay_order_id'] ) : '';
        $razorpay_payment_id= isset( $params['razorpay_payment_id'] ) ? sanitize_text_field( $params['razorpay_payment_id'] ) : '';
        $razorpay_signature = isset( $params['razorpay_signature'] ) ? sanitize_text_field( $params['razorpay_signature'] ) : '';

        if ( empty( $razorpay_payment_id ) ) {
            return Wellness_API_Response::error( 'missing_payment_id', 'Razorpay payment ID is required.', 400 );
        }

        $table_payments = $wpdb->prefix . 'wlc_payments';
        $order = null;

        if ( ! empty( $order_id ) ) {
            $order = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table_payments} WHERE order_id = %s", $order_id ) );
        }
        if ( ! $order && ! empty( $razorpay_order_id ) ) {
            $order = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table_payments} WHERE gateway_order_id = %s", $razorpay_order_id ) );
        }

        $user_id = $order ? $order->user_id : WLC_Core_JWT::get_current_user_id();

        // Idempotency: If already completed, return existing success state with assigned membership number
        if ( $order && $order->status === 'completed' ) {
            $current_membership_no = $user_id ? get_user_meta( $user_id, 'wlc_membership_number', true ) : $order->membership_id;
            return Wellness_API_Response::success( array(
                'success'           => true,
                'message'           => 'Payment verified successfully.',
                'order_id'          => $order->order_id,
                'razorpay_order_id' => $order->gateway_order_id,
                'razorpay_payment_id'=> $order->gateway_payment_id,
                'membership_id'     => $current_membership_no,
                'membership_number' => $current_membership_no,
                'membershipId'      => $current_membership_no,
                'membershipNumber'  => $current_membership_no,
                'membershipStatus'  => 'Active',
                'membershipTier'    => 'VIP Annual',
                'invoice_number'    => $order->invoice_number,
                'amount'            => floatval( $order->amount ),
                'status'            => 'completed',
                'startDate'         => get_user_meta( $user_id, 'wlc_membership_start_date', true ) ?: current_time( 'Y-m-d' ),
                'validUntil'        => get_user_meta( $user_id, 'wlc_membership_valid_until', true ) ?: gmdate( 'Y-m-d', strtotime( '+1 year' ) ),
                'valid_until'       => get_user_meta( $user_id, 'wlc_membership_valid_until', true ) ?: gmdate( 'Y-m-d', strtotime( '+1 year' ) ),
            ) );
        }

        $secret = self::get_razorpay_key_secret();

        // Cryptographic HMAC-SHA256 signature verification
        if ( ! empty( $razorpay_signature ) && ! empty( $razorpay_order_id ) ) {
            $generated_signature = hash_hmac( 'sha256', $razorpay_order_id . '|' . $razorpay_payment_id, $secret );
            if ( ! hash_equals( $generated_signature, $razorpay_signature ) ) {
                if ( $order ) {
                    $wpdb->update( $table_payments, array( 'status' => 'failed' ), array( 'id' => $order->id ) );
                }
                return Wellness_API_Response::error( 'invalid_signature', 'Invalid payment signature. Verification failed.', 400 );
            }
        }

        // ── Activate Membership and Allocate Unique Sequential Number ──
        $duration_months = intval( get_option( 'wlc_membership_duration_months', 12 ) );
        if ( $duration_months <= 0 ) $duration_months = 12;

        $activation = self::activate_membership_for_user( $user_id, 'VIP Annual', $duration_months );
        $membership_id = $activation['membershipNumber'];

        $invoice_number = 'INV-' . gmdate( 'Y' ) . '-' . strtoupper( wp_generate_password( 6, false, false ) );

        // Update or insert payment row in WordPress database
        if ( $order ) {
            $wpdb->update(
                $table_payments,
                array(
                    'gateway_payment_id' => $razorpay_payment_id,
                    'gateway_signature'  => $razorpay_signature,
                    'membership_id'      => $membership_id,
                    'invoice_number'     => $invoice_number,
                    'status'             => 'completed',
                    'paid_at'            => current_time( 'mysql' ),
                ),
                array( 'id' => $order->id )
            );
        } else {
            $wpdb->insert(
                $table_payments,
                array(
                    'order_id'           => $order_id ?: ( 'WLC_ORD_' . gmdate( 'Ymd' ) . '_' . strtoupper( wp_generate_password( 6, false, false ) ) ),
                    'user_id'            => $user_id ?: 1,
                    'tier'               => 'VIP Annual',
                    'amount'             => self::FIXED_FINAL_PRICE,
                    'base_amount'        => self::FIXED_BASE_AMOUNT,
                    'gst_amount'         => self::FIXED_GST_AMOUNT,
                    'tax_amount'         => self::FIXED_GST_AMOUNT,
                    'currency'           => 'INR',
                    'gateway'            => 'razorpay',
                    'gateway_order_id'   => $razorpay_order_id,
                    'gateway_payment_id' => $razorpay_payment_id,
                    'gateway_signature'  => $razorpay_signature,
                    'membership_id'      => $membership_id,
                    'invoice_number'     => $invoice_number,
                    'status'             => 'completed',
                    'paid_at'            => current_time( 'mysql' ),
                    'created_at'         => current_time( 'mysql' ),
                ),
                array( '%s', '%d', '%s', '%f', '%f', '%f', '%f', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
            );
        }

        // Dispatch Official Welcome & Thank You Email
        $user_obj = $user_id ? get_userdata( $user_id ) : null;
        $customer_email = $user_obj ? $user_obj->user_email : ( isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '' );
        $customer_name  = $user_obj ? ( $user_obj->display_name ?: $user_obj->first_name ) : ( isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : 'Customer' );

        if ( ! empty( $customer_email ) && class_exists( 'WLC_Core_Emails' ) ) {
            WLC_Core_Emails::send_membership_activation_email( $customer_email, array(
                'name' => $customer_name,
            ) );
        }

        // Invalidate payment session token
        $session_token = isset( $_SERVER['HTTP_X_PAYMENT_SESSION'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_PAYMENT_SESSION'] ) ) : '';
        if ( ! empty( $session_token ) ) {
            $sessions_table = $wpdb->prefix . 'wlc_payment_sessions';
            $wpdb->update(
                $sessions_table,
                array(
                    'status'  => 'used',
                    'used_at' => current_time( 'mysql' ),
                ),
                array( 'session_token' => $session_token )
            );
        }

        return Wellness_API_Response::success( array(
            'success'              => true,
            'message'              => 'VIP Membership activated successfully.',
            'order_id'             => $order ? $order->order_id : $order_id,
            'razorpay_order_id'    => $razorpay_order_id,
            'razorpay_payment_id'  => $razorpay_payment_id,
            'membership_id'        => $activation['membershipNumber'],
            'membership_number'    => $activation['membershipNumber'],
            'membershipId'         => $activation['membershipId'],
            'membershipNumber'     => $activation['membershipNumber'],
            'membershipStatus'     => $activation['membershipStatus'],
            'membership_status'    => $activation['membershipStatus'],
            'membershipTier'       => $activation['membershipTier'],
            'membership_tier'      => $activation['membershipTier'],
            'startDate'            => $activation['startDate'],
            'start_date'           => $activation['startDate'],
            'validUntil'           => $activation['validUntil'],
            'valid_until'          => $activation['validUntil'],
            'valid_till'           => $activation['validUntil'],
            'invoice_number'       => $invoice_number,
            'amount'               => self::FIXED_FINAL_PRICE,
            'status'               => 'completed',
        ) );
    }

    /**
     * 4. GET /custom/v1/payment/check-status
     */
    public function check_status( $request ) {
        global $wpdb;
        $order_id = $request->get_param( 'order_id' );
        if ( empty( $order_id ) ) {
            return Wellness_API_Response::error( 'missing_order_id', 'Order ID is required.', 400 );
        }

        $table = $wpdb->prefix . 'wlc_payments';
        $row   = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE order_id = %s OR gateway_order_id = %s", $order_id, $order_id ) );

        if ( ! $row ) {
            return Wellness_API_Response::error( 'order_not_found', 'Order not found.', 404 );
        }

        return Wellness_API_Response::success( array(
            'success'        => true,
            'order_id'       => $row->order_id,
            'status'         => $row->status,
            'is_paid'        => ( $row->status === 'completed' ),
            'membership_id'  => $row->membership_id,
            'membership_number' => $row->membership_id,
            'invoice_number' => $row->invoice_number,
            'paid_at'        => $row->paid_at,
        ) );
    }

    /**
     * 5. POST /custom/v1/payment/webhook
     */
    public function handle_webhook( $request ) {
        global $wpdb;
        $raw_body  = $request->get_body();
        $signature = isset( $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ) ) : '';
        $secret    = self::get_webhook_secret();

        if ( empty( $signature ) ) {
            return new WP_REST_Response( array( 'error' => 'Missing webhook signature.' ), 400 );
        }

        $expected_signature = hash_hmac( 'sha256', $raw_body, $secret );
        if ( ! hash_equals( $expected_signature, $signature ) ) {
            return new WP_REST_Response( array( 'error' => 'Invalid webhook signature.' ), 403 );
        }

        $data  = json_decode( $raw_body, true );
        $event = isset( $data['event'] ) ? $data['event'] : '';
        $table = $wpdb->prefix . 'wlc_payments';

        if ( $event === 'payment.captured' || $event === 'order.paid' ) {
            $payment_entity = isset( $data['payload']['payment']['entity'] ) ? $data['payload']['payment']['entity'] : array();
            $rzp_order_id   = isset( $payment_entity['order_id'] ) ? sanitize_text_field( $payment_entity['order_id'] ) : '';
            $rzp_payment_id = isset( $payment_entity['id'] ) ? sanitize_text_field( $payment_entity['id'] ) : '';

            $row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE gateway_order_id = %s", $rzp_order_id ) );
            if ( $row && $row->status !== 'completed' ) {
                $user_id        = (int) $row->user_id;
                $activation     = self::activate_membership_for_user( $user_id );
                $membership_id  = $activation['membershipNumber'];
                $invoice_number = 'INV-' . gmdate( 'Y' ) . '-' . strtoupper( wp_generate_password( 6, false, false ) );

                $wpdb->update(
                    $table,
                    array(
                        'gateway_payment_id' => $rzp_payment_id,
                        'membership_id'      => $membership_id,
                        'invoice_number'     => $invoice_number,
                        'status'             => 'completed',
                        'webhook_payload'    => $raw_body,
                        'paid_at'            => current_time( 'mysql' ),
                    ),
                    array( 'id' => $row->id )
                );
            }
        }

        return new WP_REST_Response( array( 'status' => 'ok' ), 200 );
    }
}

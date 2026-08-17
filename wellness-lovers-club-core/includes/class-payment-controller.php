<?php
/**
 * Payment Gateway, Dynamic UPI QR Code, and Webhook Controller
 * Handles Multi-gateway checkout (UPI QR, Cards, Net Banking, Razorpay, Cashfree),
 * Real-time Polling, and Secure HMAC-SHA256 Webhook synchronization.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Payment_Controller {

    const GST_RATE = 0.18; // 18% GST statutory tax

    public static function get_tier_prices() {
        return array(
            'gold'     => array( 'name' => 'Wellness Gold Club', 'price' => 9999 ),
            'luminary' => array( 'name' => 'Emerald Luminary',  'price' => 19999 ),
            'starter'  => array( 'name' => 'Sanctuary Essential', 'price' => 4999 ),
        );
    }

    /**
     * 1. POST /custom/v1/payment/create-order
     * Generates a new payment order, dynamic UPI QR payload, and sets 5-minute countdown.
     */
    public function create_order( $request ) {
        global $wpdb;
        $user_id = $request->get_param( 'user_id' );

        // If not supplied, attempt to resolve from JWT Bearer token
        if ( ! $user_id ) {
            $auth_header = $request->get_header( 'Authorization' );
            if ( $auth_header ) {
                $user_id = WLC_Core_JWT::validate_token( $auth_header );
            }
        }

        if ( ! $user_id ) {
            return Wellness_API_Response::error( 'unauthorized', 'User authentication required.', 401 );
        }

        $user = get_user_by( 'id', $user_id );
        if ( ! $user ) {
            return Wellness_API_Response::error( 'user_not_found', 'User profile not found.', 404 );
        }

        $tier_key   = sanitize_text_field( $request->get_param( 'tier' ) ?: 'gold' );
        $promo_code = sanitize_text_field( strtoupper( trim( $request->get_param( 'promo_code' ) ?: '' ) ) );
        $gateway    = sanitize_text_field( $request->get_param( 'gateway' ) ?: 'upi_qr' );

        $tiers = self::get_tier_prices();
        $tier_info = isset( $tiers[ $tier_key ] ) ? $tiers[ $tier_key ] : $tiers['gold'];

        $base_price = (float) $tier_info['price'];
        $discount   = 0.00;

        // Calculate Promo Code Discounts
        if ( $promo_code === 'WELLNESS10' || $promo_code === 'WELCOME10' ) {
            $discount = round( $base_price * 0.10, 2 );
        } elseif ( $promo_code === 'FOUNDER20' || $promo_code === 'ELITE20' ) {
            $discount = round( $base_price * 0.20, 2 );
        }

        $taxable_amount = $base_price - $discount;
        $tax_amount     = round( $taxable_amount * self::GST_RATE, 2 );
        $total_amount   = $taxable_amount + $tax_amount;

        $order_id = 'ORD_' . date( 'Ymd' ) . '_' . strtoupper( wp_generate_password( 8, false, false ) );
        $upi_vpa  = defined( 'WLC_UPI_VPA' ) ? WLC_UPI_VPA : 'wellnesslovers@icici';
        $merchant = 'Wellness Lovers Club';

        // NPCI Standard Dynamic UPI QR URI
        $upi_qr_payload = sprintf(
            'upi://pay?pa=%s&pn=%s&am=%s&tr=%s&tn=%s&cu=INR',
            rawurlencode( $upi_vpa ),
            rawurlencode( $merchant ),
            number_format( $total_amount, 2, '.', '' ),
            rawurlencode( $order_id ),
            rawurlencode( 'WLC ' . $tier_info['name'] )
        );

        $qr_expires_at = gmdate( 'Y-m-d H:i:s', time() + 300 ); // 5 minutes live timer

        // Save order in database
        $table = $wpdb->prefix . 'wlc_payments';
        $inserted = $wpdb->insert(
            $table,
            array(
                'order_id'        => $order_id,
                'user_id'         => $user_id,
                'tier'            => $tier_key,
                'amount'          => $total_amount,
                'tax_amount'      => $tax_amount,
                'discount_amount' => $discount,
                'promo_code'      => $promo_code,
                'currency'        => 'INR',
                'gateway'         => $gateway,
                'upi_vpa'         => $upi_vpa,
                'upi_qr_payload'  => $upi_qr_payload,
                'qr_expires_at'   => $qr_expires_at,
                'status'          => 'pending',
                'created_at'      => gmdate( 'Y-m-d H:i:s' ),
            ),
            array( '%s', '%d', '%s', '%f', '%f', '%f', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return Wellness_API_Response::error( 'db_error', 'Failed to create payment order record.', 500 );
        }

        return Wellness_API_Response::success( array(
            'success'            => true,
            'order_id'           => $order_id,
            'amount'             => $total_amount,
            'currency'           => 'INR',
            'tier'               => $tier_info,
            'breakdown'          => array(
                'base_price'     => $base_price,
                'discount'       => $discount,
                'taxable_amount' => $taxable_amount,
                'tax_amount'     => $tax_amount,
                'total'          => $total_amount,
            ),
            'upi_details'        => array(
                'vpa'            => $upi_vpa,
                'merchant_name'  => $merchant,
                'qr_payload'     => $upi_qr_payload,
                'expires_at'     => $qr_expires_at,
                'expires_in_sec' => 300,
            ),
            'check_status_url'   => rest_url( 'custom/v1/payment/check-status?order_id=' . $order_id ),
        ) );
    }

    /**
     * 2. GET /custom/v1/payment/check-status
     * Lightweight real-time polling endpoint for frontend QR checkout monitor.
     */
    public function check_status( $request ) {
        global $wpdb;
        $order_id = sanitize_text_field( $request->get_param( 'order_id' ) );

        if ( empty( $order_id ) ) {
            return Wellness_API_Response::error( 'missing_param', 'Order ID required.', 400 );
        }

        $table = $wpdb->prefix . 'wlc_payments';
        $order = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE order_id = %s LIMIT 1", $order_id ) );

        if ( ! $order ) {
            return Wellness_API_Response::error( 'order_not_found', 'Order record not found.', 404 );
        }

        // Check if QR code expired
        if ( $order->status === 'pending' && strtotime( $order->qr_expires_at ) < time() ) {
            $wpdb->update( $table, array( 'status' => 'expired' ), array( 'id' => $order->id ) );
            $order->status = 'expired';
        }

        return Wellness_API_Response::success( array(
            'order_id'       => $order->order_id,
            'status'         => $order->status,
            'is_paid'        => ( $order->status === 'completed' ),
            'amount'         => (float) $order->amount,
            'membership_id'  => $order->membership_id,
            'invoice_number' => $order->invoice_number,
            'paid_at'        => $order->paid_at,
        ) );
    }

    /**
     * 3. POST /custom/v1/payment/verify-payment
     * Confirms and settles payment, upgrades user role, and dispatches invoice email.
     */
    public function verify_payment( $request ) {
        global $wpdb;

        $order_id           = sanitize_text_field( $request->get_param( 'order_id' ) );
        $gateway_payment_id = sanitize_text_field( $request->get_param( 'gateway_payment_id' ) ?: $request->get_param( 'transaction_id' ) );
        $gateway_signature  = sanitize_text_field( $request->get_param( 'gateway_signature' ) ?: '' );

        if ( empty( $order_id ) ) {
            return Wellness_API_Response::error( 'missing_order_id', 'Order ID is required.', 400 );
        }

        $table = $wpdb->prefix . 'wlc_payments';
        $order = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE order_id = %s LIMIT 1", $order_id ) );

        if ( ! $order ) {
            return Wellness_API_Response::error( 'not_found', 'Order not found.', 404 );
        }

        if ( $order->status === 'completed' ) {
            return Wellness_API_Response::success( array(
                'success'        => true,
                'message'        => 'Payment is already confirmed and active.',
                'order_id'       => $order->order_id,
                'membership_id'  => $order->membership_id,
                'invoice_number' => $order->invoice_number,
            ) );
        }

        // Razorpay Signature Validation if applicable
        if ( defined( 'WLC_RAZORPAY_KEY_SECRET' ) && ! empty( $gateway_signature ) && ! empty( $gateway_payment_id ) ) {
            $expected_sig = hash_hmac( 'sha256', $order->gateway_order_id . '|' . $gateway_payment_id, WLC_RAZORPAY_KEY_SECRET );
            if ( ! hash_equals( $expected_sig, $gateway_signature ) ) {
                return Wellness_API_Response::error( 'invalid_signature', 'Payment gateway signature mismatch.', 400 );
            }
        }

        $completion = self::settle_and_activate_membership( $order, $gateway_payment_id, 'manual_verification' );

        if ( is_wp_error( $completion ) ) {
            return $completion;
        }

        return Wellness_API_Response::success( $completion );
    }

    /**
     * 4. POST /custom/v1/payment/webhook
     * Automated Webhook Listener with HMAC-SHA256 signature verification.
     */
    public function handle_webhook( $request ) {
        global $wpdb;

        $raw_body = $request->get_body();
        $headers  = $request->get_headers();

        // 1. Signature Verification
        $webhook_secret = defined( 'WLC_WEBHOOK_SECRET' ) ? WLC_WEBHOOK_SECRET : ( defined( 'WLC_RAZORPAY_WEBHOOK_SECRET' ) ? WLC_RAZORPAY_WEBHOOK_SECRET : '' );
        
        if ( $webhook_secret ) {
            $sig_header = isset( $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ) ? $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] : ( isset( $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ) ? $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] : '' );
            
            if ( empty( $sig_header ) ) {
                return new WP_REST_Response( array( 'error' => 'Missing webhook signature header' ), 401 );
            }

            $computed = hash_hmac( 'sha256', $raw_body, $webhook_secret );
            if ( ! hash_equals( $computed, $sig_header ) ) {
                return new WP_REST_Response( array( 'error' => 'Invalid signature' ), 403 );
            }
        }

        $payload = json_decode( $raw_body, true );
        if ( ! $payload ) {
            return new WP_REST_Response( array( 'error' => 'Invalid JSON body' ), 400 );
        }

        // Extract Order Reference & Payment ID based on payload format
        $order_id   = '';
        $payment_id = '';
        $event      = isset( $payload['event'] ) ? $payload['event'] : 'payment.captured';

        if ( isset( $payload['payload']['payment']['entity'] ) ) {
            $entity     = $payload['payload']['payment']['entity'];
            $payment_id = isset( $entity['id'] ) ? $entity['id'] : '';
            $order_id   = isset( $entity['notes']['order_id'] ) ? $entity['notes']['order_id'] : ( isset( $entity['order_id'] ) ? $entity['order_id'] : '' );
        } elseif ( isset( $payload['data']['order_id'] ) ) {
            $order_id   = $payload['data']['order_id'];
            $payment_id = isset( $payload['data']['payment_id'] ) ? $payload['data']['payment_id'] : '';
        } elseif ( isset( $payload['order_id'] ) ) {
            $order_id   = $payload['order_id'];
            $payment_id = isset( $payload['payment_id'] ) ? $payload['payment_id'] : '';
        }

        if ( ! $order_id ) {
            return new WP_REST_Response( array( 'status' => 'ignored', 'message' => 'No order identifier found in payload' ), 200 );
        }

        $table = $wpdb->prefix . 'wlc_payments';
        $order = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE order_id = %s OR gateway_order_id = %s LIMIT 1", $order_id, $order_id ) );

        if ( ! $order ) {
            return new WP_REST_Response( array( 'status' => 'order_not_found' ), 404 );
        }

        if ( $order->status === 'completed' ) {
            return new WP_REST_Response( array( 'status' => 'already_processed' ), 200 );
        }

        // Settle & activate
        self::settle_and_activate_membership( $order, $payment_id, $raw_body );

        return new WP_REST_Response( array( 'status' => 'success', 'order_id' => $order->order_id ), 200 );
    }

    /**
     * Core Settle and Activate Helper
     * 1. Marks order completed
     * 2. Sets Membership ID `#WLC-2026-XXXX` and Invoice number
     * 3. Activates user membership meta & role
     * 4. Sends tax invoice email
     */
    public static function settle_and_activate_membership( $order, $payment_id = '', $webhook_raw = '' ) {
        global $wpdb;

        $table         = $wpdb->prefix . 'wlc_payments';
        $membership_id = 'WLC-' . date( 'Y' ) . '-' . str_pad( (string) $order->user_id . rand( 100, 999 ), 6, '0', STR_PAD_LEFT );
        $invoice_no    = 'INV-' . date( 'Y' ) . '-' . strtoupper( wp_generate_password( 6, false, false ) );
        $paid_at       = gmdate( 'Y-m-d H:i:s' );
        $valid_until   = gmdate( 'Y-m-d H:i:s', strtotime( '+1 year' ) );

        $updated = $wpdb->update(
            $table,
            array(
                'status'             => 'completed',
                'membership_id'      => $membership_id,
                'invoice_number'     => $invoice_no,
                'gateway_payment_id' => $payment_id,
                'webhook_payload'    => is_string( $webhook_raw ) ? $webhook_raw : json_encode( $webhook_raw ),
                'paid_at'            => $paid_at,
            ),
            array( 'id' => $order->id ),
            array( '%s', '%s', '%s', '%s', '%s', '%s' )
        );

        if ( false === $updated ) {
            return new WP_Error( 'db_error', 'Failed to update order status.' );
        }

        // 1. Update User WordPress Meta
        $user_id = $order->user_id;
        update_user_meta( $user_id, 'wlc_membership_status', 'active' );
        update_user_meta( $user_id, 'wlc_membership_tier', $order->tier );
        update_user_meta( $user_id, 'wlc_membership_id', $membership_id );
        update_user_meta( $user_id, 'wlc_membership_valid_from', $paid_at );
        update_user_meta( $user_id, 'wlc_membership_valid_until', $valid_until );

        // 2. Ensure User Role is set to wlc_member or subscriber
        $user = get_user_by( 'id', $user_id );
        if ( $user ) {
            $user->add_role( 'wlc_member' );
            if ( ! in_array( 'subscriber', (array) $user->roles ) ) {
                $user->add_role( 'subscriber' );
            }

            // 3. Send Automated Tax Invoice & VIP Confirmation Email
            $tier_names = array(
                'gold'     => 'Wellness Gold Club',
                'luminary' => 'Emerald Luminary',
                'starter'  => 'Sanctuary Essential',
            );
            $tier_display = isset( $tier_names[ $order->tier ] ) ? $tier_names[ $order->tier ] : 'Wellness Gold Club';

            WLC_Core_Emails::send_membership_activation_email(
                $user->user_email,
                array(
                    'name'           => $user->display_name ?: $user->first_name,
                    'tier_name'      => $tier_display,
                    'membership_id'  => $membership_id,
                    'invoice_number' => $invoice_no,
                    'amount'         => (float) $order->amount,
                    'payment_method' => $order->gateway,
                    'valid_until'    => date( 'F d, Y', strtotime( '+1 year' ) ),
                )
            );
        }

        return array(
            'success'        => true,
            'message'        => 'Payment confirmed! VIP Membership pass activated.',
            'order_id'       => $order->order_id,
            'membership_id'  => $membership_id,
            'invoice_number' => $invoice_no,
            'tier'           => $order->tier,
            'amount'         => (float) $order->amount,
            'status'         => 'completed',
            'valid_until'    => $valid_until,
        );
    }
}

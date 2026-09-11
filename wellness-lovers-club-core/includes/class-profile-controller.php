<?php
/**
 * Profile, Membership, Membership Card, Payments and Orders data management handler
 * Wellness Lovers Club — Production Backend Profile & Membership Card Controller
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! class_exists( 'WLC_Core_Profile_Controller' ) ) {

    class WLC_Core_Profile_Controller {

        /**
         * Resolves the authenticated user ID safely from request or session
         *
         * @param WP_REST_Request|null $request
         * @return int
         */
        private function resolve_user_id( $request = null ) {
            $user_id = 0;
            if ( class_exists( 'WLC_Core_JWT' ) ) {
                $user_id = WLC_Core_JWT::get_current_user_id( $request );
            }
            if ( ! $user_id ) {
                $user_id = get_current_user_id();
            }
            return (int) $user_id;
        }

        /**
         * Global Membership Card Configuration from WordPress Admin Options
         *
         * @return array
         */
        public static function get_global_card_config() {
            $saved = get_option( 'wlc_membership_card_config', array() );
            if ( ! is_array( $saved ) ) {
                $saved = array();
            }

            $defaults = array(
                'cardTitle'          => 'VIP Annual Membership',
                'tierName'           => 'VIP Annual Membership',
                'price'              => '₹29,000',
                'validityText'       => '365 Days Access',
                'mottoLines'         => array( 'NOURISH', 'RELAX', 'THRIVE' ),
                'lifestyleText'      => 'WELLNESS IS A LIFESTYLE.',
                'memberNameLabel'    => 'MEMBER NAME',
                'membershipNoLabel'  => 'MEMBERSHIP NO.',
                'validToLabel'       => 'VALID TO',
                'backgroundImage'    => '/images/wlc-membership-card-bg.webp',
                'downloadButtonText' => 'DOWNLOAD MEMBERSHIP CARD',
                'downloadCaption'    => 'High-resolution printable digital membership card format (PNG).',
                'benefits'           => array(
                    'Exclusive Curated Experiences',
                    'Priority Spa & Sanctuary Bookings',
                    'Handpicked Luxury Stays',
                    'Global Wellness Community Access',
                ),
                'terms'              => 'Valid for 1 year from activation. Non-transferable.',
            );

            $config = wp_parse_args( $saved, $defaults );

            // Ensure mottoLines is a clean non-empty array
            if ( empty( $config['mottoLines'] ) || ! is_array( $config['mottoLines'] ) ) {
                $config['mottoLines'] = $defaults['mottoLines'];
            }

            return $config;
        }

        /**
         * Builds a normalized canonical membership card array for a given user ID
         *
         * @param int $user_id
         * @return array|false
         */
        public static function get_membership_card_data( $user_id ) {
            $user_id = (int) $user_id;
            if ( $user_id <= 0 ) return false;

            $user = get_userdata( $user_id );
            if ( ! $user ) return false;

            $card_config = self::get_global_card_config();

            // Canonical Metadata Resolution
            $membership_number = get_user_meta( $user_id, 'wlc_membership_number', true );
            if ( empty( $membership_number ) ) {
                $membership_number = get_user_meta( $user_id, 'wlc_membership_id', true );
            }
            if ( empty( $membership_number ) ) {
                $membership_number = get_user_meta( $user_id, 'membershipNumber', true );
            }
            if ( empty( $membership_number ) ) {
                $membership_number = get_user_meta( $user_id, 'membershipId', true );
            }

            $membership_status = get_user_meta( $user_id, 'wlc_membership_status', true );
            if ( empty( $membership_status ) ) {
                $membership_status = get_user_meta( $user_id, 'membership_status', true );
            }
            if ( empty( $membership_status ) ) {
                $membership_status = get_user_meta( $user_id, 'membershipStatus', true ) ?: 'Inactive';
            }

            $membership_tier = get_user_meta( $user_id, 'wlc_membership_tier', true );
            if ( empty( $membership_tier ) ) {
                $membership_tier = get_user_meta( $user_id, 'membership_tier', true );
            }
            if ( empty( $membership_tier ) ) {
                $membership_tier = get_user_meta( $user_id, 'membershipTier', true ) ?: ( $card_config['tierName'] ?? 'VIP Annual Membership' );
            }

            $start_date = get_user_meta( $user_id, 'wlc_membership_start_date', true );
            if ( empty( $start_date ) ) {
                $start_date = get_user_meta( $user_id, 'membership_start_date', true ) ?: ( $user->user_registered ? gmdate( 'Y-m-d', strtotime( $user->user_registered ) ) : '' );
            }

            $valid_until = get_user_meta( $user_id, 'wlc_membership_valid_until', true );
            if ( empty( $valid_until ) ) {
                $valid_until = get_user_meta( $user_id, 'membership_valid_until', true );
            }
            if ( empty( $valid_until ) ) {
                $valid_until = get_user_meta( $user_id, 'validTill', true ) ?: ( get_user_meta( $user_id, 'validUntil', true ) ?: '' );
            }

            $card_issue_date = get_user_meta( $user_id, 'wlc_card_issue_date', true ) ?: $start_date;
            $card_expiry_date = get_user_meta( $user_id, 'wlc_card_expiry_date', true ) ?: $valid_until;
            $profile_photo    = get_user_meta( $user_id, 'wlc_profile_photo', true ) ?: '';

            $phone       = get_user_meta( $user_id, 'wlc_phone', true ) ?: ( get_user_meta( $user_id, 'phone', true ) ?: '' );
            $profession  = get_user_meta( $user_id, 'wlc_profession', true ) ?: ( get_user_meta( $user_id, 'profession', true ) ?: '' );
            $company     = get_user_meta( $user_id, 'wlc_company_name', true ) ?: ( get_user_meta( $user_id, 'companyName', true ) ?: '' );
            $country     = get_user_meta( $user_id, 'wlc_country', true ) ?: ( get_user_meta( $user_id, 'country', true ) ?: '' );
            $address     = get_user_meta( $user_id, 'wlc_correspondence_address', true ) ?: ( get_user_meta( $user_id, 'address', true ) ?: '' );

            $first_name   = $user->first_name ?: ( get_user_meta( $user_id, 'first_name', true ) ?: '' );
            $last_name    = $user->last_name ?: ( get_user_meta( $user_id, 'last_name', true ) ?: '' );
            $full_name    = trim( $first_name . ' ' . $last_name );
            $display_name = $full_name ?: ( $user->display_name ?: $user->user_login );

            return array(
                'userId'                => (string) $user_id,
                'firstName'             => $first_name,
                'lastName'              => $last_name,
                'fullName'              => $display_name,
                'displayName'           => $display_name,
                'name'                  => $display_name,
                'email'                 => $user->user_email,
                'phone'                 => $phone,
                'membershipNumber'      => $membership_number,
                'membershipId'          => $membership_number,
                'wlc_membership_number' => $membership_number,
                'wlc_membership_id'     => $membership_number,
                'membershipTier'        => $membership_tier,
                'membershipStatus'      => $membership_status,
                'startDate'             => $start_date,
                'validUntil'            => $valid_until,
                'validTill'             => $valid_until,
                'profession'            => $profession,
                'companyName'           => $company,
                'country'               => $country,
                'correspondenceAddress' => $address,
                'address'               => $address,
                'profilePhoto'          => $profile_photo,
                'cardIssueDate'         => $card_issue_date,
                'cardExpiryDate'        => $card_expiry_date,
                'cardConfig'            => $card_config,
            );
        }

        /**
         * ─── 1. GET /custom/v1/profile ──────────────────────────────────────────
         */
        public function get_profile( $request ) {
            $user_id = $this->resolve_user_id( $request );

            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Authentication required.', array( 'status' => 401 ) );
            }

            $card_data = self::get_membership_card_data( $user_id );
            if ( ! $card_data ) {
                return new WP_Error( 'user_not_found', 'User not found in database.', array( 'status' => 404 ) );
            }

            $user_data = array_merge( $card_data, array(
                'id'                   => (string) $user_id,
                'fullName'             => $card_data['displayName'],
                'membership_status'    => $card_data['membershipStatus'],
                'membership_tier'      => $card_data['membershipTier'],
                'membershipValidUntil' => $card_data['validUntil'],
                'cardConfig'           => $card_data['cardConfig'] ?? self::get_global_card_config(),
            ) );

            return Wellness_API_Response::success( $user_data );
        }

        /**
         * ─── 2. GET /custom/v1/membership-card ──────────────────────────────────
         * Dedicated endpoint returning authoritative live membership card data
         */
        public function get_membership_card( $request ) {
            $user_id = $this->resolve_user_id( $request );

            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Authentication required.', array( 'status' => 401 ) );
            }

            $card_data = self::get_membership_card_data( $user_id );
            if ( ! $card_data ) {
                return new WP_Error( 'user_not_found', 'User membership card not found.', array( 'status' => 404 ) );
            }

            return Wellness_API_Response::success( array(
                'success'        => true,
                'membershipCard' => $card_data,
                'cardConfig'     => $card_data['cardConfig'] ?? self::get_global_card_config(),
            ) );
        }

        /**
         * ─── 3. PUT /custom/v1/admin/membership-card/{user_id} ──────────────────
         * Administrator endpoint to manually edit any member's card data
         */
        public function admin_update_membership_card( $request ) {
            if ( ! current_user_can( 'manage_options' ) ) {
                return new WP_Error( 'forbidden', 'Administrator permissions required.', array( 'status' => 403 ) );
            }

            $target_user_id = (int) $request->get_param( 'user_id' );
            if ( $target_user_id <= 0 || ! get_userdata( $target_user_id ) ) {
                return new WP_Error( 'invalid_user', 'Target member not found in database.', array( 'status' => 404 ) );
            }

            $params = $request->get_json_params() ?: ( $request->get_body_params() ?: array() );
            $admin_id = get_current_user_id();

            // 1. Membership Number uniqueness validation
            if ( isset( $params['membershipNumber'] ) ) {
                $new_number = sanitize_text_field( $params['membershipNumber'] );
                if ( ! empty( $new_number ) ) {
                    global $wpdb;
                    $existing_owner = $wpdb->get_var( $wpdb->prepare(
                        "SELECT user_id FROM {$wpdb->usermeta} WHERE (meta_key = 'wlc_membership_number' OR meta_key = 'wlc_membership_id') AND meta_value = %s AND user_id != %d LIMIT 1",
                        $new_number,
                        $target_user_id
                    ) );

                    if ( $existing_owner ) {
                        return new WP_Error( 'duplicate_membership_number', "Membership number '{$new_number}' is already assigned to member ID #{$existing_owner}.", array( 'status' => 409 ) );
                    }
                }
            }

            // 2. Update standard WP User fields if provided
            $user_update = array( 'ID' => $target_user_id );
            if ( isset( $params['firstName'] ) ) {
                $user_update['first_name'] = sanitize_text_field( $params['firstName'] );
            }
            if ( isset( $params['lastName'] ) ) {
                $user_update['last_name'] = sanitize_text_field( $params['lastName'] );
            }
            if ( isset( $params['displayName'] ) ) {
                $user_update['display_name'] = sanitize_text_field( $params['displayName'] );
            }
            if ( isset( $params['email'] ) ) {
                $email = sanitize_email( $params['email'] );
                if ( is_email( $email ) ) {
                    $existing_email_user = email_exists( $email );
                    if ( $existing_email_user && $existing_email_user != $target_user_id ) {
                        return new WP_Error( 'duplicate_email', 'Email address is already in use by another user.', array( 'status' => 409 ) );
                    }
                    $user_update['user_email'] = $email;
                }
            }

            if ( count( $user_update ) > 1 ) {
                wp_update_user( $user_update );
            }

            // 3. Update canonical user meta fields
            $meta_mappings = array(
                'membershipNumber'      => 'wlc_membership_number',
                'membershipId'          => 'wlc_membership_id',
                'membershipStatus'      => 'wlc_membership_status',
                'membershipTier'        => 'wlc_membership_tier',
                'startDate'             => 'wlc_membership_start_date',
                'validUntil'            => 'wlc_membership_valid_until',
                'phone'                 => 'wlc_phone',
                'profession'            => 'wlc_profession',
                'companyName'           => 'wlc_company_name',
                'country'               => 'wlc_country',
                'correspondenceAddress' => 'wlc_correspondence_address',
                'profilePhoto'          => 'wlc_profile_photo',
                'cardIssueDate'         => 'wlc_card_issue_date',
                'cardExpiryDate'        => 'wlc_card_expiry_date',
            );

            $audit_changes = array();

            foreach ( $meta_mappings as $param_key => $meta_key ) {
                if ( isset( $params[ $param_key ] ) ) {
                    $old_val = get_user_meta( $target_user_id, $meta_key, true );
                    $new_val = sanitize_text_field( $params[ $param_key ] );

                    if ( $meta_key === 'wlc_correspondence_address' ) {
                        $new_val = sanitize_textarea_field( $params[ $param_key ] );
                    }

                    if ( $old_val !== $new_val ) {
                        update_user_meta( $target_user_id, $meta_key, $new_val );
                        // Also update legacy mirror keys
                        if ( $meta_key === 'wlc_membership_number' ) {
                            update_user_meta( $target_user_id, 'wlc_membership_id', $new_val );
                            update_user_meta( $target_user_id, 'membershipNumber', $new_val );
                        }
                        if ( $meta_key === 'wlc_membership_status' ) {
                            update_user_meta( $target_user_id, 'membership_status', $new_val );
                            update_user_meta( $target_user_id, 'membershipStatus', $new_val );
                        }
                        if ( $meta_key === 'wlc_membership_valid_until' ) {
                            update_user_meta( $target_user_id, 'validTill', $new_val );
                            update_user_meta( $target_user_id, 'validUntil', $new_val );
                        }

                        $audit_changes[ $meta_key ] = array( 'old' => $old_val, 'new' => $new_val );
                    }
                }
            }

            // 4. Record admin audit log
            if ( ! empty( $audit_changes ) ) {
                $audit_logs = get_option( 'wlc_admin_card_audit_logs', array() );
                $audit_logs[] = array(
                    'admin_id'   => $admin_id,
                    'user_id'    => $target_user_id,
                    'changes'    => $audit_changes,
                    'timestamp'  => current_time( 'mysql' ),
                );
                // Keep last 100 entries
                if ( count( $audit_logs ) > 100 ) {
                    $audit_logs = array_slice( $audit_logs, -100 );
                }
                update_option( 'wlc_admin_card_audit_logs', $audit_logs, false );
            }

            $updated_card = self::get_membership_card_data( $target_user_id );

            return Wellness_API_Response::success( array(
                'success'        => true,
                'message'        => 'Membership card updated successfully.',
                'membershipCard' => $updated_card,
            ) );
        }

        /**
         * ─── 4. PUT /custom/v1/profile ──────────────────────────────────────────
         */
        public function update_profile( $request ) {
            $user_id = $this->resolve_user_id( $request );

            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Authentication required.', array( 'status' => 401 ) );
            }

            $params = $request->get_json_params() ?: ( $request->get_body_params() ?: array() );
            $update_data = array( 'ID' => $user_id );

            if ( isset( $params['firstName'] ) ) {
                $update_data['first_name'] = sanitize_text_field( $params['firstName'] );
            }
            if ( isset( $params['lastName'] ) ) {
                $update_data['last_name'] = sanitize_text_field( $params['lastName'] );
            }
            if ( isset( $params['email'] ) ) {
                $email = sanitize_email( $params['email'] );
                if ( is_email( $email ) && $email !== get_the_author_meta( 'user_email', $user_id ) ) {
                    if ( email_exists( $email ) ) {
                        return new WP_Error( 'email_exists', 'This email is already in use.', array( 'status' => 400 ) );
                    }
                    $update_data['user_email'] = $email;
                }
            }

            if ( count( $update_data ) > 1 ) {
                $result = wp_update_user( $update_data );
                if ( is_wp_error( $result ) ) {
                    return new WP_Error( 'profile_update_error', $result->get_error_message(), array( 'status' => 500 ) );
                }
            }

            if ( isset( $params['phone'] ) ) {
                update_user_meta( $user_id, 'wlc_phone', sanitize_text_field( $params['phone'] ) );
                update_user_meta( $user_id, 'phone', sanitize_text_field( $params['phone'] ) );
            }
            if ( isset( $params['profession'] ) ) {
                update_user_meta( $user_id, 'wlc_profession', sanitize_text_field( $params['profession'] ) );
                update_user_meta( $user_id, 'profession', sanitize_text_field( $params['profession'] ) );
            }
            if ( isset( $params['companyName'] ) ) {
                update_user_meta( $user_id, 'wlc_company_name', sanitize_text_field( $params['companyName'] ) );
                update_user_meta( $user_id, 'companyName', sanitize_text_field( $params['companyName'] ) );
            }
            if ( isset( $params['country'] ) ) {
                update_user_meta( $user_id, 'wlc_country', sanitize_text_field( $params['country'] ) );
                update_user_meta( $user_id, 'country', sanitize_text_field( $params['country'] ) );
            }
            if ( isset( $params['address'] ) ) {
                update_user_meta( $user_id, 'wlc_correspondence_address', sanitize_textarea_field( $params['address'] ) );
                update_user_meta( $user_id, 'address', sanitize_textarea_field( $params['address'] ) );
            }

            return $this->get_profile( $request );
        }

        /**
         * ─── 5. GET /custom/v1/membership ───────────────────────────────────────
         */
        public function get_membership( $request ) {
            $user_id = $this->resolve_user_id( $request );

            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Authentication required.', array( 'status' => 401 ) );
            }

            $card_data = self::get_membership_card_data( $user_id );
            if ( ! $card_data ) {
                return new WP_Error( 'user_not_found', 'User membership not found.', array( 'status' => 404 ) );
            }

            $membership = array(
                'status'               => $card_data['membershipStatus'],
                'membershipStatus'     => $card_data['membershipStatus'],
                'tier'                 => $card_data['membershipTier'],
                'membershipTier'       => $card_data['membershipTier'],
                'membershipNumber'     => $card_data['membershipNumber'],
                'membershipId'         => $card_data['membershipId'],
                'wlc_membership_number'=> $card_data['membershipNumber'],
                'startDate'            => $card_data['startDate'],
                'validUntil'           => $card_data['validUntil'],
                'validTill'            => $card_data['validTill'],
                'benefits'             => array(
                    'Access to 5 wellness retreats per year',
                    'Priority spa bookings & wellness concierge',
                    'Monthly curated Himalayan healing guide',
                    'Exclusive luxury partner resort privileges',
                ),
            );

            return Wellness_API_Response::success( $membership );
        }

        /**
         * ─── 6. GET /custom/v1/orders ───────────────────────────────────────────
         */
        public function get_orders( $request ) {
            global $wpdb;
            $user_id = $this->resolve_user_id( $request );

            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Authentication required.', array( 'status' => 401 ) );
            }

            $orders = array();

            if ( class_exists( 'WooCommerce' ) && function_exists( 'wc_get_orders' ) ) {
                $customer_orders = wc_get_orders( array( 'customer' => $user_id, 'limit' => 20 ) );
                foreach ( $customer_orders as $order ) {
                    $items = array();
                    foreach ( $order->get_items() as $item ) {
                        $items[] = $item->get_name();
                    }
                    $orders[] = array(
                        'id'     => (string) $order->get_id(),
                        'date'   => $order->get_date_created() ? $order->get_date_created()->date( 'd / m / Y' ) : '',
                        'status' => ucfirst( $order->get_status() ),
                        'total'  => '₹' . number_format( (float) $order->get_total(), 2 ),
                        'item'   => implode( ', ', $items ) ?: 'Wellness Lovers Club Membership',
                    );
                }
            }

            $table_payments = $wpdb->prefix . 'wlc_payments';
            if ( $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_payments ) ) === $table_payments ) {
                $user = get_userdata( $user_id );
                $email = $user ? $user->user_email : '';

                $payment_orders = $wpdb->get_results( $wpdb->prepare(
                    "SELECT * FROM {$table_payments} WHERE (user_id = %d OR (email = %s AND email != '')) AND status = 'completed' ORDER BY created_at DESC LIMIT 20",
                    $user_id,
                    $email
                ) );

                if ( ! empty( $payment_orders ) ) {
                    foreach ( $payment_orders as $pay ) {
                        $exists = false;
                        foreach ( $orders as $o ) {
                            if ( $o['id'] === $pay->order_id || $o['id'] === $pay->gateway_payment_id ) {
                                $exists = true;
                                break;
                            }
                        }
                        if ( ! $exists ) {
                            $orders[] = array(
                                'id'     => $pay->order_id ?: $pay->gateway_payment_id,
                                'date'   => $pay->paid_at ? gmdate( 'd / m / Y', strtotime( $pay->paid_at ) ) : gmdate( 'd / m / Y', strtotime( $pay->created_at ) ),
                                'status' => 'Completed',
                                'total'  => '₹' . number_format( (float) $pay->amount, 2 ) . ' (GST 18%)',
                                'item'   => 'VIP Annual Membership Pass',
                            );
                        }
                    }
                }
            }

            return Wellness_API_Response::success( $orders );
        }

        /**
         * ─── 7. GET /custom/v1/payments ─────────────────────────────────────────
         */
        public function get_payments( $request ) {
            global $wpdb;
            $user_id = $this->resolve_user_id( $request );

            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Authentication required.', array( 'status' => 401 ) );
            }

            $payments = array();
            $table_payments = $wpdb->prefix . 'wlc_payments';

            if ( $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $table_payments ) ) === $table_payments ) {
                $user = get_userdata( $user_id );
                $email = $user ? $user->user_email : '';

                $db_payments = $wpdb->get_results( $wpdb->prepare(
                    "SELECT * FROM {$table_payments} WHERE (user_id = %d OR (email = %s AND email != '')) ORDER BY created_at DESC LIMIT 50",
                    $user_id,
                    $email
                ) );

                if ( ! empty( $db_payments ) ) {
                    foreach ( $db_payments as $row ) {
                        $method_label = 'Razorpay / Online Verified';
                        if ( $row->gateway === 'upi_qr' ) {
                            $method_label = 'UPI Direct Transfer';
                        }

                        $payments[] = array(
                            'id'                 => $row->order_id ?: $row->gateway_payment_id,
                            'order_id'           => $row->order_id,
                            'gateway_payment_id' => $row->gateway_payment_id,
                            'gateway_order_id'   => $row->gateway_order_id,
                            'invoice_number'     => $row->invoice_number,
                            'membership_id'      => $row->membership_id,
                            'method'             => $method_label,
                            'date'               => $row->paid_at ? gmdate( 'd M Y', strtotime( $row->paid_at ) ) : gmdate( 'd M Y', strtotime( $row->created_at ) ),
                            'status'             => ucfirst( $row->status ),
                            'amount'             => '₹' . number_format( (float) $row->amount, 2 ) . ' (GST 18%)',
                        );
                    }
                }
            }

            return Wellness_API_Response::success( $payments );
        }
    }
}

<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class ProfileController {

    /**
     * Get profiles endpoint
     */
    public function get_profile( \WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        if ( ! $user_id ) {
            return new \WP_Error( 'unauthorized', 'Invalid session.', array( 'status' => 401 ) );
        }

        $profile = $this->get_user_profile_data( $user_id );
        return new \WP_REST_Response( $profile, 200 );
    }

    /**
     * Update user profile
     */
    public function update_profile( \WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        if ( ! $user_id ) {
            return new \WP_Error( 'unauthorized', 'Invalid session.', array( 'status' => 401 ) );
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $user_data = array( 'ID' => $user_id );

        if ( isset( $params['firstName'] ) ) { $user_data['first_name'] = sanitize_text_field( $params['firstName'] ); }
        if ( isset( $params['lastName'] ) ) { $user_data['last_name'] = sanitize_text_field( $params['lastName'] ); }
        if ( isset( $params['email'] ) ) {
            $email = sanitize_email( $params['email'] );
            if ( is_email( $email ) ) {
                $existing = email_exists( $email );
                if ( $existing && $existing !== $user_id ) {
                    return new \WP_Error( 'email_exists', 'This email is already in use by another user.', 400 );
                }
                $user_data['user_email'] = $email;
            } else {
                return new \WP_Error( 'invalid_email', 'Invalid email address.', 400 );
            }
        }

        if ( count( $user_data ) > 1 ) {
            wp_update_user( $user_data );
        }

        // Update custom metadata
        if ( isset( $params['phone'] ) ) { update_user_meta( $user_id, 'wlc_phone', sanitize_text_field( $params['phone'] ) ); }
        if ( isset( $params['company'] ) ) { update_user_meta( $user_id, 'wlc_company_name', sanitize_text_field( $params['company'] ) ); }
        if ( isset( $params['address'] ) ) { update_user_meta( $user_id, 'wlc_correspondence_address', sanitize_textarea_field( $params['address'] ) ); }
        if ( isset( $params['city'] ) ) { update_user_meta( $user_id, 'wlc_city', sanitize_text_field( $params['city'] ) ); }
        if ( isset( $params['country'] ) ) { update_user_meta( $user_id, 'wlc_country', sanitize_text_field( $params['country'] ) ); }
        if ( isset( $params['bio'] ) ) { update_user_meta( $user_id, 'wlc_bio', sanitize_textarea_field( $params['bio'] ) ); }
        
        if ( isset( $params['socialLinks'] ) ) {
            $social = is_array( $params['socialLinks'] ) ? array_map( 'sanitize_url', $params['socialLinks'] ) : array();
            update_user_meta( $user_id, 'wlc_social_links', $social );
        }



        $profile = $this->get_user_profile_data( $user_id );
        return new \WP_REST_Response( $profile, 200 );
    }

    /**
     * Map user metadata to response format
     */
    public function get_user_profile_data( $user_id ) {
        $user = get_userdata( $user_id );
        if ( ! $user ) {
            return array();
        }

        $phone       = get_user_meta( $user_id, 'wlc_phone', true );
        $company     = get_user_meta( $user_id, 'wlc_company_name', true );
        $address     = get_user_meta( $user_id, 'wlc_correspondence_address', true );
        $city        = get_user_meta( $user_id, 'wlc_city', true );
        $country     = get_user_meta( $user_id, 'wlc_country', true );
        $bio         = get_user_meta( $user_id, 'wlc_bio', true );
        $social      = get_user_meta( $user_id, 'wlc_social_links', true );
        
        $membership_status = get_user_meta( $user_id, 'wlc_membership_status', true );
        $membership_tier   = get_user_meta( $user_id, 'wlc_membership_tier', true );

        if ( empty( $membership_status ) ) { $membership_status = 'Inactive'; }
        if ( empty( $membership_tier ) ) { $membership_tier = 'Lotus Club'; }

        return array(
            'id'               => (string) $user_id,
            'firstName'        => $user->first_name,
            'lastName'         => $user->last_name,
            'email'            => $user->user_email,
            'phone'            => $phone,
            'company'          => $company,
            'address'          => $address,
            'city'             => $city,
            'country'          => $country,
            'bio'              => $bio ? $bio : $user->description,
            'socialLinks'      => ! empty( $social ) ? (array) $social : array(),
            'roles'            => (array) $user->roles,
            'membershipStatus' => $membership_status,
            'membershipTier'   => $membership_tier
        );
    }

    /**
     * Get user memberships
     */
    public function get_membership( \WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        $status = get_user_meta( $user_id, 'wlc_membership_status', true );
        $tier = get_user_meta( $user_id, 'wlc_membership_tier', true );

        if ( empty( $status ) ) { $status = 'Inactive'; }
        if ( empty( $tier ) ) { $tier = 'Lotus Club'; }

        return new \WP_REST_Response( array(
            array(
                'id'           => 'mem_' . $user_id,
                'tier'         => $tier,
                'status'       => $status,
                'startDate'    => date( 'Y-m-d', strtotime( '-1 month' ) ),
                'endDate'      => date( 'Y-m-d', strtotime( '+11 months' ) ),
                'price'        => '$499',
                'billingCycle' => 'Annual'
            )
        ), 200 );
    }

    /**
     * Get user WooCommerce orders
     */
    public function get_orders( \WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        $orders = array();

        if ( class_exists( 'WooCommerce' ) ) {
            $customer_orders = wc_get_orders( array( 'customer' => $user_id, 'limit' => 20 ) );
            foreach ( $customer_orders as $order ) {
                $items = array();
                foreach ( $order->get_items() as $item ) { $items[] = $item->get_name(); }
                $orders[] = array(
                    'id'     => (string) $order->get_id(),
                    'date'   => $order->get_date_created()->date( 'Y-m-d' ),
                    'status' => ucfirst( $order->get_status() ),
                    'total'  => '$' . number_format( $order->get_total(), 2 ),
                    'item'   => implode( ', ', $items )
                );
            }
        } else {
            $orders = array(
                array(
                    'id'     => '101',
                    'date'     => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
                    'status' => 'Completed',
                    'total'  => '$499.00',
                    'item'   => 'Lotus Club Annual Membership'
                )
            );
        }

        return new \WP_REST_Response( $orders, 200 );
    }

    /**
     * Get user payments
     */
    public function get_payments( \WP_REST_Request $request ) {
        return new \WP_REST_Response( array(
            array(
                'id'     => 'pay_101',
                'date'   => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
                'amount' => '$499.00',
                'status' => 'Successful',
                'method' => 'Stripe Credit Card'
            )
        ), 200 );
    }
}

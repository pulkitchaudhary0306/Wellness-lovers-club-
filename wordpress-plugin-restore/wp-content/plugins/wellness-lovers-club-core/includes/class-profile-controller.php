<?php
/**
 * Profile and account data management handler
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Profile_Controller {

    /**
     * Retrieve current user profile details
     */
    public function get_profile( $request ) {
        $user_id = get_current_user_id();
        $user = get_userdata( $user_id );

        if ( ! $user ) {
            return new WP_Error( 'user_not_found', 'User not found.', array( 'status' => 404 ) );
        }

        $user_data = array(
            'id'               => (string) $user_id,
            'firstName'        => $user->first_name,
            'lastName'         => $user->last_name,
            'email'            => $user->user_email,
            'phone'            => WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'phone' ),
            'profession'       => WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'profession' ),
            'companyName'      => WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'companyName' ),
            'country'          => WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'country' ) ?: '',
            'membershipStatus' => WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'membershipStatus' ) ?: 'Inactive',
            'membershipTier'   => WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'membershipTier' ) ?: 'Lotus Club'
        );

        return Wellness_API_Response::success( $user_data );
    }

    /**
     * Update current user profile details
     */
    public function update_profile( $request ) {
        $user_id = get_current_user_id();
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $update_data = array( 'ID' => $user_id );

        // Standard name fields
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

        // Custom metadata fields
        if ( isset( $params['phone'] ) ) {
            WLC_Core_Auth_Controller::update_wlc_user_meta( $user_id, 'phone', sanitize_text_field( $params['phone'] ) );
        }
        if ( isset( $params['profession'] ) ) {
            WLC_Core_Auth_Controller::update_wlc_user_meta( $user_id, 'profession', sanitize_text_field( $params['profession'] ) );
        }
        if ( isset( $params['companyName'] ) ) {
            WLC_Core_Auth_Controller::update_wlc_user_meta( $user_id, 'companyName', sanitize_text_field( $params['companyName'] ) );
        }
        if ( isset( $params['country'] ) ) {
            WLC_Core_Auth_Controller::update_wlc_user_meta( $user_id, 'country', sanitize_text_field( $params['country'] ) );
        }

        WLC_Core_Logger::log( "Profile updated successfully for user ID: {$user_id}", 'INFO' );

        // Return refreshed profile
        return $this->get_profile( $request );
    }

    /**
     * Get Membership details
     */
    public function get_membership( $request ) {
        $user_id = get_current_user_id();
        
        $status = WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'membershipStatus' ) ?: 'Inactive';
        $tier = WLC_Core_Auth_Controller::get_wlc_user_meta( $user_id, 'membershipTier' ) ?: 'Lotus Club';

        $membership = array(
            'status'     => $status,
            'tier'       => $tier,
            'validUntil' => date( 'Y-m-d', strtotime( '+1 year' ) ),
            'benefits'   => array(
                'Access to 5 wellness retreats per year',
                'Priority spa bookings',
                'Monthly wellness newsletter',
                'Member-only discounts'
            )
        );

        return Wellness_API_Response::success( $membership );
    }

    /**
     * Get Order history (integrates with WooCommerce if active, otherwise returns mock history)
     */
    public function get_orders( $request ) {
        $user_id = get_current_user_id();
        $orders = array();

        if ( class_exists( 'WooCommerce' ) ) {
            $customer_orders = wc_get_orders( array( 'customer' => $user_id, 'limit' => 20 ) );
            foreach ( $customer_orders as $order ) {
                $items = array();
                foreach ( $order->get_items() as $item ) {
                    $items[] = $item->get_name();
                }
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
                    'date'   => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
                    'status' => 'Completed',
                    'total'  => '₹29,000.00',
                    'item'   => 'Lotus Club Annual Membership'
                )
            );
        }

        return Wellness_API_Response::success( $orders );
    }

    /**
     * Get Payment history
     */
    public function get_payments( $request ) {
        $payments = array();

        return Wellness_API_Response::success( $payments );
    }
}

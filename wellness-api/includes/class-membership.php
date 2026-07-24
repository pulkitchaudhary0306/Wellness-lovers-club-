<?php
/**
 * Membership REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Membership {

    /**
     * Register endpoints
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/membership', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_membership' ),
            'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
        ) );
    }

    /**
     * Get user memberships
     */
    public function get_membership( $request ) {
        $user_id = get_current_user_id();

        $status = wlc_get_user_meta( $user_id, 'membershipStatus' );
        $tier = wlc_get_user_meta( $user_id, 'membershipTier' );

        if ( empty( $status ) ) {
            $status = 'Inactive';
        }
        if ( empty( $tier ) ) {
            $tier = 'Lotus Club';
        }

        // Return membership array matching the Membership[] frontend type
        $memberships = array(
            array(
                'id'           => 'mem_' . $user_id,
                'tier'         => $tier,
                'status'       => $status,
                'startDate'    => date( 'Y-m-d', strtotime( '-1 month' ) ),
                'endDate'      => date( 'Y-m-d', strtotime( '+11 months' ) ),
                'price'        => '$499',
                'billingCycle' => 'Annual'
            )
        );

        return Wellness_API_Response::success( $memberships );
    }
}

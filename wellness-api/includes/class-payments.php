<?php
/**
 * Payments REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Payments {

    /**
     * Register endpoints
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/payments', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_payments' ),
            'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
        ) );
    }

    /**
     * Get user payments
     */
    public function get_payments( $request ) {
        $user_id = get_current_user_id();

        // Default mock payment records matching the Payment type in Next.js
        $payments = array(
            array(
                'id'     => 'pay_101',
                'date'   => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
                'amount' => '$499.00',
                'status' => 'Successful',
                'method' => 'Stripe Credit Card'
            )
        );

        return Wellness_API_Response::success( $payments );
    }
}

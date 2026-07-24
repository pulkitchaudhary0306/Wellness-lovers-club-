<?php
/**
 * Orders REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Orders {

    /**
     * Register endpoints
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/orders', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array( $this, 'get_orders' ),
            'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
        ) );
    }

    /**
     * Get user orders
     */
    public function get_orders( $request ) {
        $user_id = get_current_user_id();
        $orders = array();

        // Integrate with WooCommerce if active
        if ( class_exists( 'WooCommerce' ) ) {
            $customer_orders = wc_get_orders( array(
                'customer' => $user_id,
                'limit'    => 20
            ) );

            foreach ( $customer_orders as $order ) {
                $items = array();
                foreach ( $order->get_items() as $item ) {
                    $items[] = $item->get_name();
                }

                $orders[] = array(
                    'id'     => (string) $order->get_id(),
                    'date'   => $order->get_date_created()->date( 'Y-m-d' ),
                    'status' => ucfirst( $order->get_status() ), // e.g. Completed, Processing
                    'total'  => '$' . number_format( $order->get_total(), 2 ),
                    'item'   => implode( ', ', $items )
                );
            }
        } else {
            // Mock fallback order matching the Order type in Next.js
            $orders = array(
                array(
                    'id'     => '101',
                    'date'   => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
                    'status' => 'Completed',
                    'total'  => '$499.00',
                    'item'   => 'Lotus Club Annual Membership'
                )
            );
        }

        return Wellness_API_Response::success( $orders );
    }
}

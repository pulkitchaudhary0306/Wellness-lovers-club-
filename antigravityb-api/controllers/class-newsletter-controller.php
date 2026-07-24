<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use AntigravityB\API\Middleware\RateLimiter;

class NewsletterController {

    /**
     * Subscribe to newsletter
     */
    public function subscribe( \WP_REST_Request $request ) {
        // Rate limit: Max 5 actions per 15 minutes
        $limiter = RateLimiter::check_limit( 'newsletter_sub', 5, 900 );
        if ( is_wp_error( $limiter ) ) {
            return $limiter;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $email = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        if ( empty( $email ) || ! is_email( $email ) ) {
            return new \WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'agb_newsletter';

        // Duplicate email checking
        $exists = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$table_name} WHERE email = %s", $email ) );
        if ( $exists ) {
            return new \WP_Error( 'email_subscribed', 'This email is already subscribed to the newsletter.', array( 'status' => 400 ) );
        }

        $inserted = $wpdb->insert(
            $table_name,
            array(
                'email'      => $email,
                'status'     => 'Active',
                'created_at' => current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return new \WP_Error( 'db_insert_failed', 'Could not subscribe, database error.', array( 'status' => 500 ) );
        }

        return new \WP_REST_Response( array(
            'success' => true,
            'message' => 'Successfully subscribed to the newsletter!'
        ), 200 );
    }

    /**
     * Export active subscribers to CSV file (Admin Only)
     */
    public function export_subscribers( \WP_REST_Request $request ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'agb_newsletter';

        $subscribers = $wpdb->get_results( "SELECT email, status, created_at FROM {$table_name} ORDER BY id DESC", ARRAY_A );

        if ( empty( $subscribers ) ) {
            return new \WP_Error( 'no_subscribers', 'No subscribers found to export.', array( 'status' => 404 ) );
        }

        // Output CSV headers to download file
        header( 'Content-Type: text/csv; charset=utf-8' );
        header( 'Content-Disposition: attachment; filename=subscribers-' . date( 'Y-m-d' ) . '.csv' );

        $output = fopen( 'php://output', 'w' );
        fputcsv( $output, array( 'Email Address', 'Status', 'Subscription Date' ) );

        foreach ( $subscribers as $row ) {
            fputcsv( $output, $row );
        }

        fclose( $output );
        exit;
    }
}

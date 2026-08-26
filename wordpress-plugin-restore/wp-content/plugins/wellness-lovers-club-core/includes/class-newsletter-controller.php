<?php
/**
 * Newsletter subscription controller
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Newsletter_Controller {

    /**
     * Subscribe an email to the newsletter
     */
    public function subscribe( $request ) {
        // Rate limit: Max 5 subscription actions per 15 minutes per IP
        $limit = WLC_Core_Rate_Limiter::check_limit( 'newsletter_sub', 5, 900 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        if ( empty( $params['email'] ) ) {
            return new WP_Error( 'missing_email', 'Email address is required.', array( 'status' => 400 ) );
        }

        $email = sanitize_email( $params['email'] );
        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        global $wpdb;
        $table_news = $wpdb->prefix . 'wlc_newsletter';

        // Check duplicate
        $exists = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$table_news} WHERE email = %s", $email ) );
        if ( $exists ) {
            return new WP_Error( 'email_subscribed', 'This email address is already subscribed to our newsletter.', array( 'status' => 400 ) );
        }

        $inserted = $wpdb->insert(
            $table_news,
            array(
                'email'      => $email,
                'status'     => 'Active',
                'created_at' => current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            WLC_Core_Logger::log( "Newsletter subscription failed in DB for: {$email}", 'ERROR' );
            return new WP_Error( 'db_insert_failed', 'Could not subscribe, database error.', array( 'status' => 500 ) );
        }

        WLC_Core_Logger::log( "New newsletter subscription: {$email}", 'INFO' );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'Successfully subscribed to the newsletter!'
        ), 200 );
    }
}

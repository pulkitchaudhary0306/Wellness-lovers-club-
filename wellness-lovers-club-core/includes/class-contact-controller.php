<?php
/**
 * Contact Form Submission Handler
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Contact_Controller {

    /**
     * Handle incoming contact form submission REST API request
     */
    public function submit_contact( $request ) {
        // Rate limit: Max 5 contact form submissions per hour per IP
        $limit = WLC_Core_Rate_Limiter::check_limit( 'contact_submission', 5, 3600 );
        if ( is_wp_error( $limit ) ) {
            return $limit;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Spam Protection: Honeypot field (hidden input that bots typically autofill)
        if ( ! empty( $params['website'] ) ) {
            WLC_Core_Logger::log( "Spam submission blocked via Honeypot check", 'WARNING' );
            return new WP_Error( 'spam_detected', 'Spam submission blocked.', array( 'status' => 400 ) );
        }

        // Input validation
        $first_name = isset( $params['first_name'] ) ? sanitize_text_field( $params['first_name'] ) : '';
        $last_name  = isset( $params['last_name'] ) ? sanitize_text_field( $params['last_name'] ) : '';
        $email      = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $phone      = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
        $subject    = isset( $params['subject'] ) ? sanitize_text_field( $params['subject'] ) : 'Query from website';
        $message    = isset( $params['message'] ) ? sanitize_textarea_field( $params['message'] ) : '';

        if ( empty( $email ) || empty( $message ) ) {
            return new WP_Error( 'missing_fields', 'Email and message fields are required.', array( 'status' => 400 ) );
        }

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        // Save to Database
        global $wpdb;
        $table_contacts = $wpdb->prefix . 'wlc_contacts';
        $ip_address = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '';

        $inserted = $wpdb->insert(
            $table_contacts,
            array(
                'first_name' => $first_name,
                'last_name'  => $last_name,
                'email'      => $email,
                'phone'      => $phone,
                'subject'    => $subject,
                'message'    => $message,
                'status'     => 'New',
                'ip_address' => $ip_address,
                'created_at' => current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            WLC_Core_Logger::log( "Failed to save contact query in database.", 'ERROR' );
            return new WP_Error( 'db_insert_failed', 'Could not save message, database error.', array( 'status' => 500 ) );
        }

        WLC_Core_Logger::log( "New contact form submission from: {$email}", 'INFO' );

        // Send Notification Email to Admin
        WLC_Core_Emails::send_contact_notification( array(
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'email'      => $email,
            'phone'      => $phone,
            'subject'    => $subject,
            'message'    => $message
        ) );

        return Wellness_API_Response::success( array(
            'success' => true,
            'message' => 'Your message has been successfully received.'
        ), 200 );
    }
}

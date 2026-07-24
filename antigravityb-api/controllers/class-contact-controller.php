<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use AntigravityB\API\Middleware\RateLimiter;

class ContactController {

    /**
     * Handle contact form submission
     */
    public function submit_contact( \WP_REST_Request $request ) {
        // Rate limit: Max 5 submissions per hour per IP
        $limiter = RateLimiter::check_limit( 'contact_submit', 5, 3600 );
        if ( is_wp_error( $limiter ) ) {
            return $limiter;
        }

        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        // Spam Protection: Honeypot check
        if ( ! empty( $params['website'] ) ) {
            return new \WP_Error( 'spam_detected', 'Spam submission blocked.', array( 'status' => 400 ) );
        }

        // Input validation
        $name    = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';
        $email   = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $message = isset( $params['message'] ) ? sanitize_textarea_field( $params['message'] ) : '';

        if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
            return new \WP_Error( 'missing_fields', 'Name, email, and message are required.', array( 'status' => 400 ) );
        }

        if ( ! is_email( $email ) ) {
            return new \WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        // Save submission to database
        global $wpdb;
        $table_name = $wpdb->prefix . 'agb_contacts';
        $ip_address = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '';

        $inserted = $wpdb->insert(
            $table_name,
            array(
                'name'       => $name,
                'email'      => $email,
                'message'    => $message,
                'ip_address' => $ip_address,
                'created_at' => current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s', '%s', '%s' )
        );

        if ( ! $inserted ) {
            return new \WP_Error( 'db_insert_failed', 'Could not save message, database error.', array( 'status' => 500 ) );
        }

        // Send notification email to admin
        $admin_email = get_option( 'admin_email' );
        $subject     = 'New Headless Contact Submission';
        $email_body  = "You received a new submission:\n\n";
        $email_body .= "Name: {$name}\n";
        $email_body .= "Email: {$email}\n";
        $email_body .= "Message:\n{$message}\n";

        wp_mail( $admin_email, $subject, $email_body );

        return new \WP_REST_Response( array(
            'success' => true,
            'message' => 'Your message has been successfully received.'
        ), 200 );
    }
}

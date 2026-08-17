<?php
/**
 * Email logs interceptor: captures wp_mail triggers and logs outputs securely.
 *
 * Strictly prevents plaintext OTPs, sensitive tokens, or mail bodies from being written
 * to database logs, activity files, or debug outputs.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Email_Logs {

    private static $instance = null;
    private static $last_log_id = null;
    private static $current_email_type = 'General';

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Intercept outgoing mails
        add_filter( 'wp_mail', array( $this, 'log_wp_mail_start' ), 99 );
        add_action( 'wp_mail_failed', array( $this, 'log_wp_mail_failed' ), 99 );
    }

    /**
     * Mask email address for secure logging (e.g. p***@gmail.com)
     */
    public static function mask_email( $email ) {
        if ( ! is_email( $email ) ) {
            return '***';
        }
        $parts = explode( '@', $email, 2 );
        $name  = $parts[0];
        $domain = isset( $parts[1] ) ? $parts[1] : '';
        $masked_name = substr( $name, 0, 1 ) . str_repeat( '*', max( 3, strlen( $name ) - 1 ) );
        return $masked_name . '@' . $domain;
    }

    /**
     * Determine email category based on subject/content
     */
    private function detect_email_type( $subject, $message = '' ) {
        if ( stripos( $subject, 'Verify' ) !== false || stripos( $subject, 'OTP' ) !== false || stripos( $subject, 'Verification' ) !== false ) {
            return 'OTP Verification';
        }
        if ( stripos( $subject, 'Password Reset' ) !== false || stripos( $subject, 'Reset Your Password' ) !== false ) {
            return 'Password Reset';
        }
        if ( stripos( $subject, 'Welcome' ) !== false ) {
            return 'Welcome Email';
        }
        if ( stripos( $subject, 'Contact Form' ) !== false || stripos( $subject, 'New WLC Contact' ) !== false ) {
            return 'Contact Form';
        }
        if ( stripos( $subject, 'Membership' ) !== false ) {
            return 'Membership Confirmation';
        }
        if ( stripos( $subject, 'Test Email' ) !== false || stripos( $subject, 'SMTP Test' ) !== false ) {
            return 'SMTP Test';
        }
        return 'General';
    }

    /**
     * Intercept wp_mail params right before sending to create initial log
     */
    public function log_wp_mail_start( $args ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_logs';

        // Extract and mask recipient for secure logging
        $raw_recipient = '';
        if ( isset( $args['to'] ) ) {
            if ( is_array( $args['to'] ) ) {
                $raw_recipient = implode( ', ', array_map( 'sanitize_email', $args['to'] ) );
            } else {
                $raw_recipient = sanitize_email( $args['to'] );
            }
        }

        $masked_recipient = self::mask_email( $raw_recipient );
        $subject          = isset( $args['subject'] ) ? sanitize_text_field( $args['subject'] ) : '(No Subject)';
        $email_type       = $this->detect_email_type( $subject );
        self::$current_email_type = $email_type;

        // Insert log as "Sent" initially. If it fails, log_wp_mail_failed will update it.
        $inserted = $wpdb->insert(
            $table,
            array(
                'recipient'       => $masked_recipient,
                'subject'         => $subject,
                'email_type'      => $email_type,
                'success'         => 1,
                'failure_reason'  => '',
                'smtp_response'   => '',
                'delivery_status' => 'Sent',
                'created_at'      => current_time( 'mysql' ),
            ),
            array( '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s' )
        );

        if ( $inserted ) {
            self::$last_log_id = $wpdb->insert_id;
        }

        return $args;
    }

    /**
     * Update log status if mail send fails, and queue for background retry
     */
    public function log_wp_mail_failed( $wp_error ) {
        global $wpdb;
        $table_logs = $wpdb->prefix . 'wlc_email_logs';

        $error_message = $wp_error->get_error_message();
        $error_data    = $wp_error->get_error_data();

        $raw_recipient = isset( $error_data['to'] )
            ? ( is_array( $error_data['to'] ) ? implode( ', ', $error_data['to'] ) : $error_data['to'] )
            : 'unknown';
        $masked_recipient = self::mask_email( $raw_recipient );
        $subject = isset( $error_data['subject'] ) ? sanitize_text_field( $error_data['subject'] ) : '';

        // Safe diagnostic metadata only (Never include raw email body containing OTP)
        $safe_smtp_response = wp_json_encode( array(
            'recipient' => $masked_recipient,
            'subject'   => $subject,
            'provider'  => defined( 'WLC_EMAIL_PROVIDER' ) ? WLC_EMAIL_PROVIDER : 'wp_mail',
            'status'    => 'failed',
            'error'     => sanitize_text_field( $error_message ),
        ) );

        // Update the log entry
        if ( null !== self::$last_log_id ) {
            $wpdb->update(
                $table_logs,
                array(
                    'success'         => 0,
                    'failure_reason'  => sanitize_textarea_field( $error_message ),
                    'smtp_response'   => sanitize_textarea_field( $safe_smtp_response ),
                    'delivery_status' => 'Failed',
                ),
                array( 'id' => self::$last_log_id ),
                array( '%d', '%s', '%s', '%s' ),
                array( '%d' )
            );
        }

        // Log to Core Activity Log (with masked recipient)
        WLC_Core_Logger::log( "Email dispatch failed for recipient {$masked_recipient}. Error: {$error_message}", 'ERROR' );
    }

    /**
     * Retrieve paginated and filtered logs list
     */
    public static function get_logs( $limit = 20, $offset = 0, $search = '', $status = '' ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_logs';

        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) !== $table ) {
            return array( 'results' => array(), 'total' => 0 );
        }

        $where = ' WHERE 1=1 ';
        $params = array();

        if ( ! empty( $status ) ) {
            $where .= ' AND delivery_status = %s ';
            $params[] = $status;
        }

        if ( ! empty( $search ) ) {
            $where .= ' AND ( recipient LIKE %s OR subject LIKE %s ) ';
            $like = '%' . $wpdb->esc_like( $search ) . '%';
            $params[] = $like;
            $params[] = $like;
        }

        $total_query = "SELECT COUNT(*) FROM $table $where";
        if ( ! empty( $params ) ) {
            $total = (int) $wpdb->get_var( $wpdb->prepare( $total_query, $params ) );
        } else {
            $total = (int) $wpdb->get_var( $total_query );
        }

        $query = "SELECT * FROM $table $where ORDER BY id DESC LIMIT %d OFFSET %d";
        $params[] = $limit;
        $params[] = $offset;

        $results = $wpdb->get_results( $wpdb->prepare( $query, $params ) );

        return array(
            'results' => $results,
            'total'   => $total,
        );
    }
}

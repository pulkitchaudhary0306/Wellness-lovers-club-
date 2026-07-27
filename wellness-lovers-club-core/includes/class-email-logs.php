<?php
/**
 * Email logs interceptor: captures wp_mail triggers and logs outputs
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
     * Determine email category based on subject/content
     */
    private function detect_email_type( $subject, $message ) {
        if ( stripos( $subject, 'Verify Your Email' ) !== false || stripos( $subject, 'OTP' ) !== false && stripos( $subject, 'Verify' ) !== false ) {
            return 'OTP Verification';
        }
        if ( stripos( $subject, 'Password Reset' ) !== false ) {
            return 'Password Reset';
        }
        if ( stripos( $subject, 'Welcome to the Wellness Lovers Club' ) !== false ) {
            return 'Welcome Email';
        }
        if ( stripos( $subject, 'Contact Form' ) !== false || stripos( $subject, 'New WLC Contact' ) !== false ) {
            return 'Contact Form';
        }
        if ( stripos( $subject, 'Membership Status' ) !== false || stripos( $subject, 'Membership Confirmation' ) !== false ) {
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

        // Extract recipients
        $recipient = '';
        if ( isset( $args['to'] ) ) {
            if ( is_array( $args['to'] ) ) {
                $recipient = implode( ', ', array_map( 'sanitize_email', $args['to'] ) );
            } else {
                $recipient = sanitize_email( $args['to'] );
            }
        }

        $subject = isset( $args['subject'] ) ? sanitize_text_field( $args['subject'] ) : '(No Subject)';
        $message = isset( $args['message'] ) ? $args['message'] : '';
        
        $email_type = $this->detect_email_type( $subject, $message );
        self::$current_email_type = $email_type;

        // Insert log as "Sent" initially. If it fails, log_wp_mail_failed will update it.
        $inserted = $wpdb->insert(
            $table,
            array(
                'recipient'       => $recipient,
                'subject'         => $subject,
                'email_type'      => $email_type,
                'success'         => 1,
                'failure_reason'  => '',
                'smtp_response'   => '',
                'delivery_status' => 'Sent',
                'created_at'      => current_time( 'mysql' )
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
        $error_data = $wp_error->get_error_data();

        // Get debug logs if SMTP debug log is set
        global $wlc_smtp_debug_log;
        $smtp_response = isset( $wlc_smtp_debug_log ) ? $wlc_smtp_debug_log : '';
        
        if ( is_array( $error_data ) ) {
            $smtp_response .= "\nMail Data: " . wp_json_encode( $error_data );
        }

        // Update the log entry
        if ( null !== self::$last_log_id ) {
            $wpdb->update(
                $table_logs,
                array(
                    'success'         => 0,
                    'failure_reason'  => sanitize_textarea_field( $error_message ),
                    'smtp_response'   => sanitize_textarea_field( $smtp_response ),
                    'delivery_status' => 'Failed'
                ),
                array( 'id' => self::$last_log_id ),
                array( '%d', '%s', '%s', '%s' ),
                array( '%d' )
            );
        }

        // Queue this failed email automatically for background retry
        if ( is_array( $error_data ) ) {
            $recipient = isset( $error_data['to'] ) ? ( is_array( $error_data['to'] ) ? implode( ', ', $error_data['to'] ) : $error_data['to'] ) : '';
            $subject   = isset( $error_data['subject'] ) ? $error_data['subject'] : '';
            $message   = isset( $error_data['message'] ) ? $error_data['message'] : '';
            $headers   = isset( $error_data['headers'] ) ? ( is_array( $error_data['headers'] ) ? implode( "\n", $error_data['headers'] ) : $error_data['headers'] ) : '';

            if ( ! empty( $recipient ) && ! empty( $message ) ) {
                WLC_Core_Email_Queue::queue_email( $recipient, $subject, $message, $headers, self::$current_email_type );
            }
        }
        
        // Log to Core Activity Log
        WLC_Core_Logger::log( "Email failed sending to " . ( isset($recipient) ? $recipient : 'unknown' ) . ". Error: " . $error_message, 'ERROR' );
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

        $where = array( '1=1' );
        $params = array();

        if ( ! empty( $search ) ) {
            $where[] = "(recipient LIKE %s OR subject LIKE %s)";
            $params[] = '%' . $wpdb->esc_like( $search ) . '%';
            $params[] = '%' . $wpdb->esc_like( $search ) . '%';
        }

        if ( $status === 'success' ) {
            $where[] = "success = 1";
        } elseif ( $status === 'failed' ) {
            $where[] = "success = 0";
        }

        $where_clause = implode( ' AND ', $where );

        // Count Total
        if ( ! empty( $params ) ) {
            $total = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(id) FROM {$table} WHERE {$where_clause}", $params ) );
        } else {
            $total = $wpdb->get_var( "SELECT COUNT(id) FROM {$table} WHERE {$where_clause}" );
        }

        // Fetch Results
        $sql = "SELECT * FROM {$table} WHERE {$where_clause} ORDER BY id DESC LIMIT %d OFFSET %d";
        $params[] = $limit;
        $params[] = $offset;

        $results = $wpdb->get_results( $wpdb->prepare( $sql, $params ) );

        return array(
            'results' => $results,
            'total'   => intval( $total )
        );
    }

    /**
     * Delete a single log entry
     */
    public static function delete_log( $id ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_logs';
        return $wpdb->delete( $table, array( 'id' => intval( $id ) ), array( '%d' ) );
    }

    /**
     * Clear all logs
     */
    public static function clear_all_logs() {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_logs';
        return $wpdb->query( "TRUNCATE TABLE {$table}" );
    }

    /**
     * Retry sending a logged email
     */
    public static function retry_send( $id ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_logs';
        $log = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", intval( $id ) ) );

        if ( ! $log ) {
            return false;
        }

        // Temporary bypass headers and attachments, retry direct send
        // Since we don't store the full HTML body or headers in the logs, we check if the mail exists in the queue, or attempt a quick re-send with log parameters.
        // Wait, if it exists in the queue, we run the queue retry!
        $queued_item = $wpdb->get_row( $wpdb->prepare( "SELECT id FROM {$wpdb->prefix}wlc_email_queue WHERE recipient = %s AND subject = %s ORDER BY id DESC LIMIT 1", $log->recipient, $log->subject ) );
        
        if ( $queued_item ) {
            return WLC_Core_Email_Queue::process_item( $queued_item->id );
        }

        // Fallback retry using logged subject & recipient (Note: log doesn't store body, so we search if we can rebuild it or notify user)
        return false;
    }
}

<?php
/**
 * Background Email Queue and WP-Cron retry handler
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Email_Queue {

    private static $lock_transient = 'wlc_queue_lock';

    public static function init() {
        add_action( 'wlc_cron_send_queued_emails', array( __CLASS__, 'process_queue' ) );
    }

    /**
     * Add a mail to the queue
     */
    public static function queue_email( $recipient, $subject, $body, $headers = '', $email_type = 'General' ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_queue';

        // Check if identical pending item exists to prevent duplicate sends
        $duplicate = $wpdb->get_var( $wpdb->prepare(
            "SELECT id FROM {$table} WHERE recipient = %s AND subject = %s AND status = 'Pending' LIMIT 1",
            $recipient,
            $subject
        ) );

        if ( $duplicate ) {
            return $duplicate;
        }

        $inserted = $wpdb->insert(
            $table,
            array(
                'recipient'  => $recipient,
                'subject'    => $subject,
                'body'       => $body,
                'headers'    => is_array( $headers ) ? implode( "\n", $headers ) : $headers,
                'email_type' => $email_type,
                'attempts'   => 0,
                'status'     => 'Pending',
                'created_at' => current_time( 'mysql' )
            ),
            array( '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s' )
        );

        return $inserted ? $wpdb->insert_id : false;
    }

    /**
     * Process the queued emails (invoked by WP-Cron or manually)
     */
    public static function process_queue() {
        // Concurrency Lock: prevent multiple cron jobs running at the same time
        if ( get_transient( self::$lock_transient ) ) {
            return;
        }
        set_transient( self::$lock_transient, '1', 300 ); // lock for 5 minutes

        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_queue';

        // Fetch up to 10 emails to send per run to prevent timeout
        $items = $wpdb->get_results(
            "SELECT * FROM {$table} WHERE status IN ('Pending', 'Failed') AND attempts < 5 ORDER BY id ASC LIMIT 10"
        );

        if ( ! empty( $items ) ) {
            foreach ( $items as $item ) {
                self::process_item( $item->id );
            }
        }

        delete_transient( self::$lock_transient );
    }

    /**
     * Send a single queued email and update status
     */
    public static function process_item( $id ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_queue';

        $item = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", intval( $id ) ) );
        if ( ! $item ) {
            return false;
        }

        // Set status to Processing
        $wpdb->update( $table, array( 'status' => 'Processing', 'last_attempt' => current_time( 'mysql' ) ), array( 'id' => $item->id ) );

        // Setup headers
        $headers = ! empty( $item->headers ) ? explode( "\n", $item->headers ) : array();

        // Temperately disable logger loop (since we are resending a failed email, 
        // it will trigger log_wp_mail_start. We want to avoid adding a duplicate queue entry on failure)
        remove_action( 'wp_mail_failed', array( 'WLC_Core_Email_Logs', 'log_wp_mail_failed' ), 99 );

        // Resend
        $success = wp_mail( $item->recipient, $item->subject, $item->body, $headers );

        // Restore action hook
        add_action( 'wp_mail_failed', array( 'WLC_Core_Email_Logs', 'log_wp_mail_failed' ), 99 );

        // Update database item
        if ( $success ) {
            $wpdb->update(
                $table,
                array(
                    'status'   => 'Sent',
                    'attempts' => $item->attempts + 1
                ),
                array( 'id' => $item->id )
            );
            WLC_Core_Logger::log( "Queued email ID {$item->id} successfully sent to {$item->recipient}", 'INFO' );
            return true;
        } else {
            $wpdb->update(
                $table,
                array(
                    'status'   => 'Failed',
                    'attempts' => $item->attempts + 1
                ),
                array( 'id' => $item->id )
            );
            WLC_Core_Logger::log( "Queued email ID {$item->id} failed on retry to {$item->recipient}", 'WARNING' );
            return false;
        }
    }

    /**
     * Retrieve queued items count
     */
    public static function get_queue_count() {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_queue';
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) !== $table ) {
            return 0;
        }
        return intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table} WHERE status = 'Pending'" ) );
    }

    /**
     * Delete queue item
     */
    public static function delete_queue_item( $id ) {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_email_queue';
        return $wpdb->delete( $table, array( 'id' => intval( $id ) ), array( '%d' ) );
    }

    /**
     * Setup Cron Schedules
     */
    public static function register_cron() {
        if ( ! wp_next_scheduled( 'wlc_cron_send_queued_emails' ) ) {
            wp_schedule_event( time(), 'hourly', 'wlc_cron_send_queued_emails' );
        }
    }

    /**
     * Clear Cron Schedules
     */
    public static function clear_cron() {
        $timestamp = wp_next_scheduled( 'wlc_cron_send_queued_emails' );
        if ( $timestamp ) {
            wp_unschedule_event( $timestamp, 'wlc_cron_send_queued_emails' );
        }
    }
}

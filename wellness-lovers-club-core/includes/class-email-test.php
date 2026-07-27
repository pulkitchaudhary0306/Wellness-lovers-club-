<?php
/**
 * SMTP Diagnostics: sends HTML test emails and captures raw SMTP transmission logs
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Email_Test {

    /**
     * Send SMTP Test Email and return diagnostics report
     *
     * @param string $to_email Recipient email address
     * @return array Status report mapping success, message, and SMTP debug logs
     */
    public static function send_test_email( $to_email ) {
        if ( empty( $to_email ) || ! is_email( $to_email ) ) {
            return array(
                'success'   => false,
                'message'   => 'Enter a valid email address.',
                'debug_log' => ''
            );
        }

        // Initialize global debug log collector
        global $wlc_smtp_debug_log;
        $wlc_smtp_debug_log = '';

        // Force enable debug mode momentarily to capture logs
        $original_debug_mode = WLC_Core_Email_Settings::get( 'debug_mode' );
        // Override cached settings momentarily
        add_filter( 'option_wlc_smtp_settings', function( $settings ) {
            if ( is_array( $settings ) ) {
                $settings['debug_mode'] = '1';
            }
            return $settings;
        } );

        $subject = 'SMTP Test Email | Wellness Lovers Club Core';
        
        $body = '
        <h3>SMTP Test Connection Successful</h3>
        <p>This email confirms that your Wellness Lovers Club Core plugin SMTP connection has been configured correctly.</p>
        <p><strong>Configuration Diagnostics:</strong></p>
        <ul>
            <li><strong>SMTP Host:</strong> ' . esc_html( WLC_Core_Email_Settings::get( 'smtp_host' ) ) . '</li>
            <li><strong>SMTP Port:</strong> ' . esc_html( WLC_Core_Email_Settings::get( 'smtp_port' ) ) . '</li>
            <li><strong>Encryption:</strong> ' . esc_html( strtoupper( WLC_Core_Email_Settings::get( 'smtp_encryption' ) ) ) . '</li>
            <li><strong>Authentication:</strong> ' . ( WLC_Core_Email_Settings::get( 'smtp_auth' ) === '1' ? 'Enabled' : 'Disabled' ) . '</li>
            <li><strong>From Email:</strong> ' . esc_html( WLC_Core_Email_Settings::get( 'from_email' ) ) . '</li>
            <li><strong>From Name:</strong> ' . esc_html( WLC_Core_Email_Settings::get( 'from_name' ) ) . '</li>
        </ul>
        <p>This email has been formatted in HTML to test styling and responsiveness.</p>';

        $headers = array( 'Content-Type: text/html; charset=UTF-8' );

        // Wrap body in the standard template layout
        $html_message = '
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f6f9f8; color: #333333; margin: 0; padding: 0; }
                .email-wrapper { width: 100%; background-color: #f6f9f8; padding: 20px 0; }
                .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
                .email-header { background-color: #0d1410; padding: 30px; text-align: center; border-bottom: 3px solid #0f8554; }
                .email-header h1 { color: #ffffff; font-size: 24px; margin: 0; letter-spacing: 0.05em; font-weight: bold; }
                .email-content { padding: 40px 30px; line-height: 1.6; font-size: 14px; }
                .email-footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-container">
                    <div class="email-header">
                        <h1>WELLNESS LOVERS CLUB</h1>
                    </div>
                    <div class="email-content">
                        ' . $body . '
                    </div>
                    <div class="email-footer">
                        &copy; ' . date( 'Y' ) . ' Wellness Lovers Club. All rights reserved.
                    </div>
                </div>
            </div>
        </body>
        </html>';

        // Re-locate hooks momentarily to avoid adding a queue item on test failures
        remove_action( 'wp_mail_failed', array( 'WLC_Core_Email_Logs', 'log_wp_mail_failed' ), 99 );

        // Send
        $success = wp_mail( $to_email, $subject, $html_message, $headers );

        // Restore log hooks
        add_action( 'wp_mail_failed', array( 'WLC_Core_Email_Logs', 'log_wp_mail_failed' ), 99 );

        $debug_logs = $wlc_smtp_debug_log;

        if ( $success ) {
            return array(
                'success'   => true,
                'message'   => 'Test email sent successfully! Check your inbox.',
                'debug_log' => $debug_logs
            );
        } else {
            return array(
                'success'   => false,
                'message'   => 'Failed to send test email. Review the SMTP transmission logs below.',
                'debug_log' => $debug_logs ?: 'No debug log was captured. Verify your SMTP Host name and network settings.'
            );
        }
    }
}

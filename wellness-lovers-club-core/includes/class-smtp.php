<?php
/**
 * SMTP Engine: hooks into phpmailer_init to configure SMTP delivery
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Smtp {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Setup PHPMailer configuration hook
        add_action( 'phpmailer_init', array( $this, 'configure_phpmailer' ) );

        // Setup custom From Email and From Name filters
        add_filter( 'wp_mail_from', array( $this, 'override_from_email' ), 99 );
        add_filter( 'wp_mail_from_name', array( $this, 'override_from_name' ), 99 );
    }

    /**
     * Dynamically configure SMTP params on PHPMailer object
     */
    public function configure_phpmailer( $phpmailer ) {
        // Only configure if Host is specified (meaning SMTP is configured)
        $host = WLC_Core_Email_Settings::get( 'smtp_host' );
        if ( empty( $host ) ) {
            return;
        }

        // Configure Mailer settings
        $phpmailer->isSMTP();
        $phpmailer->Host       = $host;
        $phpmailer->Port       = intval( WLC_Core_Email_Settings::get( 'smtp_port', '587' ) );
        $phpmailer->Timeout    = intval( WLC_Core_Email_Settings::get( 'timeout', '10' ) );

        // Authentication
        $auth_enabled = WLC_Core_Email_Settings::get( 'smtp_auth' ) === '1';
        $phpmailer->SMTPAuth = $auth_enabled;
        if ( $auth_enabled ) {
            $phpmailer->Username = WLC_Core_Email_Settings::get( 'smtp_user' );
            $phpmailer->Password = WLC_Core_Email_Settings::get( 'smtp_pass' );
        }

        // Encryption
        $encryption = WLC_Core_Email_Settings::get( 'smtp_encryption', 'tls' );
        if ( $encryption === 'ssl' ) {
            $phpmailer->SMTPSecure = 'ssl';
        } elseif ( $encryption === 'tls' ) {
            $phpmailer->SMTPSecure = 'tls';
        } else {
            $phpmailer->SMTPSecure = '';
            // If encryption is disabled, prevent verification issues in some environments
            $phpmailer->SMTPAutoTLS = false;
        }

        // Reply-To header configuration
        $reply_to = WLC_Core_Email_Settings::get( 'reply_to_email' );
        if ( ! empty( $reply_to ) && is_email( $reply_to ) ) {
            $phpmailer->clearReplyToes();
            $phpmailer->addReplyTo( $reply_to );
        }

        // Debug mode log capturing (if debug mode is enabled, let PHPMailer save SMTP logs)
        if ( WLC_Core_Email_Settings::get( 'debug_mode' ) === '1' ) {
            $phpmailer->SMTPDebug = 2; // Client messages and server responses
            $phpmailer->Debugoutput = function( $str, $level ) {
                // Save logs to a transient/global or session so the test email callback can render them
                global $wlc_smtp_debug_log;
                if ( ! isset( $wlc_smtp_debug_log ) ) {
                    $wlc_smtp_debug_log = '';
                }
                $wlc_smtp_debug_log .= esc_html( $str ) . "\n";
            };
        }
    }

    /**
     * Override default WordPress From Email address
     */
    public function override_from_email( $original_email_address ) {
        $from_email = WLC_Core_Email_Settings::get( 'from_email' );
        if ( ! empty( $from_email ) && is_email( $from_email ) ) {
            return $from_email;
        }
        return $original_email_address;
    }

    /**
     * Override default WordPress From Name
     */
    public function override_from_name( $original_email_from ) {
        $from_name = WLC_Core_Email_Settings::get( 'from_name' );
        if ( ! empty( $from_name ) ) {
            return $from_name;
        }
        return $original_email_from;
    }
}

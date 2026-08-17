<?php
/**
 * Transactional Email Provider Service for Wellness Lovers Club
 *
 * Implements direct HTTPS REST API integration with Brevo (Sendinblue),
 * Resend, SendGrid, and Postmark with graceful fallback to standard wp_mail().
 *
 * All API keys are loaded securely from server configuration (wp-config.php)
 * and never logged or exposed in API responses.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Email_Service {

    /**
     * Get configured email provider name
     * ('brevo', 'resend', 'sendgrid', 'postmark', 'wp_mail')
     */
    public static function get_provider() {
        if ( defined( 'WLC_EMAIL_PROVIDER' ) && ! empty( WLC_EMAIL_PROVIDER ) ) {
            return strtolower( trim( WLC_EMAIL_PROVIDER ) );
        }
        // If Brevo key is configured, default to brevo
        if ( defined( 'WLC_BREVO_API_KEY' ) && ! empty( WLC_BREVO_API_KEY ) ) {
            return 'brevo';
        }
        return 'wp_mail';
    }

    /**
     * Get configured API key
     * Prioritizes WLC_BREVO_API_KEY, then WLC_EMAIL_API_KEY
     */
    public static function get_api_key() {
        if ( defined( 'WLC_BREVO_API_KEY' ) && ! empty( WLC_BREVO_API_KEY ) ) {
            return trim( WLC_BREVO_API_KEY );
        }
        if ( defined( 'WLC_EMAIL_API_KEY' ) && ! empty( WLC_EMAIL_API_KEY ) ) {
            return trim( WLC_EMAIL_API_KEY );
        }
        $env_key = getenv( 'WLC_BREVO_API_KEY' ) ?: getenv( 'WLC_EMAIL_API_KEY' );
        if ( ! empty( $env_key ) ) {
            return trim( $env_key );
        }
        return '';
    }

    /**
     * Get configured sender email
     */
    public static function get_from_email() {
        if ( defined( 'WLC_EMAIL_FROM' ) && is_email( WLC_EMAIL_FROM ) ) {
            return trim( WLC_EMAIL_FROM );
        }
        if ( defined( 'WLC_EMAIL_FROM_EMAIL' ) && is_email( WLC_EMAIL_FROM_EMAIL ) ) {
            return trim( WLC_EMAIL_FROM_EMAIL );
        }
        $env_from = getenv( 'WLC_EMAIL_FROM' ) ?: getenv( 'WLC_EMAIL_FROM_EMAIL' );
        if ( ! empty( $env_from ) && is_email( $env_from ) ) {
            return trim( $env_from );
        }
        return 'no-reply@wellnessloversclub.com';
    }

    /**
     * Get configured sender name
     */
    public static function get_from_name() {
        if ( defined( 'WLC_EMAIL_FROM_NAME' ) && ! empty( WLC_EMAIL_FROM_NAME ) ) {
            return trim( WLC_EMAIL_FROM_NAME );
        }
        $env_name = getenv( 'WLC_EMAIL_FROM_NAME' );
        if ( ! empty( $env_name ) ) {
            return trim( $env_name );
        }
        return 'Wellness Lovers Club';
    }

    /**
     * Dispatch an OTP verification email strictly via Brevo Transactional HTTPS API
     *
     * @param string $email Recipient email address
     * @param string $name Recipient display name
     * @param string $otp 6-digit verification code
     * @return bool
     */
    public static function send_otp_email( $email, $name, $otp ) {
        require_once WLC_CORE_PATH . 'includes/class-emails.php';
        return WLC_Core_Emails::send_verification_email( $email, $name, $otp );
    }

    /**
     * Send email directly via Brevo HTTPS REST API (Bypassing wp_mail / SMTP entirely)
     *
     * @param string $to
     * @param string $subject
     * @param string $html_body
     * @param string $recipient_name
     * @return array ['success' => bool, 'message' => string, 'provider' => 'brevo']
     */
    public static function send_brevo_direct( $to, $subject, $html_body, $recipient_name = '' ) {
        if ( empty( $to ) || ! is_email( $to ) ) {
            return array(
                'success'  => false,
                'message'  => 'Invalid recipient email address.',
                'provider' => 'brevo',
            );
        }

        $api_key    = self::get_api_key();
        $from_email = self::get_from_email();
        $from_name  = self::get_from_name();

        return self::send_via_brevo( $to, $subject, $html_body, $from_email, $from_name, $api_key, $recipient_name );
    }

    /**
     * Send an email through the active provider API
     *
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $html_body HTML formatted email body
     * @param string $recipient_name Optional recipient name
     * @return array ['success' => bool, 'message' => string, 'provider' => string, 'id' => string]
     */
    public static function send( $to, $subject, $html_body, $recipient_name = '' ) {
        if ( empty( $to ) || ! is_email( $to ) ) {
            return array(
                'success'  => false,
                'message'  => 'Invalid recipient email address.',
                'provider' => 'none',
            );
        }

        $provider   = self::get_provider();
        $api_key    = self::get_api_key();
        $from_email = self::get_from_email();
        $from_name  = self::get_from_name();

        switch ( $provider ) {
            case 'brevo':
            case 'sendinblue':
                return self::send_via_brevo( $to, $subject, $html_body, $from_email, $from_name, $api_key, $recipient_name );

            case 'resend':
                return self::send_via_resend( $to, $subject, $html_body, $from_email, $from_name, $api_key );

            case 'sendgrid':
                return self::send_via_sendgrid( $to, $subject, $html_body, $from_email, $from_name, $api_key );

            case 'postmark':
                return self::send_via_postmark( $to, $subject, $html_body, $from_email, $from_name, $api_key );

            case 'wp_mail':
            default:
                return self::send_via_wp_mail( $to, $subject, $html_body, $from_email, $from_name );
        }
    }

    /**
     * 1. Official Brevo / Sendinblue Transactional Email API (https://brevo.com)
     * HTTPS POST https://api.brevo.com/v3/smtp/email
     */
    private static function send_via_brevo( $to, $subject, $html_body, $from_email, $from_name, $api_key, $recipient_name = '' ) {
        $masked_to = WLC_Core_Email_Logs::mask_email( $to );
        WLC_Core_Logger::log( "[WLC EMAIL] Provider: brevo", 'INFO' );
        WLC_Core_Logger::log( "[WLC EMAIL] Starting Brevo request for recipient: {$masked_to}", 'INFO' );

        if ( empty( $api_key ) ) {
            WLC_Core_Logger::log( '[WLC EMAIL] Brevo API Key not configured. Falling back to wp_mail().', 'WARNING' );
            return self::send_via_wp_mail( $to, $subject, $html_body, $from_email, $from_name );
        }

        $recipient = array( 'email' => $to );
        if ( ! empty( $recipient_name ) ) {
            $recipient['name'] = $recipient_name;
        }

        $payload = array(
            'sender'      => array(
                'name'  => $from_name,
                'email' => $from_email,
            ),
            'to'          => array( $recipient ),
            'subject'     => $subject,
            'htmlContent' => $html_body,
        );

        $response = wp_remote_post( 'https://api.brevo.com/v3/smtp/email', array(
            'headers' => array(
                'api-key'      => $api_key,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ),
            'body'    => wp_json_encode( $payload ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            WLC_Core_Logger::log( '[WLC EMAIL] Brevo HTTP Connection Error: ' . $response->get_error_message(), 'ERROR' );
            return array(
                'success'   => false,
                'message'   => 'Network error connecting to Brevo email service.',
                'provider'  => 'brevo',
                'http_code' => 0,
            );
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $raw_body    = wp_remote_retrieve_body( $response );
        $body        = json_decode( $raw_body, true );

        WLC_Core_Logger::log( "[WLC EMAIL] HTTP status: {$status_code}", 'INFO' );

        // Brevo returns 201 Created on successful email queueing with {"messageId": "<...>"}
        if ( ( $status_code === 200 || $status_code === 201 ) && ! empty( $body['messageId'] ) ) {
            WLC_Core_Logger::log( "[WLC EMAIL] Brevo accepted message. ID: " . sanitize_text_field( $body['messageId'] ), 'INFO' );
            return array(
                'success'   => true,
                'message'   => 'Email accepted for delivery by Brevo API.',
                'provider'  => 'brevo',
                'id'        => $body['messageId'],
                'http_code' => $status_code,
            );
        }

        // Handle specific Brevo error statuses gracefully
        $error_detail = 'Brevo API rejected the request.';
        if ( ! empty( $body['message'] ) ) {
            $error_detail = $body['message'];
        } elseif ( ! empty( $body['error'] ) ) {
            $error_detail = $body['error'];
        }

        WLC_Core_Logger::log( "[WLC EMAIL] Brevo API Error [HTTP {$status_code}] for recipient {$masked_to}: {$error_detail}", 'ERROR' );

        return array(
            'success'   => false,
            'message'   => $error_detail,
            'provider'  => 'brevo',
            'http_code' => $status_code,
        );
    }

    /**
     * 2. Resend API (https://resend.com)
     * HTTPS POST https://api.resend.com/emails
     */
    private static function send_via_resend( $to, $subject, $html_body, $from_email, $from_name, $api_key ) {
        if ( empty( $api_key ) ) {
            return self::send_via_wp_mail( $to, $subject, $html_body, $from_email, $from_name );
        }

        $payload = array(
            'from'    => "{$from_name} <{$from_email}>",
            'to'      => array( $to ),
            'subject' => $subject,
            'html'    => $html_body,
        );

        $response = wp_remote_post( 'https://api.resend.com/emails', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $api_key,
                'Content-Type'  => 'application/json',
            ),
            'body'    => wp_json_encode( $payload ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array(
                'success'  => false,
                'message'  => $response->get_error_message(),
                'provider' => 'resend',
            );
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $status_code >= 200 && $status_code < 300 && ! empty( $body['id'] ) ) {
            return array(
                'success'  => true,
                'message'  => 'Email accepted for delivery by Resend API.',
                'provider' => 'resend',
                'id'       => $body['id'],
            );
        }

        $error_msg = isset( $body['message'] ) ? $body['message'] : 'Resend API rejected the request.';
        return array(
            'success'  => false,
            'message'  => $error_msg,
            'provider' => 'resend',
        );
    }

    /**
     * 3. SendGrid API
     * HTTPS POST https://api.sendgrid.com/v3/mail/send
     */
    private static function send_via_sendgrid( $to, $subject, $html_body, $from_email, $from_name, $api_key ) {
        if ( empty( $api_key ) ) {
            return self::send_via_wp_mail( $to, $subject, $html_body, $from_email, $from_name );
        }

        $payload = array(
            'personalizations' => array(
                array( 'to' => array( array( 'email' => $to ) ) ),
            ),
            'from'             => array( 'email' => $from_email, 'name' => $from_name ),
            'subject'          => $subject,
            'content'          => array(
                array( 'type' => 'text/html', 'value' => $html_body ),
            ),
        );

        $response = wp_remote_post( 'https://api.sendgrid.com/v3/mail/send', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $api_key,
                'Content-Type'  => 'application/json',
            ),
            'body'    => wp_json_encode( $payload ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array(
                'success'  => false,
                'message'  => $response->get_error_message(),
                'provider' => 'sendgrid',
            );
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        if ( $status_code >= 200 && $status_code < 300 ) {
            return array(
                'success'  => true,
                'message'  => 'Email accepted for delivery by SendGrid API.',
                'provider' => 'sendgrid',
            );
        }

        return array(
            'success'  => false,
            'message'  => "SendGrid API returned HTTP {$status_code}.",
            'provider' => 'sendgrid',
        );
    }

    /**
     * 4. Postmark API
     * HTTPS POST https://api.postmarkapp.com/email
     */
    private static function send_via_postmark( $to, $subject, $html_body, $from_email, $from_name, $api_key ) {
        if ( empty( $api_key ) ) {
            return self::send_via_wp_mail( $to, $subject, $html_body, $from_email, $from_name );
        }

        $payload = array(
            'From'          => "{$from_name} <{$from_email}>",
            'To'            => $to,
            'Subject'       => $subject,
            'HtmlBody'      => $html_body,
            'MessageStream' => 'outbound',
        );

        $response = wp_remote_post( 'https://api.postmarkapp.com/email', array(
            'headers' => array(
                'X-Postmark-Server-Token' => $api_key,
                'Content-Type'            => 'application/json',
                'Accept'                  => 'application/json',
            ),
            'body'    => wp_json_encode( $payload ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array(
                'success'  => false,
                'message'  => $response->get_error_message(),
                'provider' => 'postmark',
            );
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $status_code === 200 && ! empty( $body['MessageID'] ) ) {
            return array(
                'success'  => true,
                'message'  => 'Email accepted for delivery by Postmark API.',
                'provider' => 'postmark',
                'id'       => $body['MessageID'],
            );
        }

        $error_msg = isset( $body['Message'] ) ? $body['Message'] : 'Postmark API rejected the request.';
        return array(
            'success'  => false,
            'message'  => $error_msg,
            'provider' => 'postmark',
        );
    }

    /**
     * 5. Standard WordPress wp_mail() Delivery
     */
    private static function send_via_wp_mail( $to, $subject, $html_body, $from_email, $from_name ) {
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            "From: {$from_name} <{$from_email}>",
        );

        $last_error = null;
        $error_capture = function( $wp_error ) use ( &$last_error ) {
            if ( is_wp_error( $wp_error ) ) {
                $last_error = $wp_error->get_error_message();
            }
        };
        add_action( 'wp_mail_failed', $error_capture );

        $sent = wp_mail( $to, $subject, $html_body, $headers );

        remove_action( 'wp_mail_failed', $error_capture );

        if ( $sent ) {
            return array(
                'success'  => true,
                'message'  => 'Email accepted for delivery by standard wp_mail().',
                'provider' => 'wp_mail',
            );
        }

        $err_msg = $last_error ?: 'wp_mail() failed to dispatch the email. Check server mail configuration.';
        return array(
            'success'  => false,
            'message'  => $err_msg,
            'provider' => 'wp_mail',
        );
    }
}

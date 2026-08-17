<?php
/**
 * Brevo HTTPS Transactional Email Service
 *
 * Exclusively calls the official Brevo HTTPS REST API (https://api.brevo.com/v3/smtp/email)
 * using wp_remote_post().
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Brevo_Email {

    const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

    /**
     * Get Brevo API key from wp-config.php constant
     */
    public static function get_api_key() {
        if ( defined( 'WLC_BREVO_API_KEY' ) && ! empty( WLC_BREVO_API_KEY ) ) {
            return trim( (string) WLC_BREVO_API_KEY );
        }
        return '';
    }

    /**
     * Get Sender Email
     */
    public static function get_from_email() {
        if ( defined( 'WLC_OTP_FROM_EMAIL' ) && is_email( WLC_OTP_FROM_EMAIL ) ) {
            return trim( WLC_OTP_FROM_EMAIL );
        }
        if ( defined( 'WLC_EMAIL_FROM' ) && is_email( WLC_EMAIL_FROM ) ) {
            return trim( WLC_EMAIL_FROM );
        }
        return 'no-reply@wellnessloversclub.com';
    }

    /**
     * Get Sender Name
     */
    public static function get_from_name() {
        if ( defined( 'WLC_OTP_FROM_NAME' ) && ! empty( WLC_OTP_FROM_NAME ) ) {
            return trim( WLC_OTP_FROM_NAME );
        }
        if ( defined( 'WLC_EMAIL_FROM_NAME' ) && ! empty( WLC_EMAIL_FROM_NAME ) ) {
            return trim( WLC_EMAIL_FROM_NAME );
        }
        return 'Wellness Lovers Club';
    }

    /**
     * Get OTP expiration minutes
     */
    public static function get_expiration_minutes() {
        if ( defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ) {
            return max( 1, intval( WLC_OTP_EXPIRATION_MINUTES ) );
        }
        return 10;
    }

    /**
     * Safely mask recipient email for logs (e.g. pulkit@gmail.com -> p***@gmail.com)
     */
    public static function mask_email( $email ) {
        $parts = explode( '@', $email );
        if ( count( $parts ) !== 2 ) {
            return '***';
        }
        $user   = $parts[0];
        $domain = $parts[1];
        $len    = strlen( $user );
        if ( $len <= 2 ) {
            return substr( $user, 0, 1 ) . '***@' . $domain;
        }
        return substr( $user, 0, 1 ) . str_repeat( '*', min( 3, $len - 2 ) ) . substr( $user, -1 ) . '@' . $domain;
    }

    /**
     * Dispatch OTP Email directly via Brevo HTTPS REST API
     *
     * @param string $recipient_email Recipient email address
     * @param string $recipient_name  Recipient full name
     * @param string $otp             Plaintext 6-digit OTP code (used only in request payload)
     * @return array Status array ['success' => bool, 'message_id' => string, 'error' => string]
     */
    public static function send_otp( $recipient_email, $recipient_name, $otp ) {
        $api_key = self::get_api_key();

        if ( empty( $api_key ) ) {
            error_log( '[WLC Brevo] Configuration Error: WLC_BREVO_API_KEY is not defined in wp-config.php.' );
            return array(
                'success' => false,
                'code'    => 'missing_api_key',
                'error'   => 'Email delivery provider is not configured.',
            );
        }

        $from_email   = self::get_from_email();
        $from_name    = self::get_from_name();
        $expiry_mins  = self::get_expiration_minutes();
        $name_display = ! empty( $recipient_name ) ? sanitize_text_field( $recipient_name ) : 'Valued Member';
        $subject      = 'Verify Your Email | Wellness Lovers Club';

        // Build HTML template
        $html_content = self::build_html_template( $name_display, $otp, $expiry_mins );
        $text_content = "Hello {$name_display},\n\n"
                      . "Thank you for registering with Wellness Lovers Club.\n\n"
                      . "Your verification code is: {$otp}\n\n"
                      . "This code expires in {$expiry_mins} minutes.\n\n"
                      . "If you did not request this code, please ignore this email.\n\n"
                      . "Regards,\nWellness Lovers Club";

        $payload = array(
            'sender'      => array(
                'name'  => $from_name,
                'email' => $from_email,
            ),
            'to'          => array(
                array(
                    'email' => $recipient_email,
                    'name'  => $name_display,
                ),
            ),
            'subject'     => $subject,
            'htmlContent' => $html_content,
            'textContent' => $text_content,
        );

        $response = wp_remote_post( self::BREVO_ENDPOINT, array(
            'headers' => array(
                'api-key'      => $api_key,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ),
            'body'    => wp_json_encode( $payload ),
            'method'  => 'POST',
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            $err_message = $response->get_error_message();
            error_log( sprintf(
                '[WLC Brevo] Network Error: %s | Recipient: %s',
                $err_message,
                self::mask_email( $recipient_email )
            ) );
            return array(
                'success' => false,
                'error'   => 'Network error connecting to Brevo API.',
            );
        }

        $http_code = wp_remote_retrieve_response_code( $response );
        $body_raw  = wp_remote_retrieve_body( $response );
        $data      = json_decode( $body_raw, true );

        // Brevo returns HTTP 201 Created or 200 OK on success
        if ( $http_code === 201 || $http_code === 200 ) {
            $message_id = isset( $data['messageId'] ) ? $data['messageId'] : 'N/A';
            error_log( sprintf(
                '[WLC Brevo] Success | Recipient: %s | HTTP: %d | MessageID: %s',
                self::mask_email( $recipient_email ),
                $http_code,
                $message_id
            ) );
            return array(
                'success'    => true,
                'message_id' => $message_id,
            );
        }

        // Handle Brevo rejection / validation failure
        $brevo_code = isset( $data['code'] ) ? $data['code'] : 'unknown_error';
        $brevo_msg  = isset( $data['message'] ) ? $data['message'] : 'Brevo delivery failed';

        error_log( sprintf(
            '[WLC Brevo] Delivery Rejected | Recipient: %s | HTTP: %d | Code: %s | Message: %s',
            self::mask_email( $recipient_email ),
            $http_code,
            $brevo_code,
            $brevo_msg
        ) );

        return array(
            'success' => false,
            'error'   => $brevo_msg,
            'code'    => $brevo_code,
        );
    }

    /**
     * Build branded responsive HTML email
     */
    private static function build_html_template( $name, $otp, $expiry_minutes ) {
        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email | Wellness Lovers Club</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f0; font-family: \'Montserrat\', Arial, sans-serif; color: #373737;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f5f0; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" max-width="560px" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.06); border: 1px solid #ebdcb9;">
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #0d563f 0%, #06281e 100%); padding: 36px 20px; border-bottom: 3px solid #bca374;">
                            <div style="font-family: Georgia, \'Times New Roman\', serif; font-size: 22px; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase;">
                                Wellness Lovers Club
                            </div>
                            <div style="font-size: 10.5px; color: #bca374; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 6px;">
                                Conscious Living &amp; Wellbeing
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 32px 30px 32px;">
                            <p style="font-size: 16px; line-height: 1.6; color: #2e3a33; margin: 0 0 16px 0;">
                                Hello <strong>' . esc_html( $name ) . '</strong>,
                            </p>
                            <p style="font-size: 14.5px; line-height: 1.7; color: #555555; margin: 0 0 24px 0;">
                                Thank you for registering with <strong>Wellness Lovers Club</strong>. To activate your account and verify your email address, please use the following one-time verification code:
                            </p>
                            <div style="text-align: center; margin: 30px 0; padding: 22px 15px; background-color: #fdfbf7; border: 1.5px dashed #bca374; border-radius: 10px;">
                                <div style="font-size: 11px; letter-spacing: 0.2em; color: #857049; text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">
                                    Your 6-Digit Verification Code
                                </div>
                                <div style="font-family: \'Courier New\', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 0.25em; color: #0d563f;">
                                    ' . esc_html( $otp ) . '
                                </div>
                                <div style="font-size: 12px; color: #777777; margin-top: 8px;">
                                    This code is valid for <strong>' . intval( $expiry_minutes ) . ' minutes</strong>.
                                </div>
                            </div>
                            <p style="font-size: 13.5px; line-height: 1.6; color: #777777; margin: 0 0 20px 0;">
                                If you did not initiate this request, please ignore this email. Your account will remain secure.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #faf8f5; padding: 24px 32px; border-top: 1px solid #ebdcb9; text-align: center;">
                            <p style="font-size: 12.5px; color: #666666; margin: 0 0 4px 0; font-weight: 500;">
                                Regards,<br>
                                <strong style="color: #0d563f;">Wellness Lovers Club Concierge</strong>
                            </p>
                            <p style="font-size: 11px; color: #999999; margin: 12px 0 0 0;">
                                &copy; ' . date( 'Y' ) . ' Wellness Lovers Club. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
    }
}

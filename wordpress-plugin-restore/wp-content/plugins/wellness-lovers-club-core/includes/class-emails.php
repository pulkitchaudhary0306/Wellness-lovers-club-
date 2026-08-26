<?php
/**
 * Consolidated email dispatch service with professional HTML templates
 * for Wellness Lovers Club backend.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once dirname( __FILE__ ) . '/class-logger.php';

class WLC_Core_Emails {

    /**
     * Common layout wrapper for HTML emails
     */
    private static function wrap_html_template( $title, $body_content ) {
        $year = date( 'Y' );
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>' . esc_html( $title ) . '</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #080c09; color: #e2e8f0; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
                .email-wrapper { width: 100%; background-color: #080c09; padding: 40px 0; }
                .email-container { max-width: 600px; margin: 0 auto; background-color: #0f1712; border-radius: 16px; border: 1px solid #1e2e23; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
                .email-header { background: linear-gradient(180deg, #132219 0%, #0f1712 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #0f8554; }
                .email-header .logo-title { color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
                .email-header .logo-sub { color: #0f8554; font-size: 11px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 6px; }
                .email-content { padding: 36px 32px; line-height: 1.7; font-size: 15px; color: #cbd5e1; }
                .email-content h2 { color: #ffffff; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px; }
                .email-content p { margin-top: 0; margin-bottom: 16px; }
                .otp-card { background: rgba(15, 133, 84, 0.08); border: 1px dashed #0f8554; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
                .otp-code { font-size: 32px; font-weight: 800; color: #22c55e; letter-spacing: 0.3em; font-family: monospace; }
                .btn { display: inline-block; background-color: #0f8554; color: #ffffff !important; font-weight: 600; font-size: 14px; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-top: 10px; box-shadow: 0 4px 12px rgba(15, 133, 84, 0.3); }
                .email-footer { background-color: #090e0b; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #16241b; }
                .email-footer a { color: #0f8554; text-decoration: none; }
                .highlight-box { background-color: #14221a; border-left: 3px solid #0f8554; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-container">
                    <div class="email-header">
                        <div class="logo-title">WELLNESS LOVERS CLUB</div>
                        <div class="logo-sub">LONGEVITY & SANCTUARY PRIVILEGES</div>
                    </div>
                    <div class="email-content">
                        ' . $body_content . '
                    </div>
                    <div class="email-footer">
                        &copy; ' . $year . ' Wellness Lovers Club. All rights reserved.<br>
                        324 Star Tower, 3rd Floor, Sector 30, Gurgaon, Haryana, 122002<br>
                        This is an automated system email. Please do not reply directly to this email.
                    </div>
                </div>
            </div>
        </body>
        </html>';
    }

    /**
     * Send email directly via Brevo HTTPS REST API (Bypassing wp_mail & SMTP entirely)
     *
     * @param string $to            Recipient email address
     * @param string $subject       Email subject line
     * @param string $html_message  Full HTML formatted email content
     * @return true|WP_Error
     */
    private static function send_brevo_email( $to, $subject, $html_message ) {
        if ( ! defined( 'WLC_BREVO_API_KEY' ) || empty( WLC_BREVO_API_KEY ) ) {
            return new WP_Error( 'missing_api_key', 'Brevo API key is not configured.' );
        }

        $sender_name  = defined( 'WLC_OTP_FROM_NAME' ) ? WLC_OTP_FROM_NAME : 'Wellness Lovers Club';
        $sender_email = defined( 'WLC_OTP_FROM_EMAIL' ) ? WLC_OTP_FROM_EMAIL : 'no-reply@wellnessloversclub.com';

        $payload = array(
            'sender'      => array(
                'name'  => $sender_name,
                'email' => $sender_email,
            ),
            'to'          => array(
                array(
                    'email' => $to,
                ),
            ),
            'subject'     => $subject,
            'htmlContent' => $html_message,
        );

        $response = wp_remote_post( 'https://api.brevo.com/v3/smtp/email', array(
            'headers' => array(
                'api-key'      => WLC_BREVO_API_KEY,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ),
            'body'    => wp_json_encode( $payload ),
            'method'  => 'POST',
            'timeout' => 20,
        ) );

        if ( is_wp_error( $response ) ) {
            $err_msg = $response->get_error_message();
            error_log( 'WLC-CORE: Brevo email network error: ' . $err_msg );
            return new WP_Error( 'email_send_failed', 'Brevo network error: ' . $err_msg );
        }

        $http_code = wp_remote_retrieve_response_code( $response );
        if ( $http_code === 201 || $http_code === 200 ) {
            error_log( 'WLC-CORE: Brevo email sent successfully' );
            return true;
        }

        error_log( 'WLC-CORE: Brevo email failed. HTTP status: ' . $http_code );
        return new WP_Error( 'email_send_failed', 'Brevo HTTP ' . $http_code );
    }

    /**
     * Helper to send HTML emails via Brevo HTTPS API
     */
    public static function send_html_email( $to, $subject, $body_content ) {
        if ( empty( $to ) || ! is_email( $to ) ) {
            return false;
        }

        $html_message = self::wrap_html_template( $subject, $body_content );
        $result       = self::send_brevo_email( $to, $subject, $html_message );

        if ( is_wp_error( $result ) ) {
            return false;
        }

        return true;
    }

    /**
     * 1. Welcome Email
     */
    public static function send_welcome_email( $to, $name = '' ) {
        $subject      = 'Welcome to the Wellness Lovers Club by GlobalSpa';
        $frontend_url = defined( 'WLC_FRONTEND_URL' ) ? WLC_FRONTEND_URL : ( get_option( 'wlc_frontend_url' ) ?: 'https://wellnessloversclub.com' );
        $login_url    = rtrim( $frontend_url, '/' ) . '/login';
        $greeting     = ! empty( $name ) ? 'Dear ' . esc_html( $name ) . ',' : 'Dear Customer,';

        $body = '
        <h2>Welcome to the Wellness Lovers Club</h2>
        <p>' . $greeting . '</p>
        <p>Thank you for joining the <strong>Wellness Lovers Club by GlobalSpa</strong>.</p>
        <p>We’re delighted to welcome you to our community and look forward to bringing you meaningful wellness experiences, exclusive opportunities and curated moments that inspire you to live well.</p>
        <p>Your registration has been successfully received.</p>
        <div style="text-align: center; margin-top: 28px; margin-bottom: 20px;">
            <a href="' . esc_url( $login_url ) . '" class="btn">Login to Your Account</a>
        </div>
        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 16px;">
            Website Login Page: <a href="' . esc_url( $login_url ) . '" style="color: #0f8554; text-decoration: underline;">' . esc_html( $login_url ) . '</a>
        </p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * 2. Verify Email — OTP-only (via Brevo HTTPS API)
     *
     * Subject: Verify Your Email | Wellness Lovers Club
     */
    public static function send_verification_email( $to, $name, $otp ) {
        if ( ! defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ) {
            define( 'WLC_OTP_EXPIRATION_MINUTES', 10 );
        }

        $subject     = 'Verify Your Email | Wellness Lovers Club';
        $safe_name   = ! empty( $name ) ? $name : 'Member';
        $expiry_mins = intval( WLC_OTP_EXPIRATION_MINUTES );

        $body = '
        <h2>Verify Your Email</h2>
        <p>Hello <strong>' . esc_html( $safe_name ) . '</strong>,</p>
        <p>Thank you for registering with <strong>Wellness Lovers Club</strong>.</p>
        <p>Your verification code is:</p>
        <div class="otp-card">
            <div class="otp-code">' . esc_html( $otp ) . '</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 10px;">This code is valid for <strong style="color: #22c55e;">' . $expiry_mins . ' minutes</strong>.</div>
        </div>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 20px;">If you did not request this verification, please ignore this email.</p>
        <p style="font-size: 13px; color: #94a3b8;">Regards,<br><strong style="color: #e2e8f0;">Wellness Lovers Club</strong></p>';

        $html_message = self::wrap_html_template( $subject, $body );
        $res          = self::send_brevo_email( $to, $subject, $html_message );

        if ( is_wp_error( $res ) ) {
            $masked_to = WLC_Core_Email_Logs::mask_email( $to );
            WLC_Core_Logger::log( "[WLC OTP] Brevo delivery failed for {$masked_to}: " . $res->get_error_message(), 'ERROR' );
            return false;
        }

        $masked_to = WLC_Core_Email_Logs::mask_email( $to );
        WLC_Core_Logger::log( "[WLC OTP] Verification email dispatched via Brevo HTTPS API to {$masked_to}", 'INFO' );
        return true;
    }

    /**
     * 3. Forgot Password Email (Reset Link + OTP)
     */
    public static function send_password_reset_email( $to, $name = 'Member', $reset_url = '' ) {
        if ( ! defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ) {
            define( 'WLC_OTP_EXPIRATION_MINUTES', 10 );
        }
        $expiry_mins = intval( WLC_OTP_EXPIRATION_MINUTES );

        $subject = 'Reset Your Password | Wellness Lovers Club';
        $body = '
        <h2>Reset Your Password</h2>
        <p>Hello <strong>' . esc_html( $name ) . '</strong>,</p>
        <p>We received a request to reset the password for your Wellness Lovers Club account.</p>
        <p>Use the secure link below to set a new password. The link expires in ' . $expiry_mins . ' minutes.</p>';

        if ( ! empty( $reset_url ) ) {
            $body .= '
        <div style="text-align: center; margin: 24px 0;">
            <a href="' . esc_url( $reset_url ) . '" class="btn">Reset Password</a>
        </div>';
        }

        $body .= '
        <p style="font-size: 13px; color: #94a3b8;">If you did not request a password reset, please secure your email account immediately.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * 4. Password Reset Successful Email
     */
    public static function send_password_reset_success_email( $to, $name = 'Member' ) {
        $subject = 'Password Changed Successfully | Wellness Lovers Club';
        $login_url = home_url( '/login' );
        $body = '
        <h2>Password Changed Successfully</h2>
        <p>Hello ' . esc_html( $name ) . ',</p>
        <p>This email confirms that the password for your Wellness Lovers Club account was recently changed.</p>
        <div class="highlight-box">
            If you made this change, no further action is required. You can now log in using your new credentials.
        </div>
        <div style="text-align: center; margin-top: 24px;">
            <a href="' . esc_url( $login_url ) . '" class="btn">Sign In to Account</a>
        </div>
        <p style="font-size: 13px; color: #ef4444; margin-top: 20px;">If you did NOT authorize this password change, please contact support immediately at <a href="mailto:wellnessloversclub@gmail.com" style="color: #ef4444; text-decoration: underline;">wellnessloversclub@gmail.com</a>.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * 5. OTP Verification Email
     */
    public static function send_verification_otp( $to, $name, $otp ) {
        if ( ! defined( 'WLC_OTP_EXPIRATION_MINUTES' ) ) {
            define( 'WLC_OTP_EXPIRATION_MINUTES', 10 );
        }
        $expiry_mins = intval( WLC_OTP_EXPIRATION_MINUTES );

        $subject = 'Your Security Verification Code | Wellness Lovers Club';
        $body = '
        <h2>Verification Code</h2>
        <p>Hello ' . esc_html( $name ) . ',</p>
        <p>Please enter the 6-digit One-Time Password (OTP) below to verify your action:</p>
        <div class="otp-card">
            <div class="otp-code">' . esc_html( $otp ) . '</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Valid for ' . $expiry_mins . ' minutes</div>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">Never share your verification code with anyone.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * 6. Contact Form Auto Reply Email
     */
    public static function send_contact_auto_reply( $to, $name ) {
        $subject = 'We Received Your Message | Wellness Lovers Club';
        $body = '
        <h2>Thank You for Reaching Out, ' . esc_html( $name ) . '</h2>
        <p>We have received your message and inquiry. A Wellness Lovers Club concierge representative will review your request and get back to you shortly.</p>
        <div class="highlight-box">
            <strong>Need urgent assistance?</strong><br>
            Feel free to email our team directly at <a href="mailto:wellnessloversclub@gmail.com" style="color: #0f8554;">wellnessloversclub@gmail.com</a>.
        </div>
        <p>Thank you for choosing Wellness Lovers Club.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * Admin Notification for Contact Form
     */
    public static function send_contact_notification( $contact_data ) {
        $admin_email = WLC_Core_Email_Settings::get( 'from_email' ) ?: get_option( 'admin_email' );
        $subject = 'New Contact Form Submission | Wellness Lovers Club';
        $body = '
        <h2>New Inquiry Received</h2>
        <p>A new contact form submission has been received from the website:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; color: #cbd5e1;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23;">' . esc_html( $contact_data['first_name'] . ' ' . $contact_data['last_name'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23;">' . esc_html( $contact_data['email'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23;">' . esc_html( $contact_data['phone'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23;">' . esc_html( $contact_data['subject'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 10px; border-bottom: 1px solid #1e2e23; white-space: pre-wrap;">' . esc_html( $contact_data['message'] ) . '</td>
            </tr>
        </table>';

        return self::send_html_email( $admin_email, $subject, $body );
    }

    /**
     * 7. Security Notification Email
     */
    public static function send_security_notification( $to, $event_title, $event_description ) {
        $subject = 'Security Alert: ' . $event_title . ' | Wellness Lovers Club';
        $body = '
        <h2>Security Notification</h2>
        <p><strong>' . esc_html( $event_title ) . '</strong></p>
        <div class="highlight-box">
            ' . esc_html( $event_description ) . '
        </div>
        <p style="font-size: 13px; color: #94a3b8;">If you performed this action, no further steps are required. If you did not authorize this, please contact our support immediately.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * 8. VIP Membership Activation & Thank You Email
     */
    public static function send_membership_activation_email( $to, $membership_data = array() ) {
        $name = isset( $membership_data['name'] ) && ! empty( $membership_data['name'] ) ? $membership_data['name'] : 'Customer';

        $subject = 'Thank you for joining the Wellness Lovers Club by GlobalSpa';

        $body = '
        <p style="font-size: 15px; color: #ffffff; margin-bottom: 16px;">Dear ' . esc_html( $name ) . ',</p>
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 16px;">
            Thank you for joining the <strong>Wellness Lovers Club by GlobalSpa</strong>.
        </p>
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 16px;">
            We’re delighted to welcome you to our community and look forward to bringing you meaningful wellness experiences, exclusive opportunities and curated moments that inspire you to live well.
        </p>
        <div style="background: rgba(15, 133, 84, 0.12); border-left: 3px solid #0f8554; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 20px 0; color: #4ade80; font-weight: 600; font-size: 14px;">
            Your registration has been successfully received.
        </div>
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 12px;">
            To help us process your tax invoice, kindly share the below with us:
        </p>
        <ul style="color: #cbd5e1; font-size: 14.5px; line-height: 1.8; margin: 0 0 18px 0; padding-left: 24px;">
            <li><strong>Billing details with GST (if applicable)</strong></li>
        </ul>
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 24px;">
            Once we receive these details, we will share your tax invoice with you.
        </p>
        <p style="font-size: 15px; color: #ffffff; line-height: 1.6; margin-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 18px;">
            Warm regards,<br>
            <strong style="color: #bca374;">Team Wellness Lovers Club</strong>
        </p>';

        return self::send_html_email( $to, $subject, $body );
    }
}

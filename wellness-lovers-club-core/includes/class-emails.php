<?php
/**
 * Consolidated email dispatch service
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Emails {

    /**
     * Send email with HTML support
     */
    private static function send_html_email( $to, $subject, $message_body ) {
        $headers = array( 'Content-Type: text/html; charset=UTF-8' );
        
        // Wrap content in a beautiful email layout
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
                .otp-box { display: inline-block; background-color: #f0fdf4; border: 1px dashed #0f8554; color: #0f8554; font-size: 24px; font-weight: bold; padding: 15px 30px; border-radius: 8px; margin: 20px 0; letter-spacing: 0.1em; }
                .btn { display: inline-block; background-color: #0f8554; color: #ffffff !important; font-weight: bold; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-container">
                    <div class="email-header">
                        <h1>WELLNESS LOVERS CLUB</h1>
                    </div>
                    <div class="email-content">
                        ' . $message_body . '
                    </div>
                    <div class="email-footer">
                        &copy; ' . date( 'Y' ) . ' Wellness Lovers Club. All rights reserved.<br>
                        This is an automated system email. Please do not reply directly to this address.
                    </div>
                </div>
            </div>
        </body>
        </html>';

        return wp_mail( $to, $subject, $html_message, $headers );
    }

    /**
     * Send Verification OTP Email during registration
     */
    public static function send_verification_otp( $to, $name, $otp ) {
        $subject = 'Verify Your Email | Wellness Lovers Club';
        $body = '
        <h3>Hello ' . esc_html( $name ) . ',</h3>
        <p>Thank you for registering with the Wellness Lovers Club. Please verify your email address to activate your account and start your longevity journey.</p>
        <p>Use the following 6-digit One-Time Password (OTP) on the verification page:</p>
        <div style="text-align: center;">
            <div class="otp-box">' . esc_html( $otp ) . '</div>
        </div>
        <p>This verification code is valid for 15 minutes. If you did not request this verification, please ignore this email.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * Send Welcome Email upon successful activation
     */
    public static function send_welcome_email( $to, $name ) {
        $subject = 'Welcome to the Wellness Lovers Club!';
        $body = '
        <h3>Welcome ' . esc_html( $name ) . ',</h3>
        <p>We are delighted to confirm that your email address has been verified, and your <strong>Lotus Club</strong> membership profile is now fully active.</p>
        <p>You can now log in to the Member Portal to:</p>
        <ul>
            <li>Explore curated longevity guides and journals.</li>
            <li>Request bookings at partner wellness sanctuaries and spas.</li>
            <li>Receive members-only exclusive benefits and upgrades.</li>
        </ul>
        <div style="text-align: center; margin-top: 25px;">
            <a href="' . esc_url( home_url( '/login' ) ) . '" class="btn">Access Member Portal</a>
        </div>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * Send Password Reset OTP
     */
    public static function send_password_reset_otp( $to, $otp, $reset_url ) {
        $subject = 'Password Reset OTP | Wellness Lovers Club';
        $body = '
        <h3>Hello,</h3>
        <p>We received a request to reset the password for your Wellness Lovers Club account.</p>
        <p>Enter the 6-digit verification code below to confirm your identity:</p>
        <div style="text-align: center;">
            <div class="otp-box">' . esc_html( $otp ) . '</div>
        </div>
        <p>Alternatively, you can complete the password reset directly by clicking the button below:</p>
        <div style="text-align: center; margin-top: 20px;">
            <a href="' . esc_url( $reset_url ) . '" class="btn">Reset Password</a>
        </div>
        <p>This verification code is valid for 15 minutes. If you did not make this request, please secure your account credentials.</p>';

        return self::send_html_email( $to, $subject, $body );
    }

    /**
     * Send Contact Notification Email to Admin
     */
    public static function send_contact_notification( $contact_data ) {
        $admin_email = get_option( 'admin_email' );
        $subject = 'New WLC Contact Form Submission';
        $body = '
        <h3>New Query Submitted</h3>
        <p>A new contact form submission has been received from the Headless front-end:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' . esc_html( $contact_data['first_name'] . ' ' . $contact_data['last_name'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' . esc_html( $contact_data['email'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' . esc_html( $contact_data['phone'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Subject:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">' . esc_html( $contact_data['subject'] ) . '</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; white-space: pre-wrap;">' . esc_html( $contact_data['message'] ) . '</td>
            </tr>
        </table>
        <div style="margin-top: 25px; text-align: center;">
            <a href="' . esc_url( admin_url( 'admin.php?page=wlc-contacts' ) ) . '" class="btn">View in WordPress Admin</a>
        </div>';

        return self::send_html_email( $admin_email, $subject, $body );
    }

    /**
     * Send Membership Confirmation to Admin / User (Optional placeholder or notification)
     */
    public static function send_membership_confirmation( $to, $name, $tier ) {
        $subject = 'Membership Status Confirmation | Wellness Lovers Club';
        $body = '
        <h3>Hello ' . esc_html( $name ) . ',</h3>
        <p>Your membership application for the <strong>' . esc_html( $tier ) . '</strong> tier has been successfully submitted and is under review.</p>
        <p>Our wellness concierge team will review your application credentials and activate your profile privileges shortly. You will receive an activation email as soon as the review is complete.</p>
        <p>Thank you for choosing the Wellness Lovers Club.</p>';

        return self::send_html_email( $to, $subject, $body );
    }
}

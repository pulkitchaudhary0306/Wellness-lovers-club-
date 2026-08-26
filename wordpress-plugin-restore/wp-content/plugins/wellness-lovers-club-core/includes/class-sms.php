<?php
/**
 * SMS Gateway Dispatcher for Wellness Lovers Club
 *
 * Provider-agnostic SMS Service supporting:
 *  - 2Factor (India +91 transactional OTP)
 *  - MSG91 (India +91 DLT compliant)
 *  - Fast2SMS (India +91 Quick OTP)
 *  - Twilio (Global SMS)
 *  - Development Logger (Local/Staging test simulation)
 *
 * Configuration via wp-config.php constants or environment variables:
 *  - WLC_SMS_PROVIDER     ('2factor' | 'msg91' | 'fast2sms' | 'twilio' | 'logger')
 *  - WLC_SMS_API_KEY      (Primary API key / Auth key)
 *  - WLC_SMS_TEMPLATE_ID  (Optional DLT / SMS template identifier)
 *  - WLC_SMS_SENDER_ID    (Optional 6-character sender ID e.g. WLCIND)
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_SMS {

    /**
     * Dispatch SMS OTP to recipient phone number
     *
     * @param string $phone Full normalized phone number (e.g. +919876543210)
     * @param string $otp   6-digit OTP code
     * @return array ['success' => bool, 'message' => string, 'provider' => string]
     */
    public static function send_otp( $phone, $otp ) {
        $message = sprintf( "Your Wellness Lovers Club verification OTP is %s. Valid for 10 minutes. Do not share this OTP with anyone.", $otp );

        // 1. 2Factor (Primary Indian SMS Gateway)
        if ( self::is_provider( '2factor' ) || ( defined( 'WLC_2FACTOR_API_KEY' ) && WLC_2FACTOR_API_KEY ) ) {
            return self::send_via_2factor( $phone, $otp );
        }

        // 2. MSG91 (DLT Transactional OTP)
        if ( self::is_provider( 'msg91' ) || ( defined( 'WLC_MSG91_AUTH_KEY' ) && WLC_MSG91_AUTH_KEY ) ) {
            return self::send_via_msg91( $phone, $otp );
        }

        // 3. Fast2SMS
        if ( self::is_provider( 'fast2sms' ) || ( defined( 'WLC_FAST2SMS_API_KEY' ) && WLC_FAST2SMS_API_KEY ) ) {
            return self::send_via_fast2sms( $phone, $otp );
        }

        // 4. Twilio (International / Fallback)
        if ( self::is_provider( 'twilio' ) || ( defined( 'WLC_TWILIO_SID' ) && defined( 'WLC_TWILIO_TOKEN' ) ) ) {
            return self::send_via_twilio( $phone, $message );
        }

        // 5. If no provider configured or active
        if ( class_exists( 'WLC_Core_Logger' ) ) {
            WLC_Core_Logger::log( sprintf( "[SMS Error] No active SMS provider configured for: %s", $phone ), 'ERROR' );
        }

        return array(
            'success' => false,
            'code'    => 'sms_provider_not_configured',
            'message' => 'SMS Gateway is not configured. Please contact support.',
        );
    }

    /**
     * Check if a specific provider is configured as active
     */
    private static function is_provider( $name ) {
        if ( defined( 'WLC_SMS_PROVIDER' ) && strtolower( WLC_SMS_PROVIDER ) === strtolower( $name ) ) {
            return true;
        }
        return false;
    }

    /**
     * Helper to get generic or specific API key
     */
    private static function get_api_key( $specific_constant = '' ) {
        if ( ! empty( $specific_constant ) && defined( $specific_constant ) && constant( $specific_constant ) ) {
            return constant( $specific_constant );
        }
        if ( defined( 'WLC_SMS_API_KEY' ) && WLC_SMS_API_KEY ) {
            return WLC_SMS_API_KEY;
        }
        if ( defined( 'WLC_SMS_AUTH_KEY' ) && WLC_SMS_AUTH_KEY ) {
            return WLC_SMS_AUTH_KEY;
        }
        return getenv( 'WLC_SMS_API_KEY' ) ?: '';
    }

    /**
     * Send OTP via 2Factor.in REST API (Specialized for Indian mobile numbers)
     * Docs: https://2factor.in/v3/
     */
    private static function send_via_2factor( $phone, $otp ) {
        $api_key = self::get_api_key( 'WLC_2FACTOR_API_KEY' );
        if ( empty( $api_key ) ) {
            return array( 'success' => false, 'message' => '2Factor API key is not configured.', 'provider' => '2factor' );
        }

        // Format clean 10-digit or full Indian phone
        $clean_phone = preg_replace( '/\D/', '', $phone );
        if ( strlen( $clean_phone ) > 10 && substr( $clean_phone, 0, 2 ) === '91' ) {
            $clean_phone = substr( $clean_phone, 2 );
        }

        $template_segment = ( defined( 'WLC_2FACTOR_TEMPLATE_NAME' ) && WLC_2FACTOR_TEMPLATE_NAME )
            ? '/' . rawurlencode( WLC_2FACTOR_TEMPLATE_NAME )
            : ( defined( 'WLC_SMS_TEMPLATE_ID' ) && WLC_SMS_TEMPLATE_ID ? '/' . rawurlencode( WLC_SMS_TEMPLATE_ID ) : '' );

        $url = sprintf(
            'https://2factor.in/API/V1/%s/SMS/%s/%s%s',
            rawurlencode( $api_key ),
            rawurlencode( $clean_phone ),
            rawurlencode( $otp ),
            $template_segment
        );

        $response = wp_remote_get( $url, array( 'timeout' => 15 ) );

        if ( is_wp_error( $response ) ) {
            return array( 'success' => false, 'message' => $response->get_error_message(), 'provider' => '2factor' );
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code === 200 && isset( $body['Status'] ) && strtolower( $body['Status'] ) === 'success' ) {
            return array( 'success' => true, 'message' => 'SMS OTP sent via 2Factor', 'provider' => '2factor' );
        }

        $err_msg = isset( $body['Details'] ) ? $body['Details'] : '2Factor dispatch failed';
        return array( 'success' => false, 'message' => $err_msg, 'provider' => '2factor' );
    }

    /**
     * Send via MSG91 OTP API
     * Docs: https://docs.msg91.com/p/tf9GText/otp
     */
    private static function send_via_msg91( $phone, $otp ) {
        $auth_key    = self::get_api_key( 'WLC_MSG91_AUTH_KEY' );
        $template_id = defined( 'WLC_MSG91_TEMPLATE_ID' ) ? WLC_MSG91_TEMPLATE_ID : ( defined( 'WLC_SMS_TEMPLATE_ID' ) ? WLC_SMS_TEMPLATE_ID : '' );
        $clean_phone = preg_replace( '/\D/', '', $phone );

        if ( empty( $auth_key ) || empty( $template_id ) ) {
            return array( 'success' => false, 'message' => 'MSG91 Auth Key or Template ID missing.', 'provider' => 'msg91' );
        }

        $url = "https://control.msg91.com/api/v5/otp?template_id={$template_id}&mobile={$clean_phone}&authkey={$auth_key}&otp={$otp}";

        $response = wp_remote_post( $url, array(
            'headers' => array( 'Content-Type' => 'application/json' ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array( 'success' => false, 'message' => $response->get_error_message(), 'provider' => 'msg91' );
        }

        $code = wp_remote_retrieve_response_code( $response );
        $body = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code === 200 && isset( $body['type'] ) && $body['type'] === 'success' ) {
            return array( 'success' => true, 'message' => 'SMS sent via MSG91', 'provider' => 'msg91' );
        }

        $err_msg = isset( $body['message'] ) ? $body['message'] : 'MSG91 dispatch failed';
        return array( 'success' => false, 'message' => $err_msg, 'provider' => 'msg91' );
    }

    /**
     * Send via Fast2SMS API
     */
    private static function send_via_fast2sms( $phone, $otp ) {
        $api_key     = self::get_api_key( 'WLC_FAST2SMS_API_KEY' );
        $clean_phone = preg_replace( '/\D/', '', $phone );
        if ( strlen( $clean_phone ) > 10 ) {
            $clean_phone = substr( $clean_phone, -10 );
        }

        if ( empty( $api_key ) ) {
            return array( 'success' => false, 'message' => 'Fast2SMS API key missing.', 'provider' => 'fast2sms' );
        }

        $url = 'https://www.fast2sms.com/dev/bulkV2';

        $response = wp_remote_post( $url, array(
            'headers' => array(
                'authorization' => $api_key,
                'Content-Type'  => 'application/json',
            ),
            'body' => json_encode( array(
                'variables_values' => $otp,
                'route'            => 'otp',
                'numbers'          => $clean_phone,
            ) ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array( 'success' => false, 'message' => $response->get_error_message(), 'provider' => 'fast2sms' );
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( isset( $body['return'] ) && $body['return'] === true ) {
            return array( 'success' => true, 'message' => 'SMS sent via Fast2SMS', 'provider' => 'fast2sms' );
        }

        return array( 'success' => false, 'message' => isset( $body['message'] ) ? $body['message'] : 'Fast2SMS failed', 'provider' => 'fast2sms' );
    }

    /**
     * Send via Twilio REST API
     */
    private static function send_via_twilio( $to, $body ) {
        $sid   = defined( 'WLC_TWILIO_SID' ) ? WLC_TWILIO_SID : '';
        $token = defined( 'WLC_TWILIO_TOKEN' ) ? WLC_TWILIO_TOKEN : '';
        $from  = defined( 'WLC_TWILIO_FROM' ) ? WLC_TWILIO_FROM : '';

        if ( empty( $sid ) || empty( $token ) || empty( $from ) ) {
            return array( 'success' => false, 'message' => 'Twilio credentials missing.', 'provider' => 'twilio' );
        }

        $url = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";

        $response = wp_remote_post( $url, array(
            'headers' => array(
                'Authorization' => 'Basic ' . base64_encode( "{$sid}:{$token}" ),
                'Content-Type'  => 'application/x-www-form-urlencoded',
            ),
            'body' => array(
                'From' => $from,
                'To'   => $to,
                'Body' => $body,
            ),
            'timeout' => 15,
        ) );

        if ( is_wp_error( $response ) ) {
            return array( 'success' => false, 'message' => $response->get_error_message(), 'provider' => 'twilio' );
        }

        $code = wp_remote_retrieve_response_code( $response );
        $data = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $code >= 200 && $code < 300 ) {
            return array( 'success' => true, 'message' => 'SMS sent via Twilio', 'provider' => 'twilio', 'sid' => isset( $data['sid'] ) ? $data['sid'] : '' );
        }

        return array( 'success' => false, 'message' => isset( $data['message'] ) ? $data['message'] : 'Twilio dispatch failed', 'provider' => 'twilio' );
    }
}


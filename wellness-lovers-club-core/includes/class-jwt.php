<?php
/**
 * Self-contained JWT Token generation and validation service
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_JWT {

    /**
     * Generate a new JWT token for a given user ID
     */
    public static function generate_token( $user_id ) {
        $secret_key = defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : 'wlc_fallback_secret_key_1234567890';
        $header = json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) );
        $issuedAt = time();
        $expire   = $issuedAt + DAY_IN_SECONDS * 7; // Token expires in 7 days
        
        $payload = json_encode( array(
            'iss'  => get_bloginfo( 'url' ),
            'iat'  => $issuedAt,
            'nbf'  => $issuedAt,
            'exp'  => $expire,
            'data' => array(
                'user' => array(
                    'id' => $user_id
                )
            )
        ) );

        $base64UrlHeader    = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $header ) );
        $base64UrlPayload   = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $payload ) );
        $signature          = hash_hmac( 'sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true );
        $base64UrlSignature = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $signature ) );

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Validate an incoming JWT token and return the User ID
     *
     * @return int|bool User ID if valid, false otherwise
     */
    public static function validate_token( $token ) {
        if ( empty( $token ) ) {
            return false;
        }

        // Clean bearer prefix if present
        if ( preg_match( '/Bearer\s+(.*)$/i', $token, $matches ) ) {
            $token = $matches[1];
        }

        $parts = explode( '.', $token );
        if ( count( $parts ) !== 3 ) {
            return false;
        }

        list( $base64UrlHeader, $base64UrlPayload, $base64UrlSignature ) = $parts;

        $secret_key = defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : 'wlc_fallback_secret_key_1234567890';
        
        // Re-calculate signature
        $signature = hash_hmac( 'sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true );
        $expectedSignature = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $signature ) );

        if ( ! hash_equals( $expectedSignature, $base64UrlSignature ) ) {
            return false;
        }

        $payload_json = base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $base64UrlPayload ) );
        $payload = json_decode( $payload_json, true );
        
        if ( ! $payload || empty( $payload['exp'] ) || time() >= $payload['exp'] ) {
            return false; // Expired or malformed
        }

        return isset( $payload['data']['user']['id'] ) ? intval( $payload['data']['user']['id'] ) : false;
    }

    /**
     * Authentication check for secure REST requests
     */
    public static function authenticate_request( $request ) {
        $auth_header = $request->get_header( 'Authorization' );
        if ( empty( $auth_header ) ) {
            return new WP_Error( 'unauthorized', 'Missing Authorization header.', array( 'status' => 401 ) );
        }

        $user_id = self::validate_token( $auth_header );
        if ( ! $user_id ) {
            return new WP_Error( 'unauthorized', 'Invalid or expired authentication token.', array( 'status' => 401 ) );
        }

        // Log user in temporarily for this request
        wp_set_current_user( $user_id );
        return true;
    }
}

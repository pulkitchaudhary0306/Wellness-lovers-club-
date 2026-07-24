<?php
namespace AntigravityB\API\Middleware;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Jwt {

    /**
     * Retrieve configured JWT secret
     */
    private static function get_secret() {
        return defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : 'agb_fallback_token_signing_secret_9988';
    }

    /**
     * Generate token for a user
     */
    public static function generate_token( $user_id ) {
        $header = json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) );
        
        $issued_at = time();
        $expiry    = $issued_at + ( defined( 'JWT_AUTH_EXPIRE' ) ? JWT_AUTH_EXPIRE : DAY_IN_SECONDS * 7 );

        $payload = json_encode( array(
            'iss'  => get_bloginfo( 'url' ),
            'iat'  => $issued_at,
            'nbf'  => $issued_at,
            'exp'  => $expiry,
            'data' => array(
                'user' => array(
                    'id' => $user_id
                )
            )
        ) );

        $base64_header    = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $header ) );
        $base64_payload   = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $payload ) );
        
        $signature        = hash_hmac( 'sha256', $base64_header . "." . $base64_payload, self::get_secret(), true );
        $base64_signature = str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $signature ) );

        return $base64_header . "." . $base64_payload . "." . $base64_signature;
    }

    /**
     * Validate and decode token
     */
    public static function validate_token( $token ) {
        $parts = explode( '.', $token );
        if ( count( $parts ) !== 3 ) {
            return false;
        }

        list( $base64_header, $base64_payload, $base64_signature ) = $parts;

        $signature = base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $base64_signature ) );
        $expected  = hash_hmac( 'sha256', $base64_header . "." . $base64_payload, self::get_secret(), true );

        if ( ! hash_equals( $signature, $expected ) ) {
            return false;
        }

        $payload = json_decode( base64_decode( str_replace( array( '-', '_' ), array( '+', '/' ), $base64_payload ) ), true );

        if ( empty( $payload ) || ! isset( $payload['exp'] ) || time() > $payload['exp'] ) {
            return false; // Token expired
        }

        return $payload;
    }
}

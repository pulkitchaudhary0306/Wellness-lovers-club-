<?php
/**
 * Self-contained JWT Token generation and validation service
 * Wellness Lovers Club — Unified Authentication & JWT Engine
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! class_exists( 'WLC_Core_JWT' ) ) {

    class WLC_Core_JWT {

        /**
         * Resolves the authoritative JWT secret key.
         *
         * Priority:
         *   1. JWT_AUTH_SECRET_KEY (defined in wp-config.php)
         *   2. WLC_JWT_SECRET     (defined in wp-config.php, alias)
         *
         * Returns null if neither constant is configured.
         * Callers MUST check for a falsy return value and reject the operation.
         */
        public static function get_secret_key() {
            if ( defined( 'JWT_AUTH_SECRET_KEY' ) && ! empty( JWT_AUTH_SECRET_KEY ) ) {
                return JWT_AUTH_SECRET_KEY;
            }
            if ( defined( 'WLC_JWT_SECRET' ) && ! empty( WLC_JWT_SECRET ) ) {
                return WLC_JWT_SECRET;
            }

            // SECURITY: Never fall back to wp_salt or any hardcoded value.
            // If the production secret is missing, fail safely.
            error_log( '[WLC JWT] CRITICAL: JWT_AUTH_SECRET_KEY is not defined in wp-config.php. All token operations will fail.' );
            return null;
        }

        /**
         * Standard Base64URL encoding (RFC 7515 compliant, URL-safe, unpadded)
         */
        public static function base64url_encode( $data ) {
            return str_replace( array( '+', '/', '=' ), array( '-', '_', '' ), base64_encode( $data ) );
        }

        /**
         * Standard Base64URL decoding
         */
        public static function base64url_decode( $data ) {
            $remainder = strlen( $data ) % 4;
            if ( $remainder ) {
                $padlen = 4 - $remainder;
                $data .= str_repeat( '=', $padlen );
            }
            return base64_decode( strtr( $data, '-_', '+/' ) );
        }

        /**
         * Generate a new JWT token for a given user ID
         *
         * @param int $user_id
         * @param int $expiration_days
         * @return string
         */
        public static function generate_token( $user_id, $expiration_days = 7 ) {
            $secret_key = self::get_secret_key();
            if ( empty( $secret_key ) ) {
                return ''; // Fail safely — no secret configured
            }
            $header     = json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) );
            $issued_at  = time();
            $expire     = $issued_at + ( DAY_IN_SECONDS * $expiration_days );

            $payload = json_encode( array(
                'iss'  => get_bloginfo( 'url' ),
                'iat'  => $issued_at,
                'nbf'  => $issued_at,
                'exp'  => $expire,
                'data' => array(
                    'user' => array(
                        'id' => (int) $user_id,
                    ),
                ),
            ) );

            $base64_header    = self::base64url_encode( $header );
            $base64_payload   = self::base64url_encode( $payload );
            $raw_signature    = hash_hmac( 'sha256', "{$base64_header}.{$base64_payload}", $secret_key, true );
            $base64_signature = self::base64url_encode( $raw_signature );

            return "{$base64_header}.{$base64_payload}.{$base64_signature}";
        }

        /**
         * Extracts Bearer token across all possible server/FastCGI/Nginx header locations
         *
         * @param WP_REST_Request|null $request
         * @return string
         */
        public static function extract_bearer_token( $request = null ) {
            $auth_header = '';

            if ( $request && method_exists( $request, 'get_header' ) ) {
                $auth_header = $request->get_header( 'Authorization' );
                if ( empty( $auth_header ) ) {
                    $auth_header = $request->get_header( 'authorization' );
                }
            }

            if ( empty( $auth_header ) && isset( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
                $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
            }

            if ( empty( $auth_header ) && isset( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ) ) {
                $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
            }

            if ( empty( $auth_header ) && function_exists( 'getallheaders' ) ) {
                $headers = getallheaders();
                if ( isset( $headers['Authorization'] ) ) {
                    $auth_header = $headers['Authorization'];
                } elseif ( isset( $headers['authorization'] ) ) {
                    $auth_header = $headers['authorization'];
                }
            }

            if ( empty( $auth_header ) && function_exists( 'apache_request_headers' ) ) {
                $headers = apache_request_headers();
                if ( isset( $headers['Authorization'] ) ) {
                    $auth_header = $headers['Authorization'];
                } elseif ( isset( $headers['authorization'] ) ) {
                    $auth_header = $headers['authorization'];
                }
            }

            if ( empty( $auth_header ) ) {
                return '';
            }

            if ( preg_match( '/Bearer\s+([a-zA-Z0-9\-_=]+\.[a-zA-Z0-9\-_=]+\.[a-zA-Z0-9\-_=]+)/i', trim( $auth_header ), $matches ) ) {
                return $matches[1];
            }

            return '';
        }

        /**
         * Validate an incoming JWT token and return the User ID
         *
         * @param string $token
         * @return int|false User ID if valid and user exists in database, false otherwise
         */
        public static function validate_token( $token ) {
            if ( empty( $token ) ) {
                return false;
            }

            if ( preg_match( '/Bearer\s+(.*)$/i', trim( $token ), $matches ) ) {
                $token = $matches[1];
            }

            $parts = explode( '.', trim( $token ) );
            if ( count( $parts ) !== 3 ) {
                return false;
            }

            list( $base64_header, $base64_payload, $base64_signature ) = $parts;
            $secret_key = self::get_secret_key();
            if ( empty( $secret_key ) ) {
                return false; // Fail safely — no secret configured
            }

            $raw_expected_sig = hash_hmac( 'sha256', "{$base64_header}.{$base64_payload}", $secret_key, true );
            $expected_sig     = self::base64url_encode( $raw_expected_sig );

            if ( ! hash_equals( $expected_sig, $base64_signature ) ) {
                return false;
            }

            $payload_json = self::base64url_decode( $base64_payload );
            $payload      = json_decode( $payload_json, true );

            if ( ! $payload || empty( $payload['exp'] ) || time() >= $payload['exp'] ) {
                return false; // Expired or malformed
            }

            if ( ! isset( $payload['data']['user']['id'] ) ) {
                return false;
            }

            $user_id = (int) $payload['data']['user']['id'];
            if ( $user_id <= 0 ) {
                return false;
            }

            // Verify that this WordPress user genuinely exists
            $user = get_user_by( 'id', $user_id );
            if ( ! $user || ! ( $user instanceof WP_User ) ) {
                return false;
            }

            return $user_id;
        }

        /**
         * Resolves the authenticated user ID safely from the current request
         *
         * @param WP_REST_Request|null $request
         * @return int User ID or 0 if not authenticated
         */
        public static function get_current_user_id( $request = null ) {
            $token = self::extract_bearer_token( $request );
            if ( ! empty( $token ) ) {
                $user_id = self::validate_token( $token );
                if ( $user_id ) {
                    return $user_id;
                }
            }

            if ( is_user_logged_in() ) {
                return (int) get_current_user_id();
            }

            return 0;
        }

        /**
         * Alias for get_current_user_id
         */
        public static function get_authenticated_user_id( $request = null ) {
            return self::get_current_user_id( $request );
        }

        /**
         * Permission callback checking JWT validation for REST routes
         *
         * @param WP_REST_Request $request
         * @return true|WP_Error
         */
        public static function authenticate_request( $request ) {
            $token = self::extract_bearer_token( $request );
            if ( empty( $token ) ) {
                return new WP_Error( 'unauthorized', 'Missing Authorization header.', array( 'status' => 401 ) );
            }

            $user_id = self::validate_token( $token );
            if ( ! $user_id ) {
                return new WP_Error( 'unauthorized', 'Invalid or expired authentication token.', array( 'status' => 401 ) );
            }

            // Temporarily set current user context for this request
            wp_set_current_user( $user_id );
            return true;
        }

        /**
         * WordPress determine_current_user filter callback
         *
         * @param int|false $user_id
         * @return int|false
         */
        public static function determine_current_user( $user_id ) {
            if ( ! empty( $user_id ) && $user_id > 0 ) {
                return $user_id;
            }

            $token = self::extract_bearer_token();
            if ( empty( $token ) ) {
                return $user_id;
            }

            $validated_id = self::validate_token( $token );
            if ( $validated_id && $validated_id > 0 ) {
                return $validated_id;
            }

            return $user_id;
        }
    }
}

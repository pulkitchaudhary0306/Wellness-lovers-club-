<?php
/**
 * Plugin Name: WLC API
 * Description: Custom REST API endpoints and CORS configuration for Wellness Lovers Club integration.
 * Version: 1.0.0
 * Author: Wellness Lovers Club
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ─── 1. CORS Filters Implementation ──────────────────────────────────────────

add_action('init', function () {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    } else {
        header("Access-Control-Allow-Origin: *");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    } else {
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    } else {
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With, Origin, Accept");
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);
        header("Content-Length: 0");
        header("Content-Type: text/plain");
        exit;
    }
});

// ─── 2. Global Helpers & User Meta Operations ───────────────────────────────

function wlc_meta_prefix( $key ) {
    return 'wlc_' . $key;
}

function wlc_get_custom_meta_keys() {
    return array(
        'phone'                 => wlc_meta_prefix( 'phone' ),
        'profession'            => wlc_meta_prefix( 'profession' ),
        'companyName'           => wlc_meta_prefix( 'company_name' ),
        'correspondenceAddress' => wlc_meta_prefix( 'correspondence_address' ),
        'preferences'           => wlc_meta_prefix( 'preferences' ),
        'membershipStatus'      => wlc_meta_prefix( 'membership_status' ),
        'membershipTier'        => wlc_meta_prefix( 'membership_tier' ),
    );
}

function wlc_get_user_meta( $user_id, $key, $single = true ) {
    $keys = wlc_get_custom_meta_keys();
    $meta_key = isset( $keys[$key] ) ? $keys[$key] : $key;
    return get_user_meta( $user_id, $meta_key, $single );
}

function wlc_update_user_meta( $user_id, $key, $value ) {
    $keys = wlc_get_custom_meta_keys();
    $meta_key = isset( $keys[$key] ) ? $keys[$key] : $key;
    return update_user_meta( $user_id, $meta_key, $value );
}

// ─── 3. Core Response & Validation Handlers ─────────────────────────────────

class Wellness_API_Response {
    public static function success( $data = array(), $status = 200 ) {
        return new WP_REST_Response( $data, $status );
    }

    public static function error( $code = 'error', $message = 'An error occurred', $status = 400, $additional_data = array() ) {
        $error_data = array( 'status' => $status );
        if ( ! empty( $additional_data ) ) {
            $error_data['data'] = $additional_data;
        }
        return new WP_Error( $code, $message, $error_data );
    }
}

class Wellness_API_Security {
    public static function check_auth( $request ) {
        $user_id = get_current_user_id();
        if ( ! $user_id ) {
            return new WP_Error(
                'unauthorized',
                'Your session has expired or you are not authorized. Please log in.',
                array( 'status' => 401 )
            );
        }
        return true;
    }
}

class Wellness_API_Validator {
    public static function validate_registration( $params ) {
        $required = array( 'firstName', 'email', 'password' );

        foreach ( $required as $field ) {
            if ( empty( $params[$field] ) ) {
                return new WP_Error( 'missing_field', sprintf( 'Field "%s" is required.', $field ), array( 'status' => 400 ) );
            }
        }

        if ( ! is_email( $params['email'] ) ) {
            return new WP_Error( 'invalid_email', 'Enter a valid email address.', array( 'status' => 400 ) );
        }

        if ( email_exists( $params['email'] ) ) {
            return new WP_Error( 'email_taken', 'This email address is already registered.', array( 'status' => 400 ) );
        }

        if ( username_exists( $params['email'] ) ) {
            return new WP_Error( 'username_taken', 'This username is already taken.', array( 'status' => 400 ) );
        }

        if ( strlen( $params['password'] ) < 6 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 6 characters long.', array( 'status' => 400 ) );
        }

        return true;
    }
}

// ─── 4. REST API Endpoint Controllers ────────────────────────────────────────

add_action( 'rest_api_init', function () {
    $namespace = 'custom/v1';

    // Auth & Register
    register_rest_route( $namespace, '/register', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_register',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( $namespace, '/logout', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_logout',
        'permission_callback' => 'wlc_api_check_security',
    ) );

    // Profile GET & PUT
    register_rest_route( $namespace, '/profile', array(
        array(
            'methods'             => 'GET',
            'callback'            => 'wlc_api_get_profile',
            'permission_callback' => 'wlc_api_check_security',
        ),
        array(
            'methods'             => 'PUT',
            'callback'            => 'wlc_api_update_profile',
            'permission_callback' => 'wlc_api_check_security',
        )
    ) );

    // Passwords reset & change
    register_rest_route( $namespace, '/forgot-password', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_forgot_password',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( $namespace, '/reset-password', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_reset_password',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( $namespace, '/verify-email', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_verify_email',
        'permission_callback' => '__return_true',
    ) );

    register_rest_route( $namespace, '/change-password', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_change_password',
        'permission_callback' => 'wlc_api_check_security',
    ) );

    // Memberships, Orders & Payments
    register_rest_route( $namespace, '/membership', array(
        'methods'             => 'GET',
        'callback'            => 'wlc_api_get_membership',
        'permission_callback' => 'wlc_api_check_security',
    ) );

    register_rest_route( $namespace, '/orders', array(
        'methods'             => 'GET',
        'callback'            => 'wlc_api_get_orders',
        'permission_callback' => 'wlc_api_check_security',
    ) );

    register_rest_route( $namespace, '/payments', array(
        'methods'             => 'GET',
        'callback'            => 'wlc_api_get_payments',
        'permission_callback' => 'wlc_api_check_security',
    ) );

    register_rest_route( $namespace, '/contact', array(
        'methods'             => 'POST',
        'callback'            => 'wlc_api_submit_contact',
        'permission_callback' => '__return_true',
    ) );
} );

// Security Wrapper
function wlc_api_check_security( $request ) {
    return Wellness_API_Security::check_auth( $request );
}

// Controller Implementations

function wlc_api_register( $request ) {
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    $validation = Wellness_API_Validator::validate_registration( $params );
    if ( is_wp_error( $validation ) ) {
        return Wellness_API_Response::error( $validation->get_error_code(), $validation->get_error_message(), 400 );
    }

    $firstName = sanitize_text_field( $params['firstName'] );
    $lastName  = sanitize_text_field( $params['lastName'] );
    $email     = sanitize_email( $params['email'] );
    $password  = $params['password'];

    $user_id = wp_create_user( $email, $password, $email );
    if ( is_wp_error( $user_id ) ) {
        return Wellness_API_Response::error( 'registration_failed', $user_id->get_error_message(), 400 );
    }

    wp_update_user( array(
        'ID'           => $user_id,
        'first_name'   => $firstName,
        'last_name'    => $lastName,
        'display_name' => trim( "$firstName $lastName" ),
    ) );

    $phone = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
    wlc_update_user_meta( $user_id, 'phone', $phone );

    foreach ( $params as $key => $value ) {
        if ( ! in_array( $key, array( 'firstName', 'lastName', 'email', 'password', 'phone' ) ) ) {
            $sanitized_value = is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : sanitize_text_field( $value );
            wlc_update_user_meta( $user_id, $key, $sanitized_value );
        }
    }

    wlc_update_user_meta( $user_id, 'membershipStatus', 'Inactive' );
    wlc_update_user_meta( $user_id, 'membershipTier', 'Lotus Club' );

    // Generate and send registration OTP
    $otp = (string) rand( 100000, 999999 );
    update_user_meta( $user_id, 'wlc_reset_otp', $otp );
    update_user_meta( $user_id, 'wlc_reset_otp_time', time() );

    $subject = 'Verify Your Email | Wellness Lovers Club';
    $message = "Hello " . $firstName . ",\n\nWelcome to Wellness Lovers Club! Please verify your email address to activate your membership.\n\nYour Verification OTP Code: " . $otp . "\n\nThis OTP will expire in 15 minutes.\n";
    wp_mail( $email, $subject, $message );

    $secret_key = defined( 'JWT_AUTH_SECRET_KEY' ) ? JWT_AUTH_SECRET_KEY : 'wlc_fallback_secret_key_1234567890';
    $header = json_encode( array( 'typ' => 'JWT', 'alg' => 'HS256' ) );
    $issuedAt = time();
    $expire   = $issuedAt + DAY_IN_SECONDS * 7;
    
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

    $token = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    $user_data = array(
        'id'               => (string) $user_id,
        'firstName'        => $firstName,
        'lastName'         => $lastName,
        'email'            => $email,
        'phone'            => $phone,
        'profession'       => isset( $params['profession'] ) ? sanitize_text_field( $params['profession'] ) : '',
        'companyName'      => isset( $params['companyName'] ) ? sanitize_text_field( $params['companyName'] ) : '',
        'country'          => '',
        'membershipStatus' => 'Inactive',
        'membershipTier'   => 'Lotus Club'
    );

    return Wellness_API_Response::success( array(
        'token'         => $token,
        'refresh_token' => '',
        'user'          => $user_data
    ), 201 );
}

function wlc_api_logout( $request ) {
    return Wellness_API_Response::success( array( 'success' => true, 'message' => 'Logged out successfully.' ) );
}

function wlc_api_get_profile( $request ) {
    $user_id = get_current_user_id();
    $user = get_userdata( $user_id );

    if ( ! $user ) {
        return Wellness_API_Response::error( 'user_not_found', 'User data could not be retrieved.', 404 );
    }

    $phone = wlc_get_user_meta( $user_id, 'phone' );
    $profession = wlc_get_user_meta( $user_id, 'profession' );
    $company_name = wlc_get_user_meta( $user_id, 'companyName' );
    $address = wlc_get_user_meta( $user_id, 'correspondenceAddress' );
    $preferences = wlc_get_user_meta( $user_id, 'preferences' );
    $membership_status = wlc_get_user_meta( $user_id, 'membershipStatus' );
    $membership_tier = wlc_get_user_meta( $user_id, 'membershipTier' );

    if ( empty( $membership_status ) ) { $membership_status = 'Inactive'; }
    if ( empty( $membership_tier ) ) { $membership_tier = 'Lotus Club'; }

    return Wellness_API_Response::success( array(
        'id'               => (string) $user_id,
        'firstName'        => $user->first_name,
        'lastName'         => $user->last_name,
        'email'            => $user->user_email,
        'phone'            => $phone,
        'profession'       => $profession,
        'companyName'      => $company_name,
        'country'          => '',
        'address'          => $address,
        'preferences'      => $preferences ? (array) $preferences : array(),
        'membershipStatus' => $membership_status,
        'membershipTier'   => $membership_tier
    ) );
}

function wlc_api_update_profile( $request ) {
    $user_id = get_current_user_id();
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    $user_data = array( 'ID' => $user_id );

    if ( isset( $params['firstName'] ) ) { $user_data['first_name'] = sanitize_text_field( $params['firstName'] ); }
    if ( isset( $params['lastName'] ) ) { $user_data['last_name'] = sanitize_text_field( $params['lastName'] ); }
    if ( isset( $params['email'] ) ) {
        $email = sanitize_email( $params['email'] );
        if ( is_email( $email ) ) {
            $existing = email_exists( $email );
            if ( $existing && $existing !== $user_id ) {
                return Wellness_API_Response::error( 'email_exists', 'This email is already in use.', 400 );
            }
            $user_data['user_email'] = $email;
        } else {
            return Wellness_API_Response::error( 'invalid_email', 'Invalid email address.', 400 );
        }
    }

    if ( count( $user_data ) > 1 ) {
        wp_update_user( $user_data );
    }

    if ( isset( $params['phone'] ) ) { wlc_update_user_meta( $user_id, 'phone', sanitize_text_field( $params['phone'] ) ); }
    if ( isset( $params['profession'] ) ) { wlc_update_user_meta( $user_id, 'profession', sanitize_text_field( $params['profession'] ) ); }
    if ( isset( $params['companyName'] ) ) { wlc_update_user_meta( $user_id, 'companyName', sanitize_text_field( $params['companyName'] ) ); }
    if ( isset( $params['address'] ) ) { wlc_update_user_meta( $user_id, 'correspondenceAddress', sanitize_textarea_field( $params['address'] ) ); }
    if ( isset( $params['preferences'] ) ) { wlc_update_user_meta( $user_id, 'preferences', (array) $params['preferences'] ); }

    return wlc_api_get_profile( $request );
}

function wlc_api_forgot_password( $request ) {
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    if ( empty( $params['email'] ) ) {
        return Wellness_API_Response::error( 'missing_email', 'Email field is required.', 400 );
    }

    $email = sanitize_email( $params['email'] );
    $user = get_user_by( 'email', $email );

    if ( ! $user ) {
        return Wellness_API_Response::success( array( 'success' => true, 'message' => 'If account exists, reset code has been sent.' ) );
    }

    $key = get_password_reset_key( $user );
    $otp = (string) rand( 100000, 999999 );
    update_user_meta( $user->ID, 'wlc_reset_otp', $otp );
    update_user_meta( $user->ID, 'wlc_reset_otp_time', time() );

    $reset_url = home_url( "/reset-password?key={$key}&login=" . rawurlencode( $user->user_login ) );
    $subject = 'Password Reset Request | Wellness Lovers Club';
    $message = "Hello,\n\nReset your password here:\n{$reset_url}\n\nOTP Code: {$otp}\n";

    wp_mail( $email, $subject, $message );

    return Wellness_API_Response::success( array( 'success' => true, 'message' => 'Password reset email sent.' ) );
}

function wlc_api_reset_password( $request ) {
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    if ( empty( $params['key'] ) || empty( $params['login'] ) || empty( $params['password'] ) ) {
        return Wellness_API_Response::error( 'missing_fields', 'Key, login, and password are required.', 400 );
    }

    $user = check_password_reset_key( $params['key'], $params['login'] );
    if ( is_wp_error( $user ) ) {
        return Wellness_API_Response::error( 'invalid_key', 'The reset token is invalid or expired.', 400 );
    }

    if ( strlen( $params['password'] ) < 8 ) {
        return Wellness_API_Response::error( 'weak_password', 'Password must be at least 8 characters long.', 400 );
    }

    reset_password( $user, $params['password'] );

    return Wellness_API_Response::success( array( 'success' => true, 'message' => 'Your password has been successfully reset.' ) );
}

function wlc_api_verify_email( $request ) {
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    if ( empty( $params['email'] ) || empty( $params['otp'] ) ) {
        return Wellness_API_Response::error( 'missing_fields', 'Email and OTP are required.', 400 );
    }

    $user = get_user_by( 'email', sanitize_email( $params['email'] ) );
    if ( ! $user ) {
        return Wellness_API_Response::error( 'user_not_found', 'User account not found.', 404 );
    }

    $saved_otp = get_user_meta( $user->ID, 'wlc_reset_otp', true );
    $otp_time = get_user_meta( $user->ID, 'wlc_reset_otp_time', true );

    if ( ! $saved_otp || $saved_otp !== $params['otp'] || ( time() - intval( $otp_time ) ) > 900 ) {
        return Wellness_API_Response::error( 'invalid_otp', 'The OTP code is incorrect or expired.', 400 );
    }

    delete_user_meta( $user->ID, 'wlc_reset_otp' );
    delete_user_meta( $user->ID, 'wlc_reset_otp_time' );

    // Update membership status to Active
    wlc_update_user_meta( $user->ID, 'membershipStatus', 'Active' );

    return Wellness_API_Response::success( array( 'success' => true, 'message' => 'OTP verification successful.' ) );
}

function wlc_api_change_password( $request ) {
    $user_id = get_current_user_id();
    $user = get_userdata( $user_id );
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    if ( empty( $params['current_password'] ) || empty( $params['new_password'] ) ) {
        return Wellness_API_Response::error( 'missing_passwords', 'Current and new passwords are required.', 400 );
    }

    if ( ! wp_check_password( $params['current_password'], $user->user_pass, $user_id ) ) {
        return Wellness_API_Response::error( 'incorrect_password', 'Current password is incorrect.', 400 );
    }

    if ( strlen( $params['new_password'] ) < 8 ) {
        return Wellness_API_Response::error( 'weak_password', 'New password must be at least 8 characters long.', 400 );
    }

    wp_set_password( $params['new_password'], $user_id );

    return Wellness_API_Response::success( array( 'success' => true, 'message' => 'Password changed successfully.' ) );
}

function wlc_api_get_membership( $request ) {
    $user_id = get_current_user_id();
    $status = wlc_get_user_meta( $user_id, 'membershipStatus' );
    $tier = wlc_get_user_meta( $user_id, 'membershipTier' );

    if ( empty( $status ) ) { $status = 'Inactive'; }
    if ( empty( $tier ) ) { $tier = 'Lotus Club'; }

    return Wellness_API_Response::success( array(
        array(
            'id'           => 'mem_' . $user_id,
            'tier'         => $tier,
            'status'       => $status,
            'startDate'    => date( 'Y-m-d', strtotime( '-1 month' ) ),
            'endDate'      => date( 'Y-m-d', strtotime( '+11 months' ) ),
            'price'        => '$499',
            'billingCycle' => 'Annual'
        )
    ) );
}

function wlc_api_get_orders( $request ) {
    $user_id = get_current_user_id();
    $orders = array();

    if ( class_exists( 'WooCommerce' ) ) {
        $customer_orders = wc_get_orders( array( 'customer' => $user_id, 'limit' => 20 ) );
        foreach ( $customer_orders as $order ) {
            $items = array();
            foreach ( $order->get_items() as $item ) { $items[] = $item->get_name(); }
            $orders[] = array(
                'id'     => (string) $order->get_id(),
                'date'   => $order->get_date_created()->date( 'Y-m-d' ),
                'status' => ucfirst( $order->get_status() ),
                'total'  => '$' . number_format( $order->get_total(), 2 ),
                'item'   => implode( ', ', $items )
            );
        }
    } else {
        $orders = array(
            array(
                'id'     => '101',
                'date'   => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
                'status' => 'Completed',
                'total'  => '$499.00',
                'item'   => 'Lotus Club Annual Membership'
            )
        );
    }

    return Wellness_API_Response::success( $orders );
}

function wlc_api_get_payments( $request ) {
    return Wellness_API_Response::success( array(
        array(
            'id'     => 'pay_101',
            'date'   => date( 'Y-m-d', strtotime( '-2 weeks' ) ),
            'amount' => '$499.00',
            'status' => 'Successful',
            'method' => 'Stripe Credit Card'
        )
    ) );
}

/**
 * Create custom contact form submission tables if they do not exist
 */
function wlc_api_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    $tables = array(
        $wpdb->prefix . 'wlc_contacts',
        $wpdb->prefix . 'contact_messages',
        $wpdb->prefix . 'inquiries',
        $wpdb->prefix . 'contact',
        $wpdb->prefix . 'agb_contacts'
    );

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    foreach ( $tables as $table_name ) {
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            first_name varchar(100) DEFAULT '',
            last_name varchar(100) DEFAULT '',
            email varchar(100) NOT NULL,
            phone varchar(50) DEFAULT '',
            message text NOT NULL,
            ip_address varchar(45) DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        dbDelta( $sql );
    }
}
add_action( 'init', 'wlc_api_create_tables' );

/**
 * Handle custom contact form submission REST API endpoint
 */
function wlc_api_submit_contact( $request ) {
    $params = $request->get_json_params();
    if ( empty( $params ) ) {
        $params = $request->get_body_params();
    }

    $first_name = isset( $params['first_name'] ) ? sanitize_text_field( $params['first_name'] ) : '';
    $last_name  = isset( $params['last_name'] ) ? sanitize_text_field( $params['last_name'] ) : '';
    $email      = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
    $phone      = isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '';
    $message    = isset( $params['message'] ) ? sanitize_textarea_field( $params['message'] ) : '';

    if ( empty( $email ) || empty( $message ) ) {
        return Wellness_API_Response::error( 'missing_fields', 'Email and message are required.', 400 );
    }

    if ( ! is_email( $email ) ) {
        return Wellness_API_Response::error( 'invalid_email', 'Enter a valid email address.', 400 );
    }

    global $wpdb;
    $tables = array(
        $wpdb->prefix . 'wlc_contacts',
        $wpdb->prefix . 'contact_messages',
        $wpdb->prefix . 'inquiries',
        $wpdb->prefix . 'contact',
        $wpdb->prefix . 'agb_contacts'
    );
    $ip_address = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '';

    $success = false;
    foreach ( $tables as $table_name ) {
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_name}'" ) === $table_name ) {
            $inserted = $wpdb->insert(
                $table_name,
                array(
                    'first_name' => $first_name,
                    'last_name'  => $last_name,
                    'email'      => $email,
                    'phone'      => $phone,
                    'message'    => $message,
                    'ip_address' => $ip_address,
                    'created_at' => current_time( 'mysql' )
                ),
                array( '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
            );
            if ( $inserted ) {
                $success = true;
            }
        }
    }

    // Send admin notification email
    $admin_email = get_option( 'admin_email' );
    $subject     = 'New Headless Contact Submission | Wellness Lovers Club';
    $email_body  = "You received a new submission:\n\n";
    $email_body .= "Name: {$first_name} {$last_name}\n";
    $email_body .= "Email: {$email}\n";
    $email_body .= "Phone: {$phone}\n";
    $email_body .= "Message:\n{$message}\n";

    wp_mail( $admin_email, $subject, $email_body );

    return Wellness_API_Response::success( array(
        'success' => true,
        'message' => 'Your message has been successfully received.'
    ), 200 );
}

<?php
namespace AntigravityB\API\Includes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Response {

    /**
     * Format REST Success Responses
     */
    public static function success( $data = array(), $status = 200 ) {
        return new \WP_REST_Response( $data, $status );
    }

    /**
     * Format REST Error Responses
     */
    public static function error( $code = 'error', $message = 'An error occurred', $status = 400, $additional_data = array() ) {
        $error_data = array( 'status' => $status );
        if ( ! empty( $additional_data ) ) {
            $error_data['data'] = $additional_data;
        }
        return new \WP_Error( $code, $message, $error_data );
    }
}

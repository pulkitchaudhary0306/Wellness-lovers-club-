<?php
/**
 * Security and authentication checker class.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Security {

    /**
     * Ensure the request has a valid logged-in user
     */
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

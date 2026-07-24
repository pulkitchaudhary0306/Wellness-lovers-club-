<?php
/**
 * Profile REST controller.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Profile {

    /**
     * Register endpoints
     */
    public function register_routes( $namespace ) {
        register_rest_route( $namespace, '/profile', array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'get_profile' ),
                'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
            ),
            array(
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => array( $this, 'update_profile' ),
                'permission_callback' => array( 'Wellness_API_Security', 'check_auth' ),
            )
        ) );
    }

    /**
     * Fetch user profile
     */
    public function get_profile( $request ) {
        $user_id = get_current_user_id();
        $user = get_userdata( $user_id );

        if ( ! $user ) {
            return Wellness_API_Response::error( 'user_not_found', 'User data could not be retrieved.', 404 );
        }

        // Retrieve custom user meta
        $phone = wlc_get_user_meta( $user_id, 'phone' );
        $profession = wlc_get_user_meta( $user_id, 'profession' );
        $company_name = wlc_get_user_meta( $user_id, 'companyName' );
        $address = wlc_get_user_meta( $user_id, 'correspondenceAddress' );
        $preferences = wlc_get_user_meta( $user_id, 'preferences' );
        $membership_status = wlc_get_user_meta( $user_id, 'membershipStatus' );
        $membership_tier = wlc_get_user_meta( $user_id, 'membershipTier' );

        // Default fallbacks
        if ( empty( $membership_status ) ) {
            $membership_status = 'Inactive';
        }
        if ( empty( $membership_tier ) ) {
            $membership_tier = 'Lotus Club';
        }

        $response_data = array(
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
        );

        return Wellness_API_Response::success( $response_data );
    }

    /**
     * Update user profile
     */
    public function update_profile( $request ) {
        $user_id = get_current_user_id();
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $user_data = array( 'ID' => $user_id );

        // Update core fields if provided
        if ( isset( $params['firstName'] ) ) {
            $user_data['first_name'] = sanitize_text_field( $params['firstName'] );
        }
        if ( isset( $params['lastName'] ) ) {
            $user_data['last_name'] = sanitize_text_field( $params['lastName'] );
        }
        if ( isset( $params['email'] ) ) {
            $email = sanitize_email( $params['email'] );
            if ( is_email( $email ) ) {
                // Check if email belongs to someone else
                $existing_user_id = email_exists( $email );
                if ( $existing_user_id && $existing_user_id !== $user_id ) {
                    return Wellness_API_Response::error( 'email_exists', 'This email is already in use by another user.', 400 );
                }
                $user_data['user_email'] = $email;
            } else {
                return Wellness_API_Response::error( 'invalid_email', 'Invalid email address provided.', 400 );
            }
        }

        if ( count( $user_data ) > 1 ) {
            wp_update_user( $user_data );
        }

        // Update custom metadata if provided
        if ( isset( $params['phone'] ) ) {
            wlc_update_user_meta( $user_id, 'phone', sanitize_text_field( $params['phone'] ) );
        }
        if ( isset( $params['profession'] ) ) {
            wlc_update_user_meta( $user_id, 'profession', sanitize_text_field( $params['profession'] ) );
        }
        if ( isset( $params['companyName'] ) ) {
            wlc_update_user_meta( $user_id, 'companyName', sanitize_text_field( $params['companyName'] ) );
        }
        if ( isset( $params['address'] ) ) {
            wlc_update_user_meta( $user_id, 'correspondenceAddress', sanitize_textarea_field( $params['address'] ) );
        }
        if ( isset( $params['preferences'] ) ) {
            wlc_update_user_meta( $user_id, 'preferences', (array) $params['preferences'] );
        }

        // Return updated profile details
        return $this->get_profile( $request );
    }
}

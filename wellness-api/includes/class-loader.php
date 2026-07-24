<?php
/**
 * Plugin loader and REST API router class.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Wellness_API_Loader {

    /**
     * List of core classes to load
     */
    private $classes = array(
        'security',
        'validator',
        'response',
        'auth',
        'register',
        'profile',
        'password',
        'membership',
        'orders',
        'payments'
    );

    /**
     * Initialize loading and hooks
     */
    public function run() {
        foreach ( $this->classes as $class ) {
            $filepath = WELLNESS_API_PATH . 'includes/class-' . $class . '.php';
            if ( file_exists( $filepath ) ) {
                require_once $filepath;
            }
        }

        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
    }

    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        $namespace = 'custom/v1';

        $controllers = array(
            'Wellness_API_Auth',
            'Wellness_API_Register',
            'Wellness_API_Profile',
            'Wellness_API_Password',
            'Wellness_API_Membership',
            'Wellness_API_Orders',
            'Wellness_API_Payments'
        );

        foreach ( $controllers as $controller_class ) {
            if ( class_exists( $controller_class ) ) {
                $controller = new $controller_class();
                if ( method_exists( $controller, 'register_routes' ) ) {
                    $controller->register_routes( $namespace );
                }
            }
        }
    }
}

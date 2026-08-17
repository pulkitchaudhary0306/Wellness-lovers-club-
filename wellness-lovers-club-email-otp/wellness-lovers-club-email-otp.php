<?php
/**
 * Plugin Name:       Wellness Lovers Club — Email OTP Verification
 * Plugin URI:        https://wellnessloversclub.com
 * Description:       Production-grade, cryptographically secure Email OTP verification backend for Wellness Lovers Club using Brevo HTTPS Transactional Email API.
 * Version:           1.0.0
 * Author:            Wellness Lovers Club Engineering
 * Author URI:        https://wellnessloversclub.com
 * License:           Proprietary
 * Text Domain:       wlc-email-otp
 * Requires at least: 5.8
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Plugin Constants
define( 'WLC_EMAIL_OTP_VERSION', '1.0.0' );
define( 'WLC_EMAIL_OTP_PATH', plugin_dir_path( __FILE__ ) );
define( 'WLC_EMAIL_OTP_URL', plugin_dir_url( __FILE__ ) );

// Load includes
require_once WLC_EMAIL_OTP_PATH . 'includes/class-database.php';
require_once WLC_EMAIL_OTP_PATH . 'includes/class-otp.php';
require_once WLC_EMAIL_OTP_PATH . 'includes/class-email.php';
require_once WLC_EMAIL_OTP_PATH . 'includes/class-rest-api.php';

/**
 * Main Plugin Bootstrap Class
 */
class WLC_Email_OTP_Plugin {

    /**
     * Singleton instance
     */
    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Register activation and deactivation hooks
        register_activation_hook( __FILE__, array( 'WLC_Email_OTP_Database', 'create_tables' ) );

        // Initialize REST API endpoints
        add_action( 'rest_api_init', array( 'WLC_Email_OTP_REST_API', 'register_routes' ) );

        // Handle CORS headers for Next.js frontend
        add_action( 'rest_api_init', array( 'WLC_Email_OTP_REST_API', 'init_cors' ), 15 );
    }
}

// Instantiate plugin
WLC_Email_OTP_Plugin::get_instance();

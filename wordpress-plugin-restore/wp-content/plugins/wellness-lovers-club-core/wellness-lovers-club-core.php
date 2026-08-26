

<?php
/**
 * Plugin Name: Wellness Lovers Club Core
 * Description: Clean, secure, and unified backend logic for Wellness Lovers Club. Handles authentication (JWT), custom registration, OTP email verification, contact forms, and admin database reporting.
 * Version:     1.0.0
 * Author:      Wellness Lovers Club Core Team
 * License:     GPL-2.0+
 * Text Domain: wlc-core
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Define Constants
define( 'WLC_CORE_VERSION', '1.0.0' );
define( 'WLC_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'WLC_CORE_URL', plugin_dir_url( __FILE__ ) );

// Load Helper & Utility Files (Logger MUST be loaded first)
require_once WLC_CORE_PATH . 'includes/class-logger.php';
require_once WLC_CORE_PATH . 'includes/class-db.php';
require_once WLC_CORE_PATH . 'includes/class-jwt.php';
require_once WLC_CORE_PATH . 'includes/class-rate-limiter.php';
require_once WLC_CORE_PATH . 'includes/class-sms.php';
require_once WLC_CORE_PATH . 'includes/class-emails.php';
require_once WLC_CORE_PATH . 'includes/class-auth-controller.php';
require_once WLC_CORE_PATH . 'includes/class-payment-controller.php';
require_once WLC_CORE_PATH . 'includes/class-profile-controller.php';
require_once WLC_CORE_PATH . 'includes/class-contact-controller.php';
require_once WLC_CORE_PATH . 'includes/class-newsletter-controller.php';
require_once WLC_CORE_PATH . 'includes/class-privileges-controller.php';
require_once WLC_CORE_PATH . 'includes/class-router.php';
require_once WLC_CORE_PATH . 'includes/class-admin.php';
require_once WLC_CORE_PATH . 'wlc-backend-fix.php';

// Load SMTP Module Files
require_once WLC_CORE_PATH . 'includes/class-email-security.php';
require_once WLC_CORE_PATH . 'includes/class-email-settings.php';
require_once WLC_CORE_PATH . 'includes/class-smtp.php';
require_once WLC_CORE_PATH . 'includes/class-email-logs.php';
require_once WLC_CORE_PATH . 'includes/class-email-queue.php';
require_once WLC_CORE_PATH . 'includes/class-email-test.php';

// Load Brevo HTTPS API Email OTP Module
require_once WLC_CORE_PATH . 'includes/class-otp-database.php';
require_once WLC_CORE_PATH . 'includes/class-brevo-email.php';
require_once WLC_CORE_PATH . 'includes/class-otp-controller.php';

// Bootstrap the Plugin
class Wellness_Lovers_Club_Core {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Initialize hooks
        add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
    }

    public function init_plugin() {
        // Initialize controllers and loaders
        WLC_Core_Db::get_instance();
        WLC_Core_Router::get_instance();
        WLC_Core_Admin::get_instance();

        // Initialize Brevo Email OTP Controller & Database
        WLC_OTP_Controller::get_instance();
        WLC_OTP_Database::create_table();

        // Initialize SMTP module engines only if custom SMTP is not disabled
        if ( ! defined( 'WLC_DISABLE_CUSTOM_SMTP' ) || ! WLC_DISABLE_CUSTOM_SMTP ) {
            WLC_Core_Smtp::get_instance();
        }
        WLC_Core_Email_Logs::get_instance();
        WLC_Core_Email_Queue::init();
    }
}

// Initialize the plugin instance
Wellness_Lovers_Club_Core::get_instance();

// Register Activation and Deactivation Hooks
register_activation_hook( __FILE__, function() {
    WLC_Core_Db::activate();
    WLC_OTP_Database::create_table();
    WLC_Core_Email_Queue::register_cron();
} );

register_deactivation_hook( __FILE__, function() {
    WLC_Core_Db::deactivate();
    WLC_Core_Email_Queue::clear_cron();
} );

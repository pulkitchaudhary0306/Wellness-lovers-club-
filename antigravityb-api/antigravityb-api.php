<?php
/**
 * Plugin Name: AntigravityB CMS Backend
 * Description: High-performance, production-ready headless WordPress REST API plugin with CORS, JWT authentication, dynamic Custom Post Types, and built-in contact form/newsletter endpoints.
 * Version: 1.0.0
 * Author: Antigravity Team
 * License: GPLv2 or later
 * Text Domain: antigravityb-api
 * Requires PHP: 8.2
 * Requires at least: 6.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Define Plugin Constants
define( 'AGB_API_VERSION', '1.0.0' );
define( 'AGB_API_FILE', __FILE__ );
define( 'AGB_API_PATH', plugin_dir_path( __FILE__ ) );
define( 'AGB_API_URL', plugin_dir_url( __FILE__ ) );

// Load PSR-4 Autoloader
require_once AGB_API_PATH . 'includes/class-autoloader.php';

// Bootstrap the Plugin
add_action( 'plugins_loaded', function() {
    \AntigravityB\API\Includes\Plugin::get_instance();
} );

// Register Activation and Deactivation Hooks
register_activation_hook( __FILE__, array( '\AntigravityB\API\Includes\Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( '\AntigravityB\API\Includes\Plugin', 'deactivate' ) );

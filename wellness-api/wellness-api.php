<?php
/**
 * Plugin Name: Wellness API Custom Endpoints
 * Description: Custom REST API endpoints for Wellness Lovers Club integration. Handles custom registration, profile meta, orders, memberships, and password flows.
 * Version:     1.0.0
 * Author:      Wellness Lovers Club
 * License:     GPL-2.0+
 * Text Domain: wellness-api
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define Plugin Constants
define( 'WELLNESS_API_VERSION', '1.0.0' );
define( 'WELLNESS_API_PATH', plugin_dir_path( __FILE__ ) );
define( 'WELLNESS_API_URL', plugin_dir_url( __FILE__ ) );

// Load core helpers & loader
require_once WELLNESS_API_PATH . 'includes/helpers.php';
require_once WELLNESS_API_PATH . 'includes/class-loader.php';

/**
 * Run the plugin loader on plugins_loaded hook.
 */
function run_wellness_api() {
    $loader = new Wellness_API_Loader();
    $loader->run();
}
add_action( 'plugins_loaded', 'run_wellness_api' );

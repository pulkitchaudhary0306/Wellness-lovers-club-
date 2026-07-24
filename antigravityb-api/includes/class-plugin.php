<?php
namespace AntigravityB\API\Includes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use AntigravityB\API\Middleware\Cors;
use AntigravityB\API\Routes\Router;

class Plugin {

    /**
     * Singleton instance
     */
    private static $instance = null;

    /**
     * Get class instance
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init();
    }

    /**
     * Initialize plugin components
     */
    private function init() {
        // Load CORS and preflight handling early
        Cors::get_instance();

        // Initialize Router
        Router::get_instance();
    }

    /**
     * Plugin activation routine
     */
    public static function activate() {
        // Create database tables
        Db::create_tables();

        // Flush rewrite rules for CPTs
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation routine
     */
    public static function deactivate() {
        flush_rewrite_rules();
    }
}

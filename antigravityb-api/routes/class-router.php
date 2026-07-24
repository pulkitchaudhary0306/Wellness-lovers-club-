<?php
namespace AntigravityB\API\Routes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use AntigravityB\API\Middleware\Auth;
use AntigravityB\API\Controllers\AuthController;
use AntigravityB\API\Controllers\ProfileController;
use AntigravityB\API\Controllers\ContentController;
use AntigravityB\API\Controllers\CptController;
use AntigravityB\API\Controllers\ContactController;
use AntigravityB\API\Controllers\NewsletterController;
use AntigravityB\API\Controllers\MediaController;
use AntigravityB\API\Controllers\DashboardController;

class Router {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    /**
     * Register REST API routes under the agb/v1 namespace
     */
    public function register_routes() {
        $namespaces = array( 'agb/v1', 'custom/v1' );

        // Controllers instances
        $auth       = new AuthController();
        $profile    = new ProfileController();
        $content    = new ContentController();
        $cpt        = new CptController();
        $contact    = new ContactController();
        $newsletter = new NewsletterController();
        $media      = new MediaController();
        $dashboard  = new DashboardController();

        // ─── 0. Fallback JWT token endpoints ──────────────────────────────────
        register_rest_route( 'jwt-auth/v1', '/token', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'login' ),
            'permission_callback' => '__return_true',
        ) );
        register_rest_route( 'jwt-auth/v1', '/token/validate', array(
            'methods'             => 'POST',
            'callback'            => array( $auth, 'verify_token' ),
            'permission_callback' => '__return_true',
        ) );

        foreach ( $namespaces as $namespace ) {
            // ─── 1. Authentication Endpoints ─────────────────────────────────────
            
            register_rest_route( $namespace, '/login', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'login' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/register', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'register' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/logout', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'logout' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            register_rest_route( $namespace, '/forgot-password', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'forgot_password' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/reset-password', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'reset_password' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/verify-email', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'verify_email' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/refresh-token', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'refresh_token' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            register_rest_route( $namespace, '/verify-token', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'verify_token' ),
                'permission_callback' => '__return_true',
            ) );

            // ─── 2. Profile Endpoints ────────────────────────────────────────────
            
            register_rest_route( $namespace, '/profile', array(
                array(
                    'methods'             => 'GET',
                    'callback'            => array( $profile, 'get_profile' ),
                    'permission_callback' => array( $this, 'require_auth' ),
                ),
                array(
                    'methods'             => 'PUT',
                    'callback'            => array( $profile, 'update_profile' ),
                    'permission_callback' => array( $this, 'require_auth' ),
                )
            ) );

            register_rest_route( $namespace, '/change-password', array(
                'methods'             => 'POST',
                'callback'            => array( $auth, 'change_password' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            register_rest_route( $namespace, '/membership', array(
                'methods'             => 'GET',
                'callback'            => array( $profile, 'get_membership' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            register_rest_route( $namespace, '/orders', array(
                'methods'             => 'GET',
                'callback'            => array( $profile, 'get_orders' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            register_rest_route( $namespace, '/payments', array(
                'methods'             => 'GET',
                'callback'            => array( $profile, 'get_payments' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            // ─── 3. Content Endpoints ────────────────────────────────────────────
            
            register_rest_route( $namespace, '/posts', array(
                'methods'             => 'GET',
                'callback'            => array( $content, 'get_posts' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/pages', array(
                'methods'             => 'GET',
                'callback'            => array( $content, 'get_pages' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/categories', array(
                'methods'             => 'GET',
                'callback'            => array( $content, 'get_categories' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/tags', array(
                'methods'             => 'GET',
                'callback'            => array( $content, 'get_tags' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/menus', array(
                'methods'             => 'GET',
                'callback'            => array( $content, 'get_menus' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/settings', array(
                'methods'             => 'GET',
                'callback'            => array( $content, 'get_settings' ),
                'permission_callback' => array( $this, 'require_admin' ),
            ) );

            // ─── 4. Custom Post Types ────────────────────────────────────────────
            
            register_rest_route( $namespace, '/cpt', array(
                'methods'             => 'GET',
                'callback'            => array( $cpt, 'get_cpt_items' ),
                'permission_callback' => '__return_true',
            ) );

            // ─── 5. Integrations & Form Submission Endpoints ─────────────────────
            
            register_rest_route( $namespace, '/contact', array(
                'methods'             => 'POST',
                'callback'            => array( $contact, 'submit_contact' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/newsletter', array(
                'methods'             => 'POST',
                'callback'            => array( $newsletter, 'subscribe' ),
                'permission_callback' => '__return_true',
            ) );

            register_rest_route( $namespace, '/newsletter/export', array(
                'methods'             => 'GET',
                'callback'            => array( $newsletter, 'export_subscribers' ),
                'permission_callback' => array( $this, 'require_admin' ),
            ) );

            // ─── 6. Media Endpoints ──────────────────────────────────────────────
            
            register_rest_route( $namespace, '/media', array(
                'methods'             => 'POST',
                'callback'            => array( $media, 'upload_media' ),
                'permission_callback' => array( $this, 'require_auth' ),
            ) );

            // ─── 7. System Diagnostics & Dashboard Endpoints ──────────────────────
            
            register_rest_route( $namespace, '/dashboard/stats', array(
                'methods'             => 'GET',
                'callback'            => array( $dashboard, 'get_stats' ),
                'permission_callback' => array( $this, 'require_admin' ),
            ) );
        }

    /**
     * Middleware check: User is logged in
     */
    public function require_auth() {
        return Auth::check_auth();
    }

    /**
     * Middleware check: User is administrator
     */
    public function require_admin() {
        return Auth::check_admin();
    }
}

<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class CptController {

    public function __construct() {
        // Register post types
        add_action( 'init', array( $this, 'register_custom_post_types' ) );
    }

    /**
     * Register Dynamic Custom Post Types
     */
    public function register_custom_post_types() {
        $cpts = array(
            'projects'     => 'Project',
            'services'     => 'Service',
            'testimonials' => 'Testimonial',
            'careers'      => 'Career',
            'events'       => 'Event',
            'faqs'         => 'FAQ',
            'portfolio'    => 'Portfolio'
        );

        foreach ( $cpts as $slug => $label ) {
            $plural = $label . 's';
            if ( $slug === 'faqs' ) { $plural = 'FAQs'; }

            register_post_type( $slug, array(
                'labels' => array(
                    'name'          => $plural,
                    'singular_name' => $label,
                ),
                'public'       => true,
                'has_archive'  => true,
                'show_in_rest' => true, // Enables default REST endpoints
                'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' )
            ) );
        }
    }

    /**
     * Query dynamic CPT endpoints
     */
    public function get_cpt_items( \WP_REST_Request $request ) {
        $post_type = $request->get_param( 'post_type' ) ? sanitize_text_field( $request->get_param( 'post_type' ) ) : 'projects';
        $page      = $request->get_param( 'page' ) ? intval( $request->get_param( 'page' ) ) : 1;
        $per_page  = $request->get_param( 'perPage' ) ? intval( $request->get_param( 'perPage' ) ) : 10;
        $search    = $request->get_param( 'search' ) ? sanitize_text_field( $request->get_param( 'search' ) ) : '';

        // Validate allowed CPTs
        $allowed = array( 'projects', 'services', 'testimonials', 'careers', 'events', 'faqs', 'portfolio' );
        if ( ! in_array( $post_type, $allowed, true ) ) {
            return new \WP_Error( 'invalid_post_type', 'Invalid post type specified.', array( 'status' => 400 ) );
        }

        $args = array(
            'post_type'      => $post_type,
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'post_status'    => 'publish'
        );

        if ( ! empty( $search ) ) {
            $args['s'] = $search;
        }

        $query = new \WP_Query( $args );
        $items = array();

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $post_id = get_the_ID();
                $items[] = array(
                    'id'            => $post_id,
                    'title'         => get_the_title(),
                    'slug'          => get_post_field( 'post_name', $post_id ),
                    'excerpt'       => get_the_excerpt(),
                    'content'       => get_the_content(),
                    'date'          => get_the_date( 'c' ),
                    'featuredImage' => get_the_post_thumbnail_url( $post_id, 'large' ),
                    'meta'          => get_post_meta( $post_id )
                );
            }
            wp_reset_postdata();
        }

        return new \WP_REST_Response( array(
            'items'      => $items,
            'total'      => intval( $query->found_posts ),
            'totalPages' => intval( $query->max_num_pages ),
            'page'       => $page,
            'perPage'    => $per_page
        ), 200 );
    }
}
// Trigger registration immediately
new CptController();

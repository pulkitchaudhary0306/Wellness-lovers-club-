<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class ContentController {

    /**
     * Get posts endpoint with pagination, sorting, search, and filtering
     */
    public function get_posts( \WP_REST_Request $request ) {
        $page     = $request->get_param( 'page' ) ? intval( $request->get_param( 'page' ) ) : 1;
        $per_page = $request->get_param( 'perPage' ) ? intval( $request->get_param( 'perPage' ) ) : 10;
        $search   = $request->get_param( 'search' ) ? sanitize_text_field( $request->get_param( 'search' ) ) : '';
        $orderby  = $request->get_param( 'orderby' ) ? sanitize_text_field( $request->get_param( 'orderby' ) ) : 'date';
        $order    = $request->get_param( 'order' ) ? sanitize_text_field( $request->get_param( 'order' ) ) : 'desc';
        $status   = $request->get_param( 'status' ) ? sanitize_text_field( $request->get_param( 'status' ) ) : 'publish';
        $category = $request->get_param( 'category' ) ? sanitize_text_field( $request->get_param( 'category' ) ) : '';

        // Transient cache key construction
        $cache_key = 'agb_posts_p' . $page . '_l' . $per_page . '_s' . md5( $search . $orderby . $order . $status . $category );
        $cached    = get_transient( $cache_key );

        if ( false !== $cached ) {
            return new \WP_REST_Response( $cached, 200 );
        }

        $args = array(
            'post_type'      => 'post',
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'orderby'        => $orderby,
            'order'          => $order,
            'post_status'    => $status,
        );

        if ( ! empty( $search ) ) {
            $args['s'] = $search;
        }

        if ( ! empty( $category ) ) {
            $args['category_name'] = $category;
        }

        $query = new \WP_Query( $args );
        $posts = array();

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $post_id = get_the_ID();
                
                $posts[] = array(
                    'id'            => $post_id,
                    'title'         => get_the_title(),
                    'slug'          => get_post_field( 'post_name', $post_id ),
                    'excerpt'       => get_the_excerpt(),
                    'content'       => get_the_content(),
                    'date'          => get_the_date( 'c' ),
                    'modified'      => get_the_modified_date( 'c' ),
                    'author'        => array(
                        'id'   => get_the_author_meta( 'ID' ),
                        'name' => get_the_author()
                    ),
                    'categories'    => wp_get_post_categories( $post_id, array( 'fields' => 'names' ) ),
                    'tags'          => wp_get_post_tags( $post_id, array( 'fields' => 'names' ) ),
                    'featuredImage' => get_the_post_thumbnail_url( $post_id, 'large' ),
                    'seoMeta'       => array(
                        'title'       => get_post_meta( $post_id, '_yoast_wpseo_title', true ) ?: get_the_title(),
                        'description' => get_post_meta( $post_id, '_yoast_wpseo_metadesc', true ) ?: get_the_excerpt()
                    )
                );
            }
            wp_reset_postdata();
        }

        $response_data = array(
            'items'      => $posts,
            'total'      => intval( $query->found_posts ),
            'totalPages' => intval( $query->max_num_pages ),
            'page'       => $page,
            'perPage'    => $per_page
        );

        // Cache response for 10 minutes
        set_transient( $cache_key, $response_data, 600 );

        return new \WP_REST_Response( $response_data, 200 );
    }

    /**
     * Get pages endpoint
     */
    public function get_pages( \WP_REST_Request $request ) {
        $page     = $request->get_param( 'page' ) ? intval( $request->get_param( 'page' ) ) : 1;
        $per_page = $request->get_param( 'perPage' ) ? intval( $request->get_param( 'perPage' ) ) : 10;
        $search   = $request->get_param( 'search' ) ? sanitize_text_field( $request->get_param( 'search' ) ) : '';

        $args = array(
            'post_type'      => 'page',
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'post_status'    => 'publish'
        );

        if ( ! empty( $search ) ) {
            $args['s'] = $search;
        }

        $query = new \WP_Query( $args );
        $pages = array();

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $post_id = get_the_ID();
                $pages[] = array(
                    'id'            => $post_id,
                    'title'         => get_the_title(),
                    'slug'          => get_post_field( 'post_name', $post_id ),
                    'content'       => get_the_content(),
                    'date'          => get_the_date( 'c' ),
                    'featuredImage' => get_the_post_thumbnail_url( $post_id, 'large' )
                );
            }
            wp_reset_postdata();
        }

        return new \WP_REST_Response( array(
            'items'      => $pages,
            'total'      => intval( $query->found_posts ),
            'totalPages' => intval( $query->max_num_pages ),
            'page'       => $page,
            'perPage'    => $per_page
        ), 200 );
    }

    /**
     * Get categories list
     */
    public function get_categories( \WP_REST_Request $request ) {
        $categories = get_categories( array( 'hide_empty' => false ) );
        $data       = array();
        foreach ( $categories as $cat ) {
            $data[] = array(
                'id'          => $cat->term_id,
                'name'        => $cat->name,
                'slug'        => $cat->slug,
                'description' => $cat->description,
                'count'       => $cat->count
            );
        }
        return new \WP_REST_Response( $data, 200 );
    }

    /**
     * Get tags list
     */
    public function get_tags( \WP_REST_Request $request ) {
        $tags = get_tags( array( 'hide_empty' => false ) );
        $data = array();
        foreach ( $tags as $tag ) {
            $data[] = array(
                'id'          => $tag->term_id,
                'name'        => $tag->name,
                'slug'        => $tag->slug,
                'description' => $tag->description,
                'count'       => $tag->count
            );
        }
        return new \WP_REST_Response( $data, 200 );
    }

    /**
     * Get custom menus
     */
    public function get_menus( \WP_REST_Request $request ) {
        $menus = wp_get_nav_menus();
        $data  = array();
        foreach ( $menus as $menu ) {
            $items = wp_get_nav_menu_items( $menu->term_id );
            $menu_items = array();
            if ( $items ) {
                foreach ( $items as $item ) {
                    $menu_items[] = array(
                        'id'       => $item->ID,
                        'title'    => $item->title,
                        'url'      => $item->url,
                        'parentId' => intval( $item->menu_item_parent )
                    );
                }
            }
            $data[] = array(
                'id'    => $menu->term_id,
                'name'  => $menu->name,
                'slug'  => $menu->slug,
                'items' => $menu_items
            );
        }
        return new \WP_REST_Response( $data, 200 );
    }

    /**
     * Get general settings
     */
    public function get_settings( \WP_REST_Request $request ) {
        return new \WP_REST_Response( array(
            'siteTitle'       => get_option( 'blogname' ),
            'siteDescription' => get_option( 'blogdescription' ),
            'siteUrl'         => get_option( 'siteurl' ),
            'adminEmail'      => get_option( 'admin_email' ),
            'language'        => get_option( 'WPLANG' ) ?: 'en_US',
            'postsPerPage'    => intval( get_option( 'posts_per_page' ) )
        ), 200 );
    }
}

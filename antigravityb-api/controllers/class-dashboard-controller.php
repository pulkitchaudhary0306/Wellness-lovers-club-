<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class DashboardController {

    /**
     * Get system and database statistics
     */
    public function get_stats( \WP_REST_Request $request ) {
        global $wpdb;

        // 1. Post counts
        $posts_count = wp_count_posts( 'post' );
        $pages_count = wp_count_posts( 'page' );

        // 2. Media items count
        $media_count = wp_count_attachments();

        // 3. User counts
        $users_count = count_users();

        // 4. Comments count
        $comments_count = wp_count_comments();

        // 5. Contact form submission count
        $table_contacts = $wpdb->prefix . 'agb_contacts';
        $contacts_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_contacts}'" ) === $table_contacts ) {
            $contacts_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_contacts}" ) );
        }

        // 6. Newsletter subscribers count
        $table_news = $wpdb->prefix . 'agb_newsletter';
        $news_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_news}'" ) === $table_news ) {
            $news_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_news} WHERE status = 'Active'" ) );
        }

        // 7. Recent activity query
        $recent_posts = get_posts( array(
            'numberposts' => 5,
            'post_status' => 'publish'
        ) );
        $posts_activity = array();
        foreach ( $recent_posts as $post ) {
            $posts_activity[] = array(
                'id'    => $post->ID,
                'title' => $post->post_title,
                'date'  => $post->post_date
            );
        }

        return new \WP_REST_Response( array(
            'statistics' => array(
                'posts'       => intval( $posts_count->publish ),
                'pages'       => intval( $pages_count->publish ),
                'media'       => intval( $media_count->inherit ),
                'users'       => intval( $users_count['total_users'] ),
                'comments'    => intval( $comments_count->approved ),
                'contacts'    => $contacts_count,
                'subscribers' => $news_count
            ),
            'recentActivity' => array(
                'posts' => $posts_activity
            )
        ), 200 );
    }
}

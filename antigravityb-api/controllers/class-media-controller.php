<?php
namespace AntigravityB\API\Controllers;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class MediaController {

    /**
     * Upload media file to WordPress library
     */
    public function upload_media( \WP_REST_Request $request ) {
        // Enforce user capability to upload files
        if ( ! current_user_can( 'upload_files' ) ) {
            return new \WP_Error( 'rest_forbidden', 'You do not have permission to upload files.', array( 'status' => 403 ) );
        }

        $files = $request->get_file_params();
        if ( empty( $files ) || ! isset( $files['file'] ) ) {
            return new \WP_Error( 'missing_file', 'No file was submitted.', array( 'status' => 400 ) );
        }

        $file = $files['file'];

        // 1. File Size Validation (Max 5MB)
        $max_size = 5 * 1024 * 1024; // 5MB
        if ( $file['size'] > $max_size ) {
            return new \WP_Error( 'file_too_large', 'File size exceeds maximum limit of 5MB.', array( 'status' => 400 ) );
        }

        // 2. MIME Type Validation (Images & PDFs only)
        $allowed_mimes = array(
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf'
        );

        $file_type = wp_check_filetype( basename( $file['name'] ) );
        if ( ! in_array( $file['type'], $allowed_mimes, true ) || ! in_array( $file_type['type'], $allowed_mimes, true ) ) {
            return new \WP_Error( 'invalid_file_type', 'Allowed file types are JPEG, PNG, GIF, WEBP, and PDF.', array( 'status' => 400 ) );
        }

        // Handle upload using WordPress native handlers
        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';

        $upload_overrides = array( 'test_form' => false );
        $moved_file       = wp_handle_upload( $file, $upload_overrides );

        if ( isset( $moved_file['error'] ) ) {
            return new \WP_Error( 'upload_error', $moved_file['error'], array( 'status' => 500 ) );
        }

        // Insert attachment into WordPress database
        $attachment = array(
            'guid'           => $moved_file['url'],
            'post_mime_type' => $moved_file['type'],
            'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $file['name'] ) ),
            'post_content'   => '',
            'post_status'    => 'inherit'
        );

        $attachment_id = wp_insert_attachment( $attachment, $moved_file['file'] );
        if ( is_wp_error( $attachment_id ) ) {
            return new \WP_Error( 'attachment_failed', $attachment_id->get_error_message(), array( 'status' => 500 ) );
        }

        // Generate thumbnails and metadata
        $attach_data = wp_generate_attachment_metadata( $attachment_id, $moved_file['file'] );
        wp_update_attachment_metadata( $attachment_id, $attach_data );

        // Extract thumbnail URLs
        $sizes = array();
        if ( ! empty( $attach_data['sizes'] ) ) {
            foreach ( $attach_data['sizes'] as $size_name => $size_info ) {
                $sizes[$size_name] = wp_get_attachment_image_url( $attachment_id, $size_name );
            }
        }

        return new \WP_REST_Response( array(
            'success'      => true,
            'attachmentId' => $attachment_id,
            'url'          => $moved_file['url'],
            'mimeType'     => $moved_file['type'],
            'sizes'        => $sizes
        ), 201 );
    }
}

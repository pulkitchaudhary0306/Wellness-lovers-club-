<?php
/**
 * WordPress Admin Dashboard Interface for WLC Core
 * Complete Customer Profile & Membership Card Administration Suite
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WLC_Core_Admin {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'admin_menu', array( $this, 'register_admin_menus' ) );
        add_action( 'admin_init', array( $this, 'handle_admin_actions' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );

        // Admin POST Action Hooks for Profile & Membership Card Editors
        add_action( 'admin_post_wlc_save_member_profile', array( $this, 'save_member_profile' ) );
        add_action( 'admin_post_wlc_save_member_card', array( $this, 'save_member_card' ) );

        // Existing SMTP & Log post action hooks
        add_action( 'admin_post_wlc_save_smtp_settings', array( $this, 'save_smtp_settings' ) );
        add_action( 'admin_post_wlc_send_test_email', array( $this, 'send_test_email' ) );
        add_action( 'admin_post_wlc_trigger_queue_process', array( $this, 'trigger_queue_process' ) );
        add_action( 'admin_post_wlc_clear_all_logs', array( $this, 'clear_all_logs' ) );
        add_action( 'admin_post_wlc_delete_log', array( $this, 'delete_log' ) );
        add_action( 'admin_post_wlc_retry_log', array( $this, 'retry_log' ) );
        add_action( 'admin_post_wlc_clear_audit_logs', array( $this, 'clear_audit_logs' ) );
    }

    /**
     * Enqueue WordPress media scripts for image picker
     */
    public function enqueue_admin_assets( $hook ) {
        if ( isset( $_GET['page'] ) && strpos( $_GET['page'], 'wlc-' ) !== false ) {
            wp_enqueue_media();
        }
    }

    /**
     * Register main menu and sub-menus in WP Admin Dashboard
     */
    public function register_admin_menus() {
        add_menu_page(
            'WLC Core',
            'WLC Core',
            'manage_options',
            'wlc-core-dashboard',
            array( $this, 'render_dashboard_page' ),
            'dashicons-smiley',
            26
        );

        add_submenu_page(
            'wlc-core-dashboard',
            'Contact Messages',
            'Contact Messages',
            'manage_options',
            'wlc-contacts',
            array( $this, 'render_contacts_page' )
        );

        add_submenu_page(
            'wlc-core-dashboard',
            'Membership Applications & Customers',
            'Memberships',
            'manage_options',
            'wlc-memberships',
            array( $this, 'render_memberships_page' )
        );

        add_submenu_page(
            'wlc-core-dashboard',
            'Payments & Orders',
            'Payments & Orders',
            'manage_options',
            'wlc-payments',
            array( $this, 'render_payments_page' )
        );

        add_submenu_page(
            'wlc-core-dashboard',
            'Email Settings',
            'Email Settings',
            'manage_options',
            'wlc-email-settings',
            array( $this, 'render_email_settings_page' )
        );

        add_submenu_page(
            'wlc-core-dashboard',
            'Email Logs',
            'Email Logs',
            'manage_options',
            'wlc-email-logs',
            array( $this, 'render_email_logs_page' )
        );

        add_submenu_page(
            'wlc-core-dashboard',
            'Audit Logs',
            'Audit Logs',
            'manage_options',
            'wlc-audit-logs',
            array( $this, 'render_audit_logs_page' )
        );
    }

    /**
     * Handle actions triggered by admin forms
     */
    public function handle_admin_actions() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // Export Memberships list to CSV
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_export_memberships' ) {
            check_admin_referer( 'wlc_export_nonce' );
            $this->export_memberships_csv();
            exit;
        }

        // Approve Membership Application
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_approve_member' && isset( $_GET['user_id'] ) ) {
            check_admin_referer( 'wlc_member_action_' . $_GET['user_id'] );
            $user_id = intval( $_GET['user_id'] );
            update_user_meta( $user_id, 'wlc_membership_status', 'Active' );
            update_user_meta( $user_id, 'membershipStatus', 'Active' );
            update_user_meta( $user_id, 'membership_status', 'Active' );

            if ( class_exists( 'WLC_Core_Logger' ) ) {
                WLC_Core_Logger::log( "Admin approved membership for user ID: {$user_id}", 'INFO' );
            }

            $user = get_userdata( $user_id );
            if ( $user && class_exists( 'WLC_Core_Emails' ) ) {
                WLC_Core_Emails::send_welcome_email( $user->user_email, $user->first_name );
            }

            wp_redirect( admin_url( 'admin.php?page=wlc-memberships&message=approved' ) );
            exit;
        }

        // Deactivate Membership Application
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_reject_member' && isset( $_GET['user_id'] ) ) {
            check_admin_referer( 'wlc_member_action_' . $_GET['user_id'] );
            $user_id = intval( $_GET['user_id'] );
            update_user_meta( $user_id, 'wlc_membership_status', 'Inactive' );
            update_user_meta( $user_id, 'membershipStatus', 'Inactive' );
            update_user_meta( $user_id, 'membership_status', 'Inactive' );

            if ( class_exists( 'WLC_Core_Logger' ) ) {
                WLC_Core_Logger::log( "Admin deactivated membership for user ID: {$user_id}", 'INFO' );
            }

            wp_redirect( admin_url( 'admin.php?page=wlc-memberships&message=rejected' ) );
            exit;
        }

        // Mark Contact Message as Read
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_read_contact' && isset( $_GET['id'] ) ) {
            check_admin_referer( 'wlc_contact_action_' . $_GET['id'] );
            global $wpdb;
            $table = $wpdb->prefix . 'wlc_contacts';
            $wpdb->update( $table, array( 'status' => 'Read' ), array( 'id' => intval( $_GET['id'] ) ), array( '%s' ), array( '%d' ) );

            wp_redirect( admin_url( 'admin.php?page=wlc-contacts&message=marked_read' ) );
            exit;
        }

        // Delete Contact Message
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_delete_contact' && isset( $_GET['id'] ) ) {
            check_admin_referer( 'wlc_contact_action_' . $_GET['id'] );
            global $wpdb;
            $table = $wpdb->prefix . 'wlc_contacts';
            $wpdb->delete( $table, array( 'id' => intval( $_GET['id'] ) ), array( '%d' ) );

            wp_redirect( admin_url( 'admin.php?page=wlc-contacts&message=deleted' ) );
            exit;
        }
    }

    /**
     * ─── 1. Main Core Dashboard Page ──────────────────────────────────────────
     */
    public function render_dashboard_page() {
        global $wpdb;
        $table_contacts = $wpdb->prefix . 'wlc_contacts';
        $table_news     = $wpdb->prefix . 'wlc_newsletter';
        $table_payments = $wpdb->prefix . 'wlc_payments';

        $contacts_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_contacts}'" ) === $table_contacts ) {
            $contacts_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_contacts}" ) );
        }
        $subscribers_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_news}'" ) === $table_news ) {
            $subscribers_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_news} WHERE status = 'Active'" ) );
        }
        $payments_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_payments}'" ) === $table_payments ) {
            $payments_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_payments} WHERE status = 'completed'" ) );
        }

        $users_query = count_users();
        $total_users = isset( $users_query['total_users'] ) ? $users_query['total_users'] : 0;
        ?>
        <div class="wrap">
            <h1>WLC Core — Management Dashboard</h1>
            <p>Unified administration interface for Wellness Lovers Club members, payments, and notifications.</p>

            <div style="display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #10b981;">
                    <h3>Total Registered Members</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #10b981;"><?php echo $total_users; ?></p>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>" class="button button-small">Manage Members &rarr;</a>
                </div>
                <div style="flex: 1; min-width: 200px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #bca374;">
                    <h3>Verified Paid Memberships</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #bca374;"><?php echo $payments_count; ?></p>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-payments' ); ?>" class="button button-small">View Payments &rarr;</a>
                </div>
                <div style="flex: 1; min-width: 200px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #f59e0b;">
                    <h3>Inbound Inquiries</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #f59e0b;"><?php echo $contacts_count; ?></p>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-contacts' ); ?>" class="button button-small">View Messages &rarr;</a>
                </div>
                <div style="flex: 1; min-width: 200px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6;">
                    <h3>Newsletter Subscribers</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #3b82f6;"><?php echo $subscribers_count; ?></p>
                </div>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 30px;">
                <h3>Recent Activity Logs</h3>
                <pre style="background: #f1f5f9; padding: 15px; border-radius: 6px; max-height: 250px; overflow-y: auto; font-family: monospace; font-size: 12px; border: 1px solid #cbd5e1;"><?php
                    $upload_dir = wp_upload_dir();
                    $log_file = path_join( $upload_dir['basedir'], 'wlc-logs/activity.log' );
                    if ( file_exists( $log_file ) ) {
                        $log_lines = file( $log_file );
                        $log_lines = array_reverse( $log_lines );
                        $recent_logs = array_slice( $log_lines, 0, 15 );
                        echo esc_html( implode( "", $recent_logs ) );
                    } else {
                        echo "No activity logs available yet.";
                    }
                ?></pre>
            </div>
        </div>
        <?php
    }

    /**
     * ─── 2. Memberships Page: List, Edit Profile, & Edit Membership Card ───────
     */
    public function render_memberships_page() {
        $action  = isset( $_GET['action'] ) ? sanitize_text_field( $_GET['action'] ) : '';
        $user_id = isset( $_GET['user_id'] ) ? intval( $_GET['user_id'] ) : 0;

        // ─────────────────────────────────────────────────────────────────────
        // VIEW A: EDIT CUSTOMER PROFILE
        // ─────────────────────────────────────────────────────────────────────
        if ( $action === 'edit_profile' && $user_id > 0 ) {
            $user = get_userdata( $user_id );
            if ( ! $user ) {
                echo '<div class="wrap"><h1>Edit Profile</h1><div class="error"><p>Member not found in database.</p></div></div>';
                return;
            }
            $card = WLC_Core_Profile_Controller::get_membership_card_data( $user_id );
            ?>
            <div class="wrap">
                <h1 class="wp-heading-inline">Edit Profile: <?php echo esc_html( $card['displayName'] ); ?> (ID #<?php echo $user_id; ?>)</h1>
                <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>" class="page-title-action">&larr; Back to Members</a>
                <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships&action=edit_card&user_id=' . $user_id ); ?>" class="page-title-action" style="margin-left: 8px;">Edit Membership Card &rarr;</a>
                <hr class="wp-header-end">

                <?php if ( isset( $_GET['message'] ) && $_GET['message'] === 'profile_saved' ) : ?>
                    <div class="updated notice is-dismissible" style="margin-top: 15px;">
                        <p><strong>Success:</strong> Customer profile information updated successfully in WordPress database.</p>
                    </div>
                <?php endif; ?>
                <?php if ( isset( $_GET['error'] ) ) : ?>
                    <div class="error notice is-dismissible" style="margin-top: 15px;">
                        <p><strong>Error:</strong> <?php echo esc_html( urldecode( $_GET['error'] ) ); ?></p>
                    </div>
                <?php endif; ?>

                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top: 20px; max-width: 800px; background: #fff; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                    <?php wp_nonce_field( 'wlc_save_member_profile_nonce', 'wlc_profile_nonce' ); ?>
                    <input type="hidden" name="action" value="wlc_save_member_profile" />
                    <input type="hidden" name="user_id" value="<?php echo $user_id; ?>" />

                    <h2 style="margin-top: 0; padding-bottom: 8px; border-bottom: 2px solid #0f172a; color: #0f172a;">Personal Information</h2>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="firstName">First Name</label></th>
                            <td><input type="text" name="firstName" id="firstName" class="regular-text" value="<?php echo esc_attr( $card['firstName'] ); ?>" required /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="lastName">Last Name</label></th>
                            <td><input type="text" name="lastName" id="lastName" class="regular-text" value="<?php echo esc_attr( $card['lastName'] ); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="displayName">Display Name</label></th>
                            <td><input type="text" name="displayName" id="displayName" class="regular-text" value="<?php echo esc_attr( $card['displayName'] ); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="email">Email Address</label></th>
                            <td><input type="email" name="email" id="email" class="regular-text" value="<?php echo esc_attr( $card['email'] ); ?>" required /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="phone">Phone Number</label></th>
                            <td>
                                <input type="text" name="phone" id="phone" class="regular-text" value="<?php echo esc_attr( $card['phone'] ); ?>" placeholder="+91XXXXXXXXXX" />
                                <p class="description">International format: e.g. +919876543210</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="profession">Profession</label></th>
                            <td><input type="text" name="profession" id="profession" class="regular-text" value="<?php echo esc_attr( $card['profession'] ); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="companyName">Company Name</label></th>
                            <td><input type="text" name="companyName" id="companyName" class="regular-text" value="<?php echo esc_attr( $card['companyName'] ); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="country">Country</label></th>
                            <td><input type="text" name="country" id="country" class="regular-text" value="<?php echo esc_attr( $card['country'] ); ?>" /></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="correspondenceAddress">Correspondence Address</label></th>
                            <td><textarea name="correspondenceAddress" id="correspondenceAddress" rows="3" class="large-text"><?php echo esc_textarea( $card['correspondenceAddress'] ); ?></textarea></td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="profilePhoto">Profile Photo</label></th>
                            <td>
                                <input type="text" name="profilePhoto" id="profilePhoto" class="regular-text" value="<?php echo esc_attr( $card['profilePhoto'] ); ?>" placeholder="https://..." />
                                <button type="button" class="button" id="wlc_upload_image_btn">Choose from Media Library</button>
                                <div id="wlc_image_preview_wrap" style="margin-top: 10px;">
                                    <?php if ( ! empty( $card['profilePhoto'] ) ) : ?>
                                        <img src="<?php echo esc_url( $card['profilePhoto'] ); ?>" alt="Preview" style="max-height: 80px; border-radius: 4px; border: 1px solid #cbd5e1;" />
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <p class="submit" style="margin-top: 25px;">
                        <input type="submit" name="submit" id="submit" class="button button-primary button-large" value="Save Profile Details" />
                        <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>" class="button button-large" style="margin-left: 8px;">Cancel</a>
                    </p>
                </form>
            </div>

            <script>
            jQuery(document).ready(function($){
                var mediaUploader;
                $('#wlc_upload_image_btn').click(function(e) {
                    e.preventDefault();
                    if (mediaUploader) { mediaUploader.open(); return; }
                    mediaUploader = wp.media({
                        title: 'Select Member Profile Photo',
                        button: { text: 'Use this photo' },
                        multiple: false
                    });
                    mediaUploader.on('select', function() {
                        var attachment = mediaUploader.state().get('selection').first().toJSON();
                        $('#profilePhoto').val(attachment.url);
                        $('#wlc_image_preview_wrap').html('<img src="' + attachment.url + '" style="max-height: 80px; border-radius: 4px; border: 1px solid #cbd5e1;" />');
                    });
                    mediaUploader.open();
                });
            });
            </script>
            <?php
            return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // VIEW B: EDIT MEMBERSHIP CARD
        // ─────────────────────────────────────────────────────────────────────
        if ( $action === 'edit_card' && $user_id > 0 ) {
            $user = get_userdata( $user_id );
            if ( ! $user ) {
                echo '<div class="wrap"><h1>Edit Membership Card</h1><div class="error"><p>Member not found in database.</p></div></div>';
                return;
            }
            $card = WLC_Core_Profile_Controller::get_membership_card_data( $user_id );
            ?>
            <div class="wrap">
                <h1 class="wp-heading-inline">Edit Membership Card: <?php echo esc_html( $card['displayName'] ); ?> (ID #<?php echo $user_id; ?>)</h1>
                <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>" class="page-title-action">&larr; Back to Members</a>
                <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships&action=edit_profile&user_id=' . $user_id ); ?>" class="page-title-action" style="margin-left: 8px;">Edit Profile &rarr;</a>
                <hr class="wp-header-end">

                <?php if ( isset( $_GET['message'] ) && $_GET['message'] === 'card_saved' ) : ?>
                    <div class="updated notice is-dismissible" style="margin-top: 15px;">
                        <p><strong>Success:</strong> Membership Card details updated and synchronized with live frontend pass.</p>
                    </div>
                <?php endif; ?>
                <?php if ( isset( $_GET['error'] ) ) : ?>
                    <div class="error notice is-dismissible" style="margin-top: 15px;">
                        <p><strong>Error:</strong> <?php echo esc_html( urldecode( $_GET['error'] ) ); ?></p>
                    </div>
                <?php endif; ?>

                <div style="display: flex; gap: 24px; margin-top: 20px; flex-wrap: wrap;">
                    <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="flex: 2; min-width: 500px; background: #fff; padding: 25px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                        <?php wp_nonce_field( 'wlc_save_member_card_nonce', 'wlc_card_nonce' ); ?>
                        <input type="hidden" name="action" value="wlc_save_member_card" />
                        <input type="hidden" name="user_id" value="<?php echo $user_id; ?>" />

                        <h2 style="margin-top: 0; padding-bottom: 8px; border-bottom: 2px solid #bca374; color: #bca374;">Membership Card Parameters</h2>
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="membershipNumber">Membership Number</label></th>
                                <td>
                                    <input type="text" name="membershipNumber" id="membershipNumber" class="regular-text" value="<?php echo esc_attr( $card['membershipNumber'] ); ?>" placeholder="e.g. WLC-4104" required />
                                    <p class="description"><strong>Strictly Unique</strong> sequence number. Rejects save if assigned to another customer.</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="membershipTier">Membership Tier</label></th>
                                <td>
                                    <select name="membershipTier" id="membershipTier">
                                        <option value="Lotus Club" <?php selected( $card['membershipTier'], 'Lotus Club' ); ?>>Lotus Club</option>
                                        <option value="VIP Annual" <?php selected( $card['membershipTier'], 'VIP Annual' ); ?>>VIP Annual</option>
                                        <option value="Emerald Luminary" <?php selected( $card['membershipTier'], 'Emerald Luminary' ); ?>>Emerald Luminary</option>
                                        <option value="Sanctuary Essential" <?php selected( $card['membershipTier'], 'Sanctuary Essential' ); ?>>Sanctuary Essential</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="membershipStatus">Membership Status</label></th>
                                <td>
                                    <select name="membershipStatus" id="membershipStatus">
                                        <option value="Active" <?php selected( $card['membershipStatus'], 'Active' ); ?>>Active</option>
                                        <option value="Inactive" <?php selected( $card['membershipStatus'], 'Inactive' ); ?>>Inactive</option>
                                        <option value="pending_payment" <?php selected( $card['membershipStatus'], 'pending_payment' ); ?>>Pending Payment</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="startDate">Membership Start Date</label></th>
                                <td>
                                    <input type="date" name="startDate" id="startDate" value="<?php echo esc_attr( $card['startDate'] ); ?>" />
                                    <p class="description">Format: YYYY-MM-DD</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="validUntil">Membership Valid Until</label></th>
                                <td>
                                    <input type="date" name="validUntil" id="validUntil" value="<?php echo esc_attr( $card['validUntil'] ); ?>" />
                                    <p class="description">Expiration date (YYYY-MM-DD). Must be &gt;= Start Date.</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="cardIssueDate">Card Issue Date</label></th>
                                <td><input type="date" name="cardIssueDate" id="cardIssueDate" value="<?php echo esc_attr( $card['cardIssueDate'] ); ?>" /></td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="cardExpiryDate">Card Expiry Date</label></th>
                                <td>
                                    <input type="date" name="cardExpiryDate" id="cardExpiryDate" value="<?php echo esc_attr( $card['cardExpiryDate'] ); ?>" />
                                    <p class="description">Must be &gt;= Card Issue Date.</p>
                                </td>
                            </tr>
                        </table>

                        <p class="submit" style="margin-top: 25px; display: flex; gap: 12px; align-items: center;">
                            <input type="submit" name="submit" id="submit" class="button button-primary button-large" value="Save Membership Card" />
                            <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>" class="button button-large">Cancel</a>
                            <a href="https://wellnessloversclub.com/dashboard" target="_blank" class="button button-secondary button-large" style="margin-left: auto;">View Live Frontend Pass &rarr;</a>
                        </p>
                    </form>

                    <!-- Pass Preview & Audit Sidebar -->
                    <div style="flex: 1; min-width: 300px;">
                        <div style="background: #0f172a; color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="color: #bca374; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Live Digital Pass Preview</div>
                            <div style="font-size: 18px; font-weight: bold; margin-top: 8px;"><?php echo esc_html( $card['displayName'] ); ?></div>
                            <div id="wlc_preview_no" style="font-family: monospace; font-size: 14px; color: #cbd5e1; margin-top: 4px;"><?php echo esc_html( $card['membershipNumber'] ?: 'Pending Allocation' ); ?></div>
                            <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px;">
                                <div><div style="color: #94a3b8;">Tier</div><strong id="wlc_preview_tier" style="color: #bca374;"><?php echo esc_html( $card['membershipTier'] ); ?></strong></div>
                                <div><div style="color: #94a3b8;">Valid Until</div><strong id="wlc_preview_valid"><?php echo esc_html( $card['validUntil'] ?: '—' ); ?></strong></div>
                                <div><div style="color: #94a3b8;">Status</div><strong id="wlc_preview_status" style="color: <?php echo $card['membershipStatus'] === 'Active' ? '#4ade80' : '#f87171'; ?>;"><?php echo esc_html( $card['membershipStatus'] ); ?></strong></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
            jQuery(document).ready(function($){
                function updateLiveCard() {
                    var no = $('#membershipNumber').val() || 'Pending Allocation';
                    var tier = $('#membershipTier option:selected').text();
                    var status = $('#membershipStatus option:selected').text();
                    var statusVal = $('#membershipStatus').val();
                    var valid = $('#validUntil').val() || '—';

                    $('#wlc_preview_no').text(no);
                    $('#wlc_preview_tier').text(tier);
                    $('#wlc_preview_valid').text(valid);
                    $('#wlc_preview_status').text(status).css('color', statusVal === 'Active' ? '#4ade80' : '#f87171');
                }
                $('#membershipNumber, #validUntil, #membershipTier, #membershipStatus').on('input change', updateLiveCard);
            });
            </script>
            <?php
            return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // VIEW C: COMPLETE MEMBERS LIST WITH SEARCH, FILTERS & ACTION BUTTONS
        // ─────────────────────────────────────────────────────────────────────
        $search_query   = isset( $_GET['s'] ) ? sanitize_text_field( trim( $_GET['s'] ) ) : '';
        $filter_status  = isset( $_GET['filter_status'] ) ? sanitize_text_field( $_GET['filter_status'] ) : '';
        $filter_tier    = isset( $_GET['filter_tier'] ) ? sanitize_text_field( $_GET['filter_tier'] ) : '';

        $user_args = array(
            'orderby' => 'user_registered',
            'order'   => 'DESC',
            'number'  => 100,
        );

        if ( ! empty( $search_query ) ) {
            $user_args['search']         = '*' . $search_query . '*';
            $user_args['search_columns'] = array( 'user_login', 'user_email', 'user_nicename', 'display_name' );
        }

        $all_users = get_users( $user_args );
        $members = array();

        foreach ( $all_users as $u ) {
            $status  = get_user_meta( $u->ID, 'wlc_membership_status', true ) ?: ( get_user_meta( $u->ID, 'membershipStatus', true ) ?: 'Inactive' );
            $tier    = get_user_meta( $u->ID, 'wlc_membership_tier', true ) ?: ( get_user_meta( $u->ID, 'membershipTier', true ) ?: 'Lotus Club' );
            $card_no = get_user_meta( $u->ID, 'wlc_membership_number', true ) ?: ( get_user_meta( $u->ID, 'wlc_membership_id', true ) ?: '' );
            $phone   = get_user_meta( $u->ID, 'wlc_phone', true ) ?: ( get_user_meta( $u->ID, 'phone', true ) ?: '' );

            if ( ! empty( $filter_status ) && strtolower( $status ) !== strtolower( $filter_status ) ) continue;
            if ( ! empty( $filter_tier ) && strtolower( $tier ) !== strtolower( $filter_tier ) ) continue;

            $members[] = array(
                'user'        => $u,
                'status'      => $status,
                'tier'        => $tier,
                'card_no'     => $card_no,
                'phone'       => $phone,
                'valid_until' => get_user_meta( $u->ID, 'wlc_membership_valid_until', true ) ?: ( get_user_meta( $u->ID, 'validTill', true ) ?: '-' ),
            );
        }
        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Membership Applications &amp; Registered Customers</h1>
            <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?action=wlc_export_memberships' ), 'wlc_export_nonce' ); ?>" class="page-title-action">Export to CSV</a>
            <hr class="wp-header-end">

            <?php if ( isset( $_GET['message'] ) ) : ?>
                <div class="updated notice is-dismissible" style="margin-top: 15px;">
                    <p><?php
                        if ( $_GET['message'] === 'approved' ) echo 'Membership approved and Welcome email dispatched.';
                        if ( $_GET['message'] === 'rejected' ) echo 'Membership application deactivated.';
                        if ( $_GET['message'] === 'profile_saved' ) echo 'Member profile saved successfully.';
                        if ( $_GET['message'] === 'card_saved' ) echo 'Membership Card saved successfully.';
                    ?></p>
                </div>
            <?php endif; ?>

            <!-- Search & Filters Bar -->
            <form method="get" action="<?php echo esc_url( admin_url( 'admin.php' ) ); ?>" style="margin: 20px 0; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <input type="hidden" name="page" value="wlc-memberships" />

                <input type="search" name="s" value="<?php echo esc_attr( $search_query ); ?>" placeholder="Search name, email, number..." style="width: 250px;" />

                <select name="filter_status">
                    <option value="">All Statuses</option>
                    <option value="Active" <?php selected( $filter_status, 'Active' ); ?>>Active</option>
                    <option value="Inactive" <?php selected( $filter_status, 'Inactive' ); ?>>Inactive</option>
                    <option value="pending_payment" <?php selected( $filter_status, 'pending_payment' ); ?>>Pending Payment</option>
                </select>

                <select name="filter_tier">
                    <option value="">All Tiers</option>
                    <option value="Lotus Club" <?php selected( $filter_tier, 'Lotus Club' ); ?>>Lotus Club</option>
                    <option value="VIP Annual" <?php selected( $filter_tier, 'VIP Annual' ); ?>>VIP Annual</option>
                    <option value="Emerald Luminary" <?php selected( $filter_tier, 'Emerald Luminary' ); ?>>Emerald Luminary</option>
                    <option value="Sanctuary Essential" <?php selected( $filter_tier, 'Sanctuary Essential' ); ?>>Sanctuary Essential</option>
                </select>

                <input type="submit" class="button" value="Filter Members" />
                <?php if ( ! empty( $search_query ) || ! empty( $filter_status ) || ! empty( $filter_tier ) ) : ?>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>" class="button">Reset</a>
                <?php endif; ?>
            </form>

            <table class="wp-list-table widefat fixed striped pages">
                <thead>
                    <tr>
                        <th style="width: 50px;">ID</th>
                        <th style="width: 140px;">Name</th>
                        <th>Email</th>
                        <th style="width: 120px;">Phone</th>
                        <th style="width: 110px;">Card No.</th>
                        <th style="width: 120px;">Tier</th>
                        <th style="width: 100px;">Status</th>
                        <th style="width: 100px;">Valid Until</th>
                        <th style="width: 250px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( empty( $members ) ) : ?>
                        <tr><td colspan="9">No member records found matching criteria.</td></tr>
                    <?php else : ?>
                        <?php foreach ( $members as $m ) : 
                            $u = $m['user'];
                            $full_name = trim( $u->first_name . ' ' . $u->last_name ) ?: $u->display_name;
                            ?>
                            <tr>
                                <td><strong>#<?php echo esc_html( $u->ID ); ?></strong></td>
                                <td><strong><?php echo esc_html( $full_name ); ?></strong></td>
                                <td><a href="mailto:<?php echo esc_attr( $u->user_email ); ?>"><?php echo esc_html( $u->user_email ); ?></a></td>
                                <td><?php echo esc_html( $m['phone'] ?: '—' ); ?></td>
                                <td><code><?php echo esc_html( $m['card_no'] ?: '—' ); ?></code></td>
                                <td><?php echo esc_html( $m['tier'] ); ?></td>
                                <td>
                                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: <?php echo $m['status'] === 'Active' ? '#dcfce7; color: #16a34a;' : '#fee2e2; color: #ef4444;'; ?>">
                                        <?php echo esc_html( $m['status'] ); ?>
                                    </span>
                                </td>
                                <td><?php echo esc_html( $m['valid_until'] ); ?></td>
                                <td>
                                    <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships&action=edit_profile&user_id=' . $u->ID ); ?>" class="button button-small" style="margin-right: 4px;">Edit Profile</a>
                                    <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships&action=edit_card&user_id=' . $u->ID ); ?>" class="button button-small" style="margin-right: 4px;">Edit Membership Card</a>
                                    <?php if ( $m['status'] !== 'Active' ) : ?>
                                        <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?action=wlc_approve_member&user_id=' . $u->ID ), 'wlc_member_action_' . $u->ID ); ?>" class="button button-small button-primary">Approve</a>
                                    <?php else : ?>
                                        <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?action=wlc_reject_member&user_id=' . $u->ID ), 'wlc_member_action_' . $u->ID ); ?>" class="button button-small" onclick="return confirm('Are you sure you want to deactivate this membership?');">Deactivate</a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * ─── 3. Save Member Profile Action Handler ────────────────────────────────
     */
    public function save_member_profile() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized administrative access.' );
        check_admin_referer( 'wlc_save_member_profile_nonce', 'wlc_profile_nonce' );

        $user_id = isset( $_POST['user_id'] ) ? intval( $_POST['user_id'] ) : 0;
        if ( $user_id <= 0 || ! get_userdata( $user_id ) ) wp_die( 'Invalid member user ID.' );

        $admin_id = get_current_user_id();

        // 1. Update standard WP User fields
        $user_update = array( 'ID' => $user_id );
        if ( isset( $_POST['firstName'] ) ) $user_update['first_name'] = sanitize_text_field( $_POST['firstName'] );
        if ( isset( $_POST['lastName'] ) ) $user_update['last_name'] = sanitize_text_field( $_POST['lastName'] );
        if ( isset( $_POST['displayName'] ) ) $user_update['display_name'] = sanitize_text_field( $_POST['displayName'] );
        if ( isset( $_POST['email'] ) ) {
            $email = sanitize_email( $_POST['email'] );
            if ( is_email( $email ) ) {
                $exists = email_exists( $email );
                if ( $exists && $exists != $user_id ) {
                    $err = urlencode( "Email '{$email}' is already in use by another member." );
                    wp_redirect( admin_url( "admin.php?page=wlc-memberships&action=edit_profile&user_id={$user_id}&error={$err}" ) );
                    exit;
                }
                $user_update['user_email'] = $email;
            }
        }
        if ( count( $user_update ) > 1 ) {
            wp_update_user( $user_update );
        }

        // 2. Update canonical user meta fields
        $fields_to_update = array(
            'wlc_phone'                  => isset( $_POST['phone'] ) ? sanitize_text_field( $_POST['phone'] ) : '',
            'phone'                      => isset( $_POST['phone'] ) ? sanitize_text_field( $_POST['phone'] ) : '',
            'wlc_profession'             => isset( $_POST['profession'] ) ? sanitize_text_field( $_POST['profession'] ) : '',
            'wlc_company_name'           => isset( $_POST['companyName'] ) ? sanitize_text_field( $_POST['companyName'] ) : '',
            'wlc_country'                => isset( $_POST['country'] ) ? sanitize_text_field( $_POST['country'] ) : '',
            'wlc_correspondence_address' => isset( $_POST['correspondenceAddress'] ) ? sanitize_textarea_field( $_POST['correspondenceAddress'] ) : '',
            'wlc_profile_photo'          => isset( $_POST['profilePhoto'] ) ? sanitize_text_field( $_POST['profilePhoto'] ) : '',
        );

        $audit_changes = array();
        foreach ( $fields_to_update as $meta_key => $new_val ) {
            $old_val = get_user_meta( $user_id, $meta_key, true );
            update_user_meta( $user_id, $meta_key, $new_val );
            if ( $old_val !== $new_val ) {
                $audit_changes[ $meta_key ] = array( 'old' => $old_val, 'new' => $new_val );
            }
        }

        clean_user_cache( $user_id );

        // 3. Save change audit log
        if ( ! empty( $audit_changes ) ) {
            $all_logs = get_option( 'wlc_admin_card_audit_logs', array() );
            $all_logs[] = array(
                'admin_id'   => $admin_id,
                'user_id'    => $user_id,
                'changes'    => $audit_changes,
                'timestamp'  => current_time( 'mysql' ),
                'ip_address' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( $_SERVER['REMOTE_ADDR'] ) : '',
            );
            if ( count( $all_logs ) > 200 ) $all_logs = array_slice( $all_logs, -200 );
            update_option( 'wlc_admin_card_audit_logs', $all_logs, false );
        }

        if ( class_exists( 'WLC_Core_Logger' ) ) {
            WLC_Core_Logger::log( "[WLC PROFILE SYNC] Admin #{$admin_id} saved Member #{$user_id} profile details.", 'INFO' );
        }

        wp_redirect( admin_url( "admin.php?page=wlc-memberships&action=edit_profile&user_id={$user_id}&message=profile_saved" ) );
        exit;
    }

    /**
     * ─── 4. Save Member Card Action Handler ───────────────────────────────────
     */
    public function save_member_card() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized administrative access.' );
        check_admin_referer( 'wlc_save_member_card_nonce', 'wlc_card_nonce' );

        $user_id = isset( $_POST['user_id'] ) ? intval( $_POST['user_id'] ) : 0;
        if ( $user_id <= 0 || ! get_userdata( $user_id ) ) wp_die( 'Invalid member user ID.' );

        $admin_id = get_current_user_id();
        $membership_number = sanitize_text_field( trim( $_POST['membershipNumber'] ) );

        // 1. Uniqueness check for Membership Number
        if ( ! empty( $membership_number ) ) {
            global $wpdb;
            $existing_owner = $wpdb->get_var( $wpdb->prepare(
                "SELECT user_id FROM {$wpdb->usermeta} WHERE (meta_key = 'wlc_membership_number' OR meta_key = 'wlc_membership_id') AND meta_value = %s AND user_id != %d LIMIT 1",
                $membership_number,
                $user_id
            ) );

            if ( $existing_owner ) {
                $err = urlencode( "Membership number '{$membership_number}' is already assigned to another member." );
                wp_redirect( admin_url( "admin.php?page=wlc-memberships&action=edit_card&user_id={$user_id}&error={$err}" ) );
                exit;
            }
        }

        // 2. Date consistency checks
        $start_date  = sanitize_text_field( $_POST['startDate'] );
        $valid_until = sanitize_text_field( $_POST['validUntil'] );
        if ( ! empty( $start_date ) && ! empty( $valid_until ) && strtotime( $valid_until ) < strtotime( $start_date ) ) {
            $err = urlencode( "Valid Until date cannot be earlier than Membership Start date." );
            wp_redirect( admin_url( "admin.php?page=wlc-memberships&action=edit_card&user_id={$user_id}&error={$err}" ) );
            exit;
        }

        $card_issue  = sanitize_text_field( $_POST['cardIssueDate'] );
        $card_expiry = sanitize_text_field( $_POST['cardExpiryDate'] );
        if ( ! empty( $card_issue ) && ! empty( $card_expiry ) && strtotime( $card_expiry ) < strtotime( $card_issue ) ) {
            $err = urlencode( "Card Expiry date cannot be earlier than Card Issue date." );
            wp_redirect( admin_url( "admin.php?page=wlc-memberships&action=edit_card&user_id={$user_id}&error={$err}" ) );
            exit;
        }

        // 3. Update canonical metadata fields
        $fields_to_update = array(
            'wlc_membership_number'      => $membership_number,
            'wlc_membership_id'          => $membership_number,
            'membershipNumber'           => $membership_number,
            'wlc_membership_tier'        => isset( $_POST['membershipTier'] ) ? sanitize_text_field( $_POST['membershipTier'] ) : 'Lotus Club',
            'wlc_membership_status'      => isset( $_POST['membershipStatus'] ) ? sanitize_text_field( $_POST['membershipStatus'] ) : 'Inactive',
            'membershipStatus'           => isset( $_POST['membershipStatus'] ) ? sanitize_text_field( $_POST['membershipStatus'] ) : 'Inactive',
            'membership_status'          => isset( $_POST['membershipStatus'] ) ? sanitize_text_field( $_POST['membershipStatus'] ) : 'Inactive',
            'wlc_membership_start_date'  => $start_date,
            'wlc_membership_valid_until' => $valid_until,
            'validTill'                  => $valid_until,
            'validUntil'                 => $valid_until,
            'wlc_card_issue_date'        => $card_issue,
            'wlc_card_expiry_date'       => $card_expiry,
        );

        $audit_changes = array();
        foreach ( $fields_to_update as $meta_key => $new_val ) {
            $old_val = get_user_meta( $user_id, $meta_key, true );
            update_user_meta( $user_id, $meta_key, $new_val );
            if ( $old_val !== $new_val ) {
                $audit_changes[ $meta_key ] = array( 'old' => $old_val, 'new' => $new_val );
            }
        }

        clean_user_cache( $user_id );

        // 4. Save change audit log
        if ( ! empty( $audit_changes ) ) {
            $all_logs = get_option( 'wlc_admin_card_audit_logs', array() );
            $all_logs[] = array(
                'admin_id'   => $admin_id,
                'user_id'    => $user_id,
                'changes'    => $audit_changes,
                'timestamp'  => current_time( 'mysql' ),
                'ip_address' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( $_SERVER['REMOTE_ADDR'] ) : '',
            );
            if ( count( $all_logs ) > 200 ) $all_logs = array_slice( $all_logs, -200 );
            update_option( 'wlc_admin_card_audit_logs', $all_logs, false );
        }

        if ( class_exists( 'WLC_Core_Logger' ) ) {
            $saved_no = get_user_meta( $user_id, 'wlc_membership_number', true );
            $saved_tier = get_user_meta( $user_id, 'wlc_membership_tier', true );
            $saved_until = get_user_meta( $user_id, 'wlc_membership_valid_until', true );
            WLC_Core_Logger::log( "[WLC CARD SYNC] Admin #{$admin_id} saved Member #{$user_id}: number={$saved_no}, tier={$saved_tier}, valid_until={$saved_until}", 'INFO' );
        }

        wp_redirect( admin_url( "admin.php?page=wlc-memberships&action=edit_card&user_id={$user_id}&message=card_saved" ) );
        exit;
    }

    /**
     * ─── 5. Contact Inquiries Page ────────────────────────────────────────────
     */
    public function render_contacts_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_contacts';

        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) !== $table ) {
            echo '<div class="wrap"><h1>Contact Messages</h1><div class="error"><p>Database table does not exist.</p></div></div>';
            return;
        }

        if ( isset( $_GET['view_id'] ) ) {
            $msg = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", intval( $_GET['view_id'] ) ) );
            if ( $msg ) {
                $wpdb->update( $table, array( 'status' => 'Read' ), array( 'id' => $msg->id ) );
                ?>
                <div class="wrap">
                    <h1>View Contact Message Details</h1>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-contacts' ); ?>" class="button">&larr; Back to List</a>
                    <div style="background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 15px; max-width: 700px;">
                        <table class="form-table">
                            <tr><th>Name</th><td><?php echo esc_html( $msg->first_name . ' ' . $msg->last_name ); ?></td></tr>
                            <tr><th>Email Address</th><td><a href="mailto:<?php echo esc_attr( $msg->email ); ?>"><?php echo esc_html( $msg->email ); ?></a></td></tr>
                            <tr><th>Phone Number</th><td><?php echo esc_html( $msg->phone ?: '-' ); ?></td></tr>
                            <tr><th>Subject</th><td><strong><?php echo esc_html( $msg->subject ); ?></strong></td></tr>
                            <tr><th>Date Received</th><td><?php echo esc_html( $msg->created_at ); ?></td></tr>
                            <tr><th>IP Address</th><td><code><?php echo esc_html( $msg->ip_address ); ?></code></td></tr>
                            <tr><th>Message Query</th><td style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #cbd5e1; white-space: pre-wrap;"><?php echo esc_html( $msg->message ); ?></td></tr>
                        </table>
                    </div>
                </div>
                <?php
                return;
            }
        }

        $messages = $wpdb->get_results( "SELECT * FROM {$table} ORDER BY id DESC" );
        ?>
        <div class="wrap">
            <h1>WLC Website Contact Messages</h1>
            <p>Inquiries submitted via the Next.js headless contact page.</p>

            <table class="wp-list-table widefat fixed striped pages" style="margin-top: 15px;">
                <thead>
                    <tr>
                        <th style="width: 150px;">Name</th>
                        <th style="width: 200px;">Email</th>
                        <th style="width: 120px;">Phone</th>
                        <th>Subject</th>
                        <th style="width: 150px;">Date</th>
                        <th style="width: 100px;">Status</th>
                        <th style="width: 180px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( empty( $messages ) ) : ?>
                        <tr><td colspan="7">No contact form messages received yet.</td></tr>
                    <?php else : ?>
                        <?php foreach ( $messages as $m ) : ?>
                            <tr>
                                <td><strong><?php echo esc_html( $m->first_name . ' ' . $m->last_name ); ?></strong></td>
                                <td><?php echo esc_html( $m->email ); ?></td>
                                <td><?php echo esc_html( $m->phone ?: '-' ); ?></td>
                                <td><?php echo esc_html( $m->subject ); ?></td>
                                <td><?php echo esc_html( $m->created_at ); ?></td>
                                <td>
                                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: <?php echo $m->status === 'New' ? '#fee2e2; color: #ef4444;' : '#f1f5f9; color: #475569;'; ?>">
                                        <?php echo esc_html( $m->status ); ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="<?php echo admin_url( 'admin.php?page=wlc-contacts&view_id=' . $m->id ); ?>" class="button button-small">View Details</a>
                                    <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?page=wlc-contacts&action=wlc_delete_contact&id=' . $m->id ), 'wlc_contact_action_' . $m->id ); ?>" class="button button-small button-link-delete" onclick="return confirm('Are you sure you want to delete this message?');">Delete</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * ─── 6. Payments & Orders Sub-Page ────────────────────────────────────────
     */
    public function render_payments_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_payments';
        $payments = array();
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) === $table ) {
            $payments = $wpdb->get_results( "SELECT * FROM $table ORDER BY id DESC LIMIT 100" );
        }
        ?>
        <div class="wrap">
            <h1 class="wp-heading-inline">Membership Payments &amp; Razorpay Orders</h1>
            <p style="color: #64748b; font-size: 13px;">
                Internal accounting breakdown for statutory 18% GST compliance (Selling Price: ₹29,000 including 18% GST).
            </p>
            <hr class="wp-header-end">

            <!-- GST Accounting Summary Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 20px 0;">
                <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #0f8554; border-radius: 8px; padding: 16px;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.05em;">Final Selling Price</div>
                    <div style="font-size: 24px; font-weight: bold; color: #0f8554; margin-top: 4px;">₹29,000.00</div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Fixed Tax-Inclusive Price</div>
                </div>
                <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.05em;">Base Amount (Excl. GST)</div>
                    <div style="font-size: 24px; font-weight: bold; color: #1e293b; margin-top: 4px;">₹24,576.27</div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">₹29,000 ÷ 1.18</div>
                </div>
                <div style="background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.05em;">Statutory GST @ 18%</div>
                    <div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin-top: 4px;">₹4,423.73</div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">18% Included Tax Component</div>
                </div>
            </div>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width: 140px;">Order ID</th>
                        <th style="width: 160px;">Customer</th>
                        <th style="width: 130px;">Razorpay Order ID</th>
                        <th style="width: 130px;">Razorpay Payment ID</th>
                        <th style="width: 100px;">Base (Excl.)</th>
                        <th style="width: 90px;">GST @ 18%</th>
                        <th style="width: 100px;">Total Paid</th>
                        <th style="width: 90px;">Status</th>
                        <th style="width: 130px;">Date &amp; Time</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( empty( $payments ) ) : ?>
                        <tr><td colspan="9">No payment records found.</td></tr>
                    <?php else : ?>
                        <?php foreach ( $payments as $pay ) : 
                            $base_amount = $pay->amount / 1.18;
                            $gst_amount  = $pay->amount - $base_amount;
                            ?>
                            <tr>
                                <td><strong><?php echo esc_html( $pay->order_id ?: $pay->gateway_payment_id ); ?></strong></td>
                                <td>
                                    <div><strong><?php echo esc_html( $pay->name ); ?></strong></div>
                                    <div style="font-size: 12px; color: #64748b;"><?php echo esc_html( $pay->email ); ?></div>
                                </td>
                                <td><code><?php echo esc_html( $pay->gateway_order_id ?: '—' ); ?></code></td>
                                <td><code><?php echo esc_html( $pay->gateway_payment_id ?: '—' ); ?></code></td>
                                <td>₹<?php echo number_format( $base_amount, 2 ); ?></td>
                                <td>₹<?php echo number_format( $gst_amount, 2 ); ?></td>
                                <td><strong style="color: #0f8554;">₹<?php echo number_format( $pay->amount, 2 ); ?></strong></td>
                                <td>
                                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: <?php echo $pay->status === 'completed' ? '#dcfce7; color: #16a34a;' : '#fee2e2; color: #ef4444;'; ?>">
                                        <?php echo esc_html( ucfirst( $pay->status ) ); ?>
                                    </span>
                                </td>
                                <td><?php echo esc_html( $pay->paid_at ?: $pay->created_at ); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * ─── 7. Email Settings Page ───────────────────────────────────────────────
     */
    public function render_email_settings_page() {
        if ( file_exists( WLC_CORE_PATH . 'templates/smtp-settings.php' ) ) {
            include WLC_CORE_PATH . 'templates/smtp-settings.php';
        } else {
            echo '<div class="wrap"><h1>Email Settings</h1><p>Settings template missing.</p></div>';
        }
    }

    /**
     * ─── 8. Email Logs Page ───────────────────────────────────────────────────
     */
    public function render_email_logs_page() {
        if ( file_exists( WLC_CORE_PATH . 'templates/smtp-logs.php' ) ) {
            include WLC_CORE_PATH . 'templates/smtp-logs.php';
        } else {
            echo '<div class="wrap"><h1>Email Logs</h1><p>Logs template missing.</p></div>';
        }
    }

    /**
     * Export members to CSV
     */
    private function export_memberships_csv() {
        $users = get_users( array( 'orderby' => 'user_registered', 'order' => 'DESC' ) );
        header( 'Content-Type: text/csv; charset=utf-8' );
        header( 'Content-Disposition: attachment; filename=wlc-members-' . gmdate( 'Y-m-d' ) . '.csv' );

        $out = fopen( 'php://output', 'w' );
        fputcsv( $out, array( 'User ID', 'Name', 'Email', 'Phone', 'Membership Number', 'Tier', 'Status', 'Start Date', 'Valid Until', 'Profession', 'Company', 'Country' ) );

        foreach ( $users as $u ) {
            $card = WLC_Core_Profile_Controller::get_membership_card_data( $u->ID );
            if ( $card ) {
                fputcsv( $out, array(
                    $card['userId'],
                    $card['displayName'],
                    $card['email'],
                    $card['phone'],
                    $card['membershipNumber'],
                    $card['membershipTier'],
                    $card['membershipStatus'],
                    $card['startDate'],
                    $card['validUntil'],
                    $card['profession'],
                    $card['companyName'],
                    $card['country'],
                ) );
            }
        }
        fclose( $out );
        exit;
    }

    public function save_smtp_settings() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        check_admin_referer( 'wlc_smtp_settings_nonce' );
        if ( class_exists( 'WLC_Core_Email_Settings' ) ) {
            WLC_Core_Email_Settings::save_settings();
        }
        wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&message=settings_saved' ) );
        exit;
    }

    public function send_test_email() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        check_admin_referer( 'wlc_test_email_nonce' );
        $to = isset( $_POST['test_email_to'] ) ? sanitize_email( $_POST['test_email_to'] ) : '';
        if ( class_exists( 'WLC_Core_Email_Test' ) && is_email( $to ) ) {
            WLC_Core_Email_Test::send_test_email( $to );
        }
        wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&message=test_sent' ) );
        exit;
    }

    public function trigger_queue_process() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        check_admin_referer( 'wlc_queue_trigger_nonce' );
        if ( class_exists( 'WLC_Core_Email_Queue' ) ) {
            WLC_Core_Email_Queue::process_queue();
        }
        wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&message=queue_processed' ) );
        exit;
    }

    public function clear_all_logs() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        check_admin_referer( 'wlc_clear_logs_nonce' );
        if ( class_exists( 'WLC_Core_Email_Logs' ) ) {
            WLC_Core_Email_Logs::clear_all_logs();
        }
        wp_redirect( admin_url( 'admin.php?page=wlc-email-logs&message=logs_cleared' ) );
        exit;
    }

    public function delete_log() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        $id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
        check_admin_referer( 'wlc_delete_log_nonce_' . $id );
        if ( class_exists( 'WLC_Core_Email_Logs' ) ) {
            WLC_Core_Email_Logs::delete_log( $id );
        }
        wp_redirect( admin_url( 'admin.php?page=wlc-email-logs&message=log_deleted' ) );
        exit;
    }

    public function retry_log() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        $id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
        check_admin_referer( 'wlc_retry_log_nonce_' . $id );
        if ( class_exists( 'WLC_Core_Email_Logs' ) ) {
            WLC_Core_Email_Logs::retry_send( $id );
        }
        wp_redirect( admin_url( 'admin.php?page=wlc-email-logs&message=retry_queued' ) );
        exit;
    }

    public function clear_audit_logs() {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );
        check_admin_referer( 'wlc_clear_audit_nonce', 'wlc_audit_nonce' );
        update_option( 'wlc_admin_card_audit_logs', array(), false );
        wp_redirect( admin_url( 'admin.php?page=wlc-memberships' ) );
        exit;
    }
}

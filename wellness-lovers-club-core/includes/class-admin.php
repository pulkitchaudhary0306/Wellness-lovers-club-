<?php
/**
 * WordPress Admin Dashboard interface for contact messages and memberships
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

        // Add admin post action hooks for SMTP module forms
        add_action( 'admin_post_wlc_save_smtp_settings', array( $this, 'save_smtp_settings' ) );
        add_action( 'admin_post_wlc_send_test_email', array( $this, 'send_test_email' ) );
        add_action( 'admin_post_wlc_trigger_queue_process', array( $this, 'trigger_queue_process' ) );
        add_action( 'admin_post_wlc_clear_all_logs', array( $this, 'clear_all_logs' ) );
        add_action( 'admin_post_wlc_delete_log', array( $this, 'delete_log' ) );
        add_action( 'admin_post_wlc_retry_log', array( $this, 'retry_log' ) );
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
            'Membership Applications',
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
    }

    /**
     * Handle actions triggered by admin forms (approve, reject, delete, read, export)
     */
    public function handle_admin_actions() {
        if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // 1. Export Memberships list to CSV
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_export_memberships' ) {
            check_admin_referer( 'wlc_export_nonce' );
            $this->export_memberships_csv();
            exit;
        }

        // 2. Approve Membership Application
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_approve_member' && isset( $_GET['user_id'] ) ) {
            check_admin_referer( 'wlc_member_action_' . $_GET['user_id'] );
            $user_id = intval( $_GET['user_id'] );
            WLC_Core_Auth_Controller::update_wlc_user_meta( $user_id, 'membershipStatus', 'Active' );
            
            // Log Event
            WLC_Core_Logger::log( "Admin approved membership for user ID: {$user_id}", 'INFO' );
            
            $user = get_userdata( $user_id );
            WLC_Core_Emails::send_welcome_email( $user->user_email, $user->first_name );
            
            wp_redirect( admin_url( 'admin.php?page=wlc-memberships&message=approved' ) );
            exit;
        }

        // 3. Reject Membership Application
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_reject_member' && isset( $_GET['user_id'] ) ) {
            check_admin_referer( 'wlc_member_action_' . $_GET['user_id'] );
            $user_id = intval( $_GET['user_id'] );
            WLC_Core_Auth_Controller::update_wlc_user_meta( $user_id, 'membershipStatus', 'Inactive' );
            
            // Log Event
            WLC_Core_Logger::log( "Admin rejected/deactivated membership for user ID: {$user_id}", 'INFO' );

            wp_redirect( admin_url( 'admin.php?page=wlc-memberships&message=rejected' ) );
            exit;
        }

        // 4. Mark Contact Message as Read
        if ( isset( $_GET['action'] ) && $_GET['action'] === 'wlc_read_contact' && isset( $_GET['id'] ) ) {
            check_admin_referer( 'wlc_contact_action_' . $_GET['id'] );
            global $wpdb;
            $table = $wpdb->prefix . 'wlc_contacts';
            $wpdb->update( $table, array( 'status' => 'Read' ), array( 'id' => intval( $_GET['id'] ) ), array( '%s' ), array( '%d' ) );
            
            wp_redirect( admin_url( 'admin.php?page=wlc-contacts&message=marked_read' ) );
            exit;
        }

        // 5. Delete Contact Message
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
     * Main Core Dashboard Page callback
     */
    public function render_dashboard_page() {
        global $wpdb;
        $table_contacts = $wpdb->prefix . 'wlc_contacts';
        $table_news = $wpdb->prefix . 'wlc_newsletter';
        
        $contacts_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_contacts}'" ) === $table_contacts ) {
            $contacts_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_contacts}" ) );
        }
        $subscribers_count = 0;
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table_news}'" ) === $table_news ) {
            $subscribers_count = intval( $wpdb->get_var( "SELECT COUNT(id) FROM {$table_news} WHERE status = 'Active'" ) );
        }

        // Fetch registered user counts
        $users_query = count_users();
        $total_users = isset( $users_query['total_users'] ) ? $users_query['total_users'] : 0;

        ?>
        <div class="wrap">
            <h1>Wellness Lovers Club Core Dashboard</h1>
            <p>Welcome to the core management center. Here you can monitor system statistics and logs.</p>
            
            <hr>
            
            <div style="display: flex; gap: 20px; margin-top: 20px;">
                <div style="flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #0f8554;">
                    <h3>Total Members</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #0f8554;"><?php echo $total_users; ?></p>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-memberships' ); ?>">Manage Applications &rarr;</a>
                </div>
                <div style="flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #22c55e;">
                    <h3>Contact Messages</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #22c55e;"><?php echo $contacts_count; ?></p>
                    <a href="<?php echo admin_url( 'admin.php?page=wlc-contacts' ); ?>">View Queries &rarr;</a>
                </div>
                <div style="flex: 1; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6;">
                    <h3>Newsletter Subscribers</h3>
                    <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #3b82f6;"><?php echo $subscribers_count; ?></p>
                </div>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 30px;">
                <h3>Recent System Activity Logs</h3>
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
     * Render Contact Messages Admin Page
     */
    public function render_contacts_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_contacts';

        // Check if database table exists
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) !== $table ) {
            echo '<div class="wrap"><h1>Contact Messages</h1><div class="error"><p>Database table does not exist. Please reactivate the plugin.</p></div></div>';
            return;
        }

        // View detail modal or screen if ID parameter is passed
        if ( isset( $_GET['view_id'] ) ) {
            $msg = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", intval( $_GET['view_id'] ) ) );
            if ( $msg ) {
                // Auto mark as Read on view
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
            <p>Below is the list of inquiries submitted via the Next.js headless contact page.</p>

            <?php if ( isset( $_GET['message'] ) ) : ?>
                <div class="updated notice is-dismissible">
                    <p><?php
                        if ( $_GET['message'] === 'deleted' ) echo 'Message successfully deleted.';
                        if ( $_GET['message'] === 'marked_read' ) echo 'Message marked as read.';
                    ?></p>
                </div>
            <?php endif; ?>

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
                                    
                                    <?php if ( $m->status === 'New' ) : ?>
                                        <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?page=wlc-contacts&action=wlc_read_contact&id=' . $m->id ), 'wlc_contact_action_' . $m->id ); ?>" class="button button-small">Read</a>
                                    <?php endif; ?>

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
     * Render Membership Applications Admin Page
     */
    public function render_memberships_page() {
        // Query users
        $args = array(
            'role'    => 'subscriber',
            'orderby' => 'user_registered',
            'order'   => 'DESC'
        );
        $members = get_users( $args );
        ?>
        <div class="wrap">
            <h1>Membership Applications</h1>
            <p>Monitor, approve, reject, or export user membership registrations.</p>

            <?php if ( isset( $_GET['message'] ) ) : ?>
                <div class="updated notice is-dismissible">
                    <p><?php
                        if ( $_GET['message'] === 'approved' ) echo 'Membership approved and Welcome email dispatched.';
                        if ( $_GET['message'] === 'rejected' ) echo 'Membership application deactivated.';
                    ?></p>
                </div>
            <?php endif; ?>

            <div style="margin: 15px 0;">
                <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?action=wlc_export_memberships' ), 'wlc_export_nonce' ); ?>" class="button button-primary">Export Subscribers to CSV</a>
            </div>

            <table class="wp-list-table widefat fixed striped pages">
                <thead>
                    <tr>
                        <th style="width: 150px;">Name</th>
                        <th>Email</th>
                        <th style="width: 120px;">Phone</th>
                        <th style="width: 150px;">Profession</th>
                        <th style="width: 100px;">Tier</th>
                        <th style="width: 120px;">Status</th>
                        <th style="width: 220px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( empty( $members ) ) : ?>
                        <tr><td colspan="7">No membership applicants found.</td></tr>
                    <?php else : ?>
                        <?php foreach ( $members as $m ) : 
                            $status = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'membershipStatus' ) ?: 'Inactive';
                            $tier   = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'membershipTier' ) ?: 'Lotus Club';
                            $phone  = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'phone' );
                            $prof   = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'profession' );
                            ?>
                            <tr>
                                <td><strong><?php echo esc_html( $m->first_name . ' ' . $m->last_name ); ?></strong></td>
                                <td><?php echo esc_html( $m->user_email ); ?></td>
                                <td><?php echo esc_html( $phone ?: '-' ); ?></td>
                                <td><?php echo esc_html( $prof ?: '-' ); ?></td>
                                <td><?php echo esc_html( $tier ); ?></td>
                                <td>
                                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: <?php echo $status === 'Active' ? '#dcfce7; color: #16a34a;' : '#fee2e2; color: #ef4444;'; ?>">
                                        <?php echo esc_html( $status ); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ( $status !== 'Active' ) : ?>
                                        <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?action=wlc_approve_member&user_id=' . $m->ID ), 'wlc_member_action_' . $m->ID ); ?>" class="button button-small button-primary">Approve &amp; Activate</a>
                                    <?php else : ?>
                                        <a href="<?php echo wp_nonce_url( admin_url( 'admin.php?action=wlc_reject_member&user_id=' . $m->ID ), 'wlc_member_action_' . $m->ID ); ?>" class="button button-small" onclick="return confirm('Are you sure you want to deactivate this membership?');">Deactivate</a>
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
     * Render Payments & Orders sub-page with full GST internal accounting details
     */
    public function render_payments_page() {
        global $wpdb;
        $table = $wpdb->prefix . 'wlc_payments';
        $payments = $wpdb->get_results( "SELECT * FROM $table ORDER BY id DESC LIMIT 100" );
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
                        <tr><td colspan="9" style="text-align: center; padding: 20px;">No payment transactions recorded yet.</td></tr>
                    <?php else : ?>
                        <?php foreach ( $payments as $p ) : 
                            $user = get_userdata( $p->user_id );
                            $customer_name = $user ? ( $user->display_name ?: $user->first_name . ' ' . $user->last_name ) : 'Guest';
                            $customer_email = $user ? $user->user_email : '-';
                            $status_bg = $p->status === 'completed' ? '#dcfce7; color: #16a34a;' : ( $p->status === 'pending' ? '#fef3c7; color: #d97706;' : '#fee2e2; color: #ef4444;' );
                            ?>
                            <tr>
                                <td><code><?php echo esc_html( $p->order_id ); ?></code></td>
                                <td>
                                    <strong><?php echo esc_html( $customer_name ); ?></strong><br>
                                    <small style="color: #64748b;"><?php echo esc_html( $customer_email ); ?></small>
                                </td>
                                <td><small><code><?php echo esc_html( $p->gateway_order_id ?: '-' ); ?></code></small></td>
                                <td><small><code><?php echo esc_html( $p->gateway_payment_id ?: '-' ); ?></code></small></td>
                                <td>₹<?php echo number_format( (float) ( $p->base_amount ?: 24576.27 ), 2 ); ?></td>
                                <td>₹<?php echo number_format( (float) ( $p->gst_amount ?: $p->tax_amount ?: 4423.73 ), 2 ); ?></td>
                                <td><strong style="color: #0f8554;">₹<?php echo number_format( (float) $p->amount, 2 ); ?></strong></td>
                                <td>
                                    <span style="padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: <?php echo $status_bg; ?>">
                                        <?php echo esc_html( ucfirst( $p->status ) ); ?>
                                    </span>
                                </td>
                                <td><?php echo esc_html( $p->created_at ); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * Export all subscriber memberships to CSV file (download triggers)
     */
    private function export_memberships_csv() {
        $args = array(
            'role'    => 'subscriber',
            'orderby' => 'user_registered',
            'order'   => 'DESC'
        );
        $members = get_users( $args );

        header( 'Content-Type: text/csv; charset=utf-8' );
        header( 'Content-Disposition: attachment; filename=wlc-members-' . date( 'Y-m-d' ) . '.csv' );

        $output = fopen( 'php://output', 'w' );
        
        // CSV Headers
        fputcsv( $output, array( 'First Name', 'Last Name', 'Email Address', 'Phone Number', 'Profession', 'Membership Tier', 'Status', 'Registration Date' ) );

        foreach ( $members as $m ) {
            $status = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'membershipStatus' ) ?: 'Inactive';
            $tier   = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'membershipTier' ) ?: 'Lotus Club';
            $phone  = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'phone' );
            $prof   = WLC_Core_Auth_Controller::get_wlc_user_meta( $m->ID, 'profession' );
            
            fputcsv( $output, array(
                $m->first_name,
                $m->last_name,
                $m->user_email,
                $phone,
                $prof,
                $tier,
                $status,
                $m->user_registered
            ) );
        }

        fclose( $output );
        exit;
    }

    /**
     * Render Email Settings sub-page
     */
    public function render_email_settings_page() {
        require_once WLC_CORE_PATH . 'templates/smtp-settings.php';
    }

    /**
     * Render Email Logs sub-page
     */
    public function render_email_logs_page() {
        require_once WLC_CORE_PATH . 'templates/smtp-logs.php';
    }

    /**
     * Handle SMTP Settings form save
     */
    public function save_smtp_settings() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access.' );
        }
        check_admin_referer( 'wlc_smtp_settings_nonce' );
        
        WLC_Core_Email_Settings::save( $_POST );
        wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&message=saved' ) );
        exit;
    }

    /**
     * Handle SMTP Test Email submission
     */
    public function send_test_email() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access.' );
        }
        check_admin_referer( 'wlc_send_test_nonce' );

        $test_email = isset( $_POST['test_email'] ) ? sanitize_email( $_POST['test_email'] ) : '';
        $result = WLC_Core_Email_Test::send_test_email( $test_email );

        // Store SMTP debug transcript in a transient for render on redirect
        if ( ! empty( $result['debug_log'] ) ) {
            set_transient( 'wlc_smtp_test_log', $result['debug_log'], 300 );
        }

        if ( $result['success'] ) {
            wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&message=test_success' ) );
        } else {
            wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&error=test_failed' ) );
        }
        exit;
    }

    /**
     * Manually trigger sending queued failed emails
     */
    public function trigger_queue_process() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access.' );
        }
        check_admin_referer( 'wlc_queue_trigger_nonce' );

        WLC_Core_Email_Queue::process_queue();
        wp_redirect( admin_url( 'admin.php?page=wlc-email-settings&message=queue_processed' ) );
        exit;
    }

    /**
     * Handle clearing all email logs
     */
    public function clear_all_logs() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access.' );
        }
        check_admin_referer( 'wlc_clear_logs_nonce' );

        WLC_Core_Email_Logs::clear_all_logs();
        wp_redirect( admin_url( 'admin.php?page=wlc-email-logs&message=logs_cleared' ) );
        exit;
    }

    /**
     * Handle deleting a single email log entry
     */
    public function delete_log() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access.' );
        }
        $id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
        check_admin_referer( 'wlc_delete_log_nonce_' . $id );

        WLC_Core_Email_Logs::delete_log( $id );
        wp_redirect( admin_url( 'admin.php?page=wlc-email-logs&message=log_deleted' ) );
        exit;
    }

    /**
     * Handle manually retrying a single failed log entry
     */
    public function retry_log() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access.' );
        }
        $id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;
        check_admin_referer( 'wlc_retry_log_nonce_' . $id );

        WLC_Core_Email_Logs::retry_send( $id );
        wp_redirect( admin_url( 'admin.php?page=wlc-email-logs&message=retry_queued' ) );
        exit;
    }
}

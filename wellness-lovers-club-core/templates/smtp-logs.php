<?php
/**
 * SMTP Logs view template
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Handle pagination inputs
$limit = 20;
$current_page = isset( $_GET['paged'] ) ? max( 1, intval( $_GET['paged'] ) ) : 1;
$offset = ( $current_page - 1 ) * $limit;

$search = isset( $_GET['s'] ) ? sanitize_text_field( $_GET['s'] ) : '';
$status = isset( $_GET['status'] ) ? sanitize_text_field( $_GET['status'] ) : '';

$logs_data = WLC_Core_Email_Logs::get_logs( $limit, $offset, $search, $status );
$logs = $logs_data['results'];
$total_logs = $logs_data['total'];
$total_pages = ceil( $total_logs / $limit );
?>
<div class="wrap">
    <h1>WLC SMTP Email Logs</h1>
    <p>Monitor all emails sent by the WordPress installation and check transmission results.</p>
    
    <hr style="margin-bottom: 20px;">

    <?php if ( isset( $_GET['message'] ) ) : ?>
        <div class="updated notice is-dismissible">
            <p><?php
                if ( $_GET['message'] === 'log_deleted' ) echo 'Log entry deleted successfully.';
                if ( $_GET['message'] === 'logs_cleared' ) echo 'All log entries have been cleared.';
                if ( $_GET['message'] === 'retry_queued' ) echo 'Log retry sent successfully.';
            ?></p>
        </div>
    <?php endif; ?>

    <!-- Search and Filter Form -->
    <form method="get" action="<?php echo admin_url( 'admin.php' ); ?>" style="margin: 20px 0; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <input type="hidden" name="page" value="wlc-email-logs">
        
        <input type="text" name="s" value="<?php echo esc_attr( $search ); ?>" placeholder="Search recipient or subject..." class="regular-text" style="margin: 0;">
        
        <select name="status" style="margin: 0;">
            <option value="" <?php selected( $status, '' ); ?>>All Delivery Statuses</option>
            <option value="success" <?php selected( $status, 'success' ); ?>>Sent (Success)</option>
            <option value="failed" <?php selected( $status, 'failed' ); ?>>Failed (Errors)</option>
        </select>
        
        <input type="submit" class="button" value="Filter Logs" style="margin: 0;">
        
        <?php if ( ! empty( $search ) || ! empty( $status ) ) : ?>
            <a href="<?php echo admin_url( 'admin.php?page=wlc-email-logs' ); ?>" class="button button-link" style="margin: 0;">Reset Filters</a>
        <?php endif; ?>
        
        <span style="flex-grow: 1;"></span>
        
        <?php if ( $total_logs > 0 ) : ?>
            <a href="<?php echo wp_nonce_url( admin_url( 'admin-post.php?action=wlc_clear_all_logs' ), 'wlc_clear_logs_nonce' ); ?>" class="button button-link-delete" style="color: #b91c1c;" onclick="return confirm('Are you sure you want to permanently clear all email logs? This cannot be undone.');">
                Clear All Logs
            </a>
        <?php endif; ?>
    </form>

    <!-- Logs Table -->
    <table class="wp-list-table widefat fixed striped pages">
        <thead>
            <tr>
                <th style="width: 180px;">Recipient</th>
                <th>Subject</th>
                <th style="width: 150px;">Email Category</th>
                <th style="width: 150px;">Date &amp; Time</th>
                <th style="width: 110px;">Status</th>
                <th style="width: 180px;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if ( empty( $logs ) ) : ?>
                <tr>
                    <td colspan="6">No email logs found.</td>
                </tr>
            <?php else : ?>
                <?php foreach ( $logs as $log ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $log->recipient ); ?></strong></td>
                        <td><?php echo esc_html( $log->subject ); ?></td>
                        <td>
                            <code style="font-size: 11px; background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 4px;">
                                <?php echo esc_html( $log->email_type ); ?>
                            </code>
                        </td>
                        <td><?php echo esc_html( $log->created_at ); ?></td>
                        <td>
                            <?php if ( $log->success ) : ?>
                                <span style="background: #dcfce7; color: #16a34a; font-weight: bold; padding: 3px 8px; border-radius: 12px; font-size: 11px;">
                                    Success
                                </span>
                            <?php else : ?>
                                <span style="background: #fee2e2; color: #ef4444; font-weight: bold; padding: 3px 8px; border-radius: 12px; font-size: 11px; cursor: help;" title="<?php echo esc_attr( $log->failure_reason ); ?>">
                                    Failed
                                </span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if ( ! empty( $log->smtp_response ) || ! empty( $log->failure_reason ) ) : ?>
                                <button type="button" class="button button-small" onclick="toggleDebugInfo(<?php echo $log->id; ?>)">View Error</button>
                            <?php endif; ?>
                            
                            <?php if ( ! $log->success ) : ?>
                                <a href="<?php echo wp_nonce_url( admin_url( 'admin-post.php?action=wlc_retry_log&id=' . $log->id ), 'wlc_retry_log_nonce_' . $log->id ); ?>" class="button button-small button-primary">Retry</a>
                            <?php endif; ?>
                            
                            <a href="<?php echo wp_nonce_url( admin_url( 'admin-post.php?action=wlc_delete_log&id=' . $log->id ), 'wlc_delete_log_nonce_' . $log->id ); ?>" class="button button-small button-link-delete" onclick="return confirm('Delete this log entry?');">Delete</a>
                        </td>
                    </tr>
                    
                    <!-- Expandable Debug/Failure Info Row -->
                    <?php if ( ! empty( $log->smtp_response ) || ! empty( $log->failure_reason ) ) : ?>
                        <tr id="debug-info-row-<?php echo $log->id; ?>" style="display: none; background: #f8fafc;">
                            <td colspan="6" style="padding: 20px;">
                                <div style="border-left: 4px solid #ef4444; padding-left: 15px;">
                                    <strong style="color: #b91c1c;">Failure Reason:</strong>
                                    <p style="margin: 5px 0 15px 0;"><?php echo esc_html( $log->failure_reason ); ?></p>
                                    
                                    <?php if ( ! empty( $log->smtp_response ) ) : ?>
                                        <strong>Raw SMTP / Transmission Logs:</strong>
                                        <pre style="background: #0f172a; color: #38bdf8; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 11px; overflow-x: auto; margin-top: 5px; max-height: 200px;"><?php echo esc_html( $log->smtp_response ); ?></pre>
                                    <?php endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>

    <!-- Pagination Controls -->
    <?php if ( $total_pages > 1 ) : ?>
        <div class="tablenav" style="margin-top: 15px;">
            <div class="tablenav-pages">
                <span class="displaying-num"><?php echo $total_logs; ?> log items</span>
                <span class="pagination-links">
                    <?php if ( $current_page > 1 ) : ?>
                        <a class="prev-page button" href="<?php echo esc_url( add_query_arg( 'paged', $current_page - 1 ) ); ?>">&lsaquo; Prev</a>
                    <?php endif; ?>
                    
                    <span class="paging-input">
                        <span class="current-page"><?php echo $current_page; ?></span> of <span class="total-pages"><?php echo $total_pages; ?></span>
                    </span>
                    
                    <?php if ( $current_page < $total_pages ) : ?>
                        <a class="next-page button" href="<?php echo esc_url( add_query_arg( 'paged', $current_page + 1 ) ); ?>">Next &rsaquo;</a>
                    <?php endif; ?>
                </span>
            </div>
        </div>
    <?php endif; ?>
</div>

<script>
function toggleDebugInfo(id) {
    var row = document.getElementById('debug-info-row-' + id);
    if (row.style.display === 'none') {
        row.style.display = 'table-row';
    } else {
        row.style.display = 'none';
    }
}
</script>

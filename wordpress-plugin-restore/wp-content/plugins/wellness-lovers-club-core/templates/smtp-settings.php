<?php
/**
 * SMTP Settings view template
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$settings = WLC_Core_Email_Settings::get_all();
$mask = WLC_Core_Email_Security::mask_value( $settings['smtp_pass'] );
$queue_count = WLC_Core_Email_Queue::get_queue_count();
?>
<div class="wrap">
    <h1>WLC SMTP Email Settings</h1>
    <p>Configure custom SMTP delivery settings to bypass local webserver mail limitations and improve deliverability.</p>
    
    <hr style="margin-bottom: 20px;">

    <?php if ( isset( $_GET['message'] ) ) : ?>
        <div class="updated notice is-dismissible">
            <p><?php
                if ( $_GET['message'] === 'saved' ) echo 'SMTP Settings saved successfully.';
                if ( $_GET['message'] === 'test_success' ) echo 'Test email sent successfully!';
            ?></p>
        </div>
    <?php endif; ?>

    <?php if ( isset( $_GET['error'] ) ) : ?>
        <div class="error notice is-dismissible">
            <p><?php
                if ( $_GET['error'] === 'test_failed' ) echo 'Failed to send test email. Review connection diagnostics below.';
            ?></p>
        </div>
    <?php endif; ?>

    <div style="display: flex; gap: 30px; align-items: flex-start; margin-top: 20px;">
        <!-- Left Side: Form Configurations -->
        <div style="flex: 2; background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            <h2 style="margin-top: 0; font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">SMTP Configurations</h2>
            
            <form method="post" action="<?php echo admin_url( 'admin-post.php' ); ?>">
                <input type="hidden" name="action" value="wlc_save_smtp_settings">
                <?php wp_nonce_field( 'wlc_smtp_settings_nonce' ); ?>
                
                <table class="form-table">
                    <tr>
                        <th><label for="smtp_host">SMTP Host</label></th>
                        <td>
                            <input name="smtp_host" type="text" id="smtp_host" value="<?php echo esc_attr( $settings['smtp_host'] ); ?>" class="regular-text" placeholder="smtp.gmail.com">
                            <p class="description">Your mail server hostname (e.g. smtp.gmail.com, smtp.sendgrid.net, etc.)</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="smtp_port">SMTP Port</label></th>
                        <td>
                            <input name="smtp_port" type="number" id="smtp_port" value="<?php echo esc_attr( $settings['smtp_port'] ); ?>" class="small-text">
                            <p class="description">Common ports: 587 (TLS), 465 (SSL), or 25 (None)</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="smtp_encryption">Encryption Type</label></th>
                        <td>
                            <select name="smtp_encryption" id="smtp_encryption">
                                <option value="tls" <?php selected( $settings['smtp_encryption'], 'tls' ); ?>>TLS (Recommended)</option>
                                <option value="ssl" <?php selected( $settings['smtp_encryption'], 'ssl' ); ?>>SSL</option>
                                <option value="none" <?php selected( $settings['smtp_encryption'], 'none' ); ?>>None</option>
                            </select>
                            <p class="description">Encryption standard used by your mail server.</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="smtp_auth">SMTP Authentication</label></th>
                        <td>
                            <input name="smtp_auth" type="checkbox" id="smtp_auth" value="1" <?php checked( $settings['smtp_auth'], '1' ); ?>>
                            <label for="smtp_auth">Require user login credentials</label>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="smtp_user">SMTP Username</label></th>
                        <td>
                            <input name="smtp_user" type="text" id="smtp_user" value="<?php echo esc_attr( $settings['smtp_user'] ); ?>" class="regular-text" placeholder="user@domain.com">
                        </td>
                    </tr>

                    <tr>
                        <th><label for="smtp_pass">SMTP Password</label></th>
                        <td>
                            <input name="smtp_pass" type="password" id="smtp_pass" value="<?php echo esc_attr( $mask ); ?>" class="regular-text">
                            <p class="description">Leave unchanged to keep your currently saved password.</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="from_email">From Email Address</label></th>
                        <td>
                            <input name="from_email" type="email" id="from_email" value="<?php echo esc_attr( $settings['from_email'] ); ?>" class="regular-text" required>
                            <p class="description">Email address that all system messages are sent from.</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="from_name">From Sender Name</label></th>
                        <td>
                            <input name="from_name" type="text" id="from_name" value="<?php echo esc_attr( $settings['from_name'] ); ?>" class="regular-text">
                            <p class="description">Sender display name (e.g. Wellness Lovers Club)</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="reply_to_email">Reply-To Email Address</label></th>
                        <td>
                            <input name="reply_to_email" type="email" id="reply_to_email" value="<?php echo esc_attr( $settings['reply_to_email'] ); ?>" class="regular-text" placeholder="support@wellnessloversclub.com">
                            <p class="description">Optional: replies to system emails will go here.</p>
                        </td>
                    </tr>

                    <tr>
                        <th><label for="timeout">Connection Timeout</label></th>
                        <td>
                            <input name="timeout" type="number" id="timeout" value="<?php echo esc_attr( $settings['timeout'] ); ?>" class="small-text"> seconds
                        </td>
                    </tr>

                    <tr>
                        <th><label for="debug_mode">Enable Debug logs</label></th>
                        <td>
                            <input name="debug_mode" type="checkbox" id="debug_mode" value="1" <?php checked( $settings['debug_mode'], '1' ); ?>>
                            <label for="debug_mode">Capture detailed transmission logs on error</label>
                        </td>
                    </tr>
                </table>

                <p class="submit">
                    <input type="submit" name="submit" id="submit" class="button button-primary" value="Save Settings">
                </p>
            </form>
        </div>

        <!-- Right Side: Status Diagnostics -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
            <div style="background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h2 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Connection Diagnostics</h2>
                
                <div style="margin: 15px 0;">
                    <strong>Service Connection Status:</strong>
                    <div style="margin-top: 8px;">
                        <?php if ( ! empty( $settings['smtp_host'] ) ) : ?>
                            <span style="background: #dcfce7; color: #16a34a; font-weight: bold; padding: 6px 12px; border-radius: 12px; font-size: 13px;">
                                Active (SMTP Mode)
                            </span>
                        <?php else : ?>
                            <span style="background: #f1f5f9; color: #64748b; font-weight: bold; padding: 6px 12px; border-radius: 12px; font-size: 13px;">
                                Inactive (Local Mail Mode)
                            </span>
                        <?php endif; ?>
                    </div>
                </div>

                <div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <strong>Email Queue Status:</strong>
                    <p style="margin: 10px 0; font-size: 13px;">
                        There are currently <strong><?php echo $queue_count; ?></strong> emails waiting in the retry queue.
                    </p>
                    <?php if ( $queue_count > 0 ) : ?>
                        <form method="post" action="<?php echo admin_url( 'admin-post.php' ); ?>">
                            <input type="hidden" name="action" value="wlc_trigger_queue_process">
                            <?php wp_nonce_field( 'wlc_queue_trigger_nonce' ); ?>
                            <input type="submit" class="button button-small" value="Process Retry Queue Now">
                        </form>
                    <?php endif; ?>
                </div>
            </div>

            <div style="background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h2 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Send Test Email</h2>
                
                <form method="post" action="<?php echo admin_url( 'admin-post.php' ); ?>">
                    <input type="hidden" name="action" value="wlc_send_test_email">
                    <?php wp_nonce_field( 'wlc_send_test_nonce' ); ?>
                    
                    <div style="margin: 15px 0;">
                        <label for="test_email" style="display: block; margin-bottom: 6px; font-weight: bold;">Send To Address:</label>
                        <input name="test_email" type="email" id="test_email" class="regular-text" style="width: 100%;" placeholder="name@domain.com" required>
                    </div>
                    
                    <input type="submit" class="button" value="Send Diagnostic Test">
                </form>
            </div>
        </div>
    </div>

    <!-- Bottom: SMTP Debug Console (if a test email was attempted) -->
    <?php
    $test_log = get_transient( 'wlc_smtp_test_log' );
    if ( ! empty( $test_log ) ) :
        delete_transient( 'wlc_smtp_test_log' ); // Consume transient
        ?>
        <div style="background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 30px; border: 1px solid #cbd5e1;">
            <h2 style="margin-top: 0; font-size: 16px; color: #b91c1c;">SMTP Debug Console Output</h2>
            <p>Below is the transcript of the communication between your server and the SMTP host.</p>
            <pre style="background: #0f172a; color: #38bdf8; padding: 20px; border-radius: 6px; font-family: monospace; font-size: 12px; line-height: 1.5; overflow-x: auto; max-height: 450px; border: 1px solid #1e293b;"><?php echo esc_html( $test_log ); ?></pre>
        </div>
    <?php endif; ?>
</div>

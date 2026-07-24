# AntigravityB CMS Backend Plugin Installation Guide

Follow these steps to deploy, configure, and activate the `antigravityb-api` custom WordPress plugin on your headless CMS server.

---

## 1. Prerequisites
- **WordPress**: Version 6.0 or higher.
- **PHP**: Version 8.2 or higher.
- **SSL Certificate**: Active HTTPS setup (required for JWT secure transmission).

---

## 2. Server Deployment
1.  Compress the `antigravityb-api/` directory into a `.zip` archive.
2.  Log in to your WordPress Admin Dashboard.
3.  Navigate to **Plugins** > **Add New** > **Upload Plugin**.
4.  Choose the `antigravityb-api.zip` file and click **Install Now**.
5.  Once uploaded, click **Activate Plugin**.

*Alternatively, upload the folder via SFTP/SSH directly to `/wp-content/plugins/antigravityb-api/` and activate it from the WP-CLI command or dashboard.*

---

## 3. Configuration (`wp-config.php`)
You must define the signing key in your WordPress configuration file to enable JWT.
1.  Open `/wp-config.php` in your server editor.
2.  Add the following lines before the `/* That's all, stop editing! Happy blogging. */` comment:

```php
/**
 * JWT Authentication Secrets
 */
define( 'JWT_AUTH_SECRET_KEY', 'your-random-32-character-alphanumeric-signing-key-here' );
define( 'JWT_AUTH_EXPIRE', 604800 ); // Expiration in seconds (604800 = 7 days)
```

---

## 4. Troubleshooting CORS issues
If your frontend application is hosted on a domain other than `localhost:3000`, verify that the CORS filters in `middleware/class-cors.php` allow the domain or modify the regex in `handle_cors()` callback to match your production domain.

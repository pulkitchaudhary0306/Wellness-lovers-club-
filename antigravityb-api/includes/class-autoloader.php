<?php
namespace AntigravityB\API\Includes;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Autoloader {

    /**
     * Register autoloader callback
     */
    public static function register() {
        spl_autoload_register( array( __CLASS__, 'autoload' ) );
    }

    /**
     * Autoload mapping callback
     *
     * Maps AntigravityB\API\Namespace\ClassName to AGB_API_PATH/namespace/class-class-name.php
     */
    public static function autoload( $class ) {
        $prefix = 'AntigravityB\\API\\';
        $len    = strlen( $prefix );

        if ( strncmp( $prefix, $class, $len ) !== 0 ) {
            return;
        }

        $relative_class = substr( $class, $len );
        $parts          = explode( '\\', $relative_class );

        if ( empty( $parts ) ) {
            return;
        }

        $class_name = array_pop( $parts );
        
        // Convert ClassName to class-class-name.php (WordPress Standard)
        $formatted_name = strtolower( preg_replace( '/(?<!^)[A-Z]/', '-$0', $class_name ) );
        $file_name      = 'class-' . $formatted_name . '.php';

        $subdirs     = array_map( 'strtolower', $parts );
        $subdir_path = implode( DIRECTORY_SEPARATOR, $subdirs );
        
        $file = AGB_API_PATH . ( $subdir_path ? $subdir_path . DIRECTORY_SEPARATOR : '' ) . $file_name;

        if ( file_exists( $file ) ) {
            require_once $file;
        }
    }
}

Autoloader::register();

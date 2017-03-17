<?php
/**
 * Plugin Name:       Sample plugin.
 * Description:       Sample description
 * Version:           1.1.1
 * Author:            ThemeIsle
 * Author URI:        https://themeisle.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       sample-plugin
 * WordPress Available:  no
 * Requires License:    no
 */

require_once 'vendor/load.php';

add_filter( 'themeisle_sdk_products', '_add_product' );
function _add_product( $products ) {
	$products[] = __FILE__;

	return $products;
}

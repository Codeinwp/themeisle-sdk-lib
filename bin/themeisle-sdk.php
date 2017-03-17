<?php
/**
 * Plugin Name:       Themeisle SDK
 * Description:       Themeisle SDK QA version.
 * Version:           1.0.0
 * Author:            ThemeIsle
 * Author URI:        https://themeisle.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       sample-plugin
 * WordPress Available:  no
 * Requires License:    no
 */

require_once 'load.php';

function _add_product( $products ) {
	$products[] = __FILE__;

	return $products;
}

add_filter( 'themeisle_sdk_products', '_add_product' );
add_filter( 'themeisle_sdk_promo_debug', '__return_true' );
add_filter( 'themeisle_sdk_load_promotions', function ( $promos ) {
	$promos[] = 'otter';

	return $promos;
} );

// Add dummy root page in dashboard for the sdk:
add_action( 'admin_menu', function () {
	add_menu_page( 'Themeisle SDK', 'Themeisle SDK', 'manage_options', 'themeisle-sdk', function () {
		echo '<div class="wrap">';
		echo '<h1>Themeisle SDK</h1>';
		echo '<p>Dummy Page.</p>';
		echo '</div>';
	} );
} );

add_filter( 'themeisle_sdk_about_us_metadata', function ( $config ) {
	return [
		'location'         => 'themeisle-sdk',
		'logo'             => 'https://placehold.co/200x50.jpg',
		'page_menu'        => [
			[ 'text' => 'SDK GitHub Issues', 'url' => esc_url( 'https://github.com/codeinwp/themeisle-sdk/issues' ) ],
			[ 'text' => 'Themeisle', 'url' => esc_url( 'https://themeisle.com' ) ]
		], // Optional
		'has_upgrade_menu' => true,
		'upgrade_link'     => esc_url( 'https://themeisle.com/themes/neve/pricing/' ),
		'upgrade_text'     => 'Get Pro Version',
	];
} );
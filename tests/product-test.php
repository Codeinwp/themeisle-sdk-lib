<?php
/**
 * Product data tests.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test product class.
 */
class Product_Test extends WP_UnitTestCase {
	/**
	 * Test product from plugin
	 */
	public function test_product_from_plugin() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';

		$product = new \ThemeisleSDK\Product( $file );

		$this->assertEquals( $product->get_type(), 'plugin' );
		$this->assertEquals( $product->get_slug(), 'sample_plugin' );
		$this->assertEquals( $product->get_store_name(), 'ThemeIsle' );
		$this->assertEquals( $product->get_version(), '1.1.1' );
		$this->assertGreaterThanOrEqual( $product->get_install_time(), time() );
		$this->assertEquals( $product->get_store_url(), 'https://store.themeisle.com/' );
		$this->assertFalse( $product->requires_license() );
		$this->assertFalse( $product->is_wordpress_available() );
	}

	/**
	 * Test product from theme.
	 */
	public function test_product_from_theme() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		$product = new \ThemeisleSDK\Product( $file );

		$this->assertEquals( $product->get_type(), 'theme' );
		$this->assertEquals( $product->get_slug(), 'sample_theme' );
		$this->assertEquals( $product->get_store_name(), 'ThemeIsle' );
		$this->assertEquals( $product->get_version(), '2.0.18' );
		$this->assertGreaterThanOrEqual( $product->get_install_time(), time() );
		$this->assertEquals( $product->get_store_url(), 'https://store.themeisle.com/' );
		$this->assertTrue( $product->requires_license() );
		$this->assertTrue( $product->is_wordpress_available() );
	}
}

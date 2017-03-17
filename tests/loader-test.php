<?php
/**
 * Loader manager test.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test loader manager.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class Loader_Test extends WP_UnitTestCase {

	/**
	 * Test loading of invalid file.
	 */
	public function test_products_invalid_subscribe() {
		$file = dirname( __FILE__ ) . '/invalid/sample_products/sample_plugin/plugin-file.php';
		\ThemeisleSDK\Loader::add_product( $file );
		$this->assertEmpty( ThemeisleSDK\Loader::get_products() );
	}

	/**
	 * Test loading of plugin file.
	 */
	public function test_products_valid_subscribe_plugin() {
		$file = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';

		\ThemeisleSDK\Loader::add_product( $file );

		$this->assertEquals( count( ThemeisleSDK\Loader::get_products() ), 1 );
	}

	/**
	 * Test loading of theme file.
	 */
	public function test_products_valid_subscribe_theme() {
		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		\ThemeisleSDK\Loader::add_product( $file );

		$this->assertEquals( count( ThemeisleSDK\Loader::get_products() ), 1 );
	}


}

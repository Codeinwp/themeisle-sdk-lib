<?php
/**
 * Licenser feature test.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test licenser feature.
 */
class Licenser_Test extends WP_UnitTestCase {


	/**
	 * Test product from partner loading.
	 */
	public function test_product_partner_module_loading() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme_external/style.css';

		\ThemeisleSDK\Loader::add_product( $file );

		$modules = \ThemeisleSDK\Common\Module_Factory::get_modules_map();

		$this->assertArrayHasKey( 'sample_theme_external', $modules );
		$modules['sample_theme_external'] = array_filter(
			$modules['sample_theme_external'],
			[ $this, 'filter_value' ]
		);
		$this->assertCount( 1, $modules['sample_theme_external'] );

	}

	private function filter_value( $value ) {
		return ( get_class( $value ) === 'ThemeisleSDK\\Modules\\Licenser' );
	}

	/**
	 * Test product from partner loading.
	 */
	public function test_licenser_product_loading() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		\ThemeisleSDK\Loader::add_product( $file );

		$modules = \ThemeisleSDK\Common\Module_Factory::get_modules_map();

		$this->assertArrayHasKey( 'sample_theme', $modules );
		$this->assertGreaterThan( 0, count( $modules['sample_theme'] ) );

	}

	/**
	 * Test if licenser is disabled on partners.
	 */
	public function test_licenser_can_load_partner() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme_external/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Licenser() )->can_load( $product ) );

	}


	/**
	 * Test if licenser should load for admins.
	 */
	public function test_licenser_can_load() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Licenser() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Licenser', ( new \ThemeisleSDK\Modules\Licenser() )->load( $product ) );

	}


}

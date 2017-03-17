<?php
/**
 * Uninstall feature test.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test Uninstall feedback feature.
 */
class Uninstall_Feedback_Test extends WP_UnitTestCase {


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
		$this->assertCount( 0, $modules['sample_theme_external'] );

	}

	private function filter_value( $value ) {
		if ( ! is_object( $value ) ) {
			return false;
		}

		return ( get_class( $value ) === 'ThemeisleSDK\\Modules\\Uninstall_Feedback' );
	}
	/**
	 * Test product from partner loading.
	 */
	public function test_un_feedback_product_loading() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		global $pagenow;
		$pagenow = 'theme-install.php';
		\ThemeisleSDK\Loader::add_product( $file );

		$modules = \ThemeisleSDK\Common\Module_Factory::get_modules_map();

		$this->assertArrayHasKey( 'sample_theme', $modules );
		$modules['sample_theme'] = array_filter(
			$modules['sample_theme'],
			[ $this, 'filter_value' ]
		);
		$this->assertCount( 1, $modules['sample_theme'] );
	}

	/**
	 * Test if uninstall feedback is disabled on partners.
	 */
	public function test_un_feedback_can_load_partner() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme_external/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->can_load( $product ) );

	}


	/**
	 * Test if  uninstall feedback  should load for non whitelisted pages.
	 */
	public function test_un_feedback_load_non_pages() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$product = new \ThemeisleSDK\Product( $file );
		global $pagenow;
		$pagenow = 'index.php';
		$this->assertFalse( ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->can_load( $product ) );

	}

	/**
	 * Test if  uninstall feedback  should load for plugins listing.
	 */
	public function test_un_feedback_load_plugins_pages() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin-file.php';
		$product = new \ThemeisleSDK\Product( $file );
		global $pagenow;
		$pagenow = 'plugins.php';

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Uninstall_Feedback', ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->load( $product ) );

	}

	/**
	 * Test if  uninstall feedback  should load for themes install.
	 */
	public function test_un_feedback_load_themes_pages() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$product = new \ThemeisleSDK\Product( $file );
		global $pagenow;
		$pagenow = 'theme-install.php';

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Uninstall_Feedback', ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->load( $product ) );

	}

	/**
	 * Test if  uninstall feedback  loads on ajax requests.
	 */
	public function test_un_feedback_load_ajax() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		define( 'DOING_AJAX', true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Uninstall_Feedback', ( new \ThemeisleSDK\Modules\Uninstall_Feedback() )->load( $product ) );

	}


}

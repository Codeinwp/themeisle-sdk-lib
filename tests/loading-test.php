<?php
/**
 * `loading` test.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test sdk loading.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class Sdk_Loading_Test extends WP_UnitTestCase {
	/**
	 * Test if the SDK is loading properly and version is exported.
	 */
	public function test_version_exists() {
		global $themeisle_sdk_max_version;
		$this->assertTrue( isset( $themeisle_sdk_max_version ) );
		$this->assertTrue( version_compare( '0.0.1', $themeisle_sdk_max_version, '<' ) );
	}

	/**
	 * Test that classes are properly loaded.
	 */
	public function test_class_loading() {
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Loader' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Product' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Dashboard_Widget' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Rollback' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Uninstall_Feedback' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Licenser' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Notification' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Logger' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Translate' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Review' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Modules\\Recommendation' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Common\\Abstract_Module' ) );
		$this->assertTrue( class_exists( 'ThemeisleSDK\\Common\\Module_factory' ) );
	}

	/**
	 * Test the loaded products.
	 */
	public function test_loaded_defaults() {
		$this->assertEquals( count( \ThemeisleSDK\Loader::get_products() ), 0 );
		$this->assertGreaterThan( 0, count( \ThemeisleSDK\Loader::get_modules() ) );

	}


}

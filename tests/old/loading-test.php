<?php
/**
 * Loading test for lower PHP versions.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test sdk loading.
 */
class Sdk_Loading_Old_Test extends WP_UnitTestCase {
	/**
	 * Test if the SDK is not loading on lower php versions.
	 */
	public function test_sdk_not_loaded() {
		$this->assertFalse( class_exists( 'ThemeisleSDK\\Loader' ) );
	}

}

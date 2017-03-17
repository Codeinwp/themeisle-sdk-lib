<?php
/**
 * Notification feature test.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test notification feature.
 */
class Notification_Test extends WP_UnitTestCase {

	protected static $editor_id;
	protected static $admin_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$editor_id = $factory->user->create(
			array(
				'role' => 'editor',
			)
		);
		self::$admin_id  = $factory->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( self::$editor_id );
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$editor_id );
		self::delete_user( self::$admin_id );
	}

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
		return ( get_class( $value ) === 'ThemeisleSDK\\Modules\\Notification' );
	}

	public function test_notification_product_loading() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		\ThemeisleSDK\Loader::add_product( $file );

		$modules = \ThemeisleSDK\Common\Module_Factory::get_modules_map();

		$this->assertArrayHasKey( 'sample_theme', $modules );
		$this->assertGreaterThan( 0, count( $modules['sample_theme'] ) );

	}

	public function test_notification_can_load_partner() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme_external/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Notification() )->can_load( $product ) );

	}

	public function test_notification_load_non_admins() {
		wp_set_current_user( self::$editor_id );
		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Notification() )->can_load( $product ) );

	}

	public function test_notification_not_load_for_new() {
		wp_set_current_user( self::$admin_id );
		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		$product = new \ThemeisleSDK\Product( $file );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Notification() )->can_load( $product ) );

	}

	public function test_notification_load_old() {
		wp_set_current_user( self::$admin_id );

		update_option( 'sample_theme_install', ( time() - MONTH_IN_SECONDS ) );

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		$product = new \ThemeisleSDK\Product( $file );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Notification() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Notification', ( new \ThemeisleSDK\Modules\Notification() )->load( $product ) );

	}


}

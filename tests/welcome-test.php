<?php
/**
 * Welcome module feature test.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test notification feature.
 */
class Welcome_Test extends WP_UnitTestCase {

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
		return ( get_class( $value ) === 'ThemeisleSDK\\Modules\\Welcome' );
	}

	private function add_filter( $slug, $enabled = true ) {
		add_filter(
			$slug . '_welcome_metadata',
			function () use ( $enabled ) {
				return [
					'is_enabled' => $enabled,
					'cta_link'   => tsdk_utmify( 'https://link_to_upgrade.with/?discount=discunt30', 'test', 'unit_test' ),
				];
			} 
		);
	}

	private function cycle_module_load( $products_array ) {
		foreach ( $products_array as $product ) {
			$module = new \ThemeisleSDK\Modules\Welcome();
			$module->can_load( $product );
			$module->load( $product );
		}
	}

	public function test_welcome_product_loading() {

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		\ThemeisleSDK\Loader::add_product( $file );

		$modules = \ThemeisleSDK\Common\Module_Factory::get_modules_map();

		$this->assertArrayHasKey( 'sample_theme', $modules );
		$this->assertGreaterThan( 0, count( $modules['sample_theme'] ) );

	}

	public function test_welcome_not_load_for_if_meta_is_disabled() {
		wp_set_current_user( self::$admin_id );
		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		$product = new \ThemeisleSDK\Product( $file );

		$this->add_filter( $product->get_key(), false );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $product ) );

	}

	public function test_welcome_not_load_if_new() {
		wp_set_current_user( self::$admin_id );
		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		$product = new \ThemeisleSDK\Product( $file );

		$this->add_filter( $product->get_key(), true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $product ) );
		$this->assertTrue( is_null( ( new \ThemeisleSDK\Modules\Welcome() )->load( $product ) ) );
	}

	public function test_welcome_load_after_seven_days() {
		wp_set_current_user( self::$admin_id );

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		update_option( 'sample_theme_install', ( time() - DAY_IN_SECONDS * 7 ) );
		$product = new \ThemeisleSDK\Product( $file );

		$this->add_filter( $product->get_key(), true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Welcome', ( new \ThemeisleSDK\Modules\Welcome() )->load( $product ) );
	}

	public function test_welcome_not_load_after_twelve_days() {
		wp_set_current_user( self::$admin_id );

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		update_option( 'sample_theme_install', ( time() - DAY_IN_SECONDS * 13 ) );
		$product = new \ThemeisleSDK\Product( $file );

		$this->add_filter( $product->get_key(), true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $product ) );
		$this->assertTrue( is_null( ( new \ThemeisleSDK\Modules\Welcome() )->load( $product ) ) );
	}

	public function test_welcome_not_load_before_seven_days() {
		wp_set_current_user( self::$admin_id );

		$file = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';

		update_option( 'sample_theme_install', ( time() - DAY_IN_SECONDS * 6 ) );
		$product = new \ThemeisleSDK\Product( $file );

		$this->add_filter( $product->get_key(), true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $product ) );
		$this->assertTrue( is_null( ( new \ThemeisleSDK\Modules\Welcome() )->load( $product ) ) );
	}

	public function test_welcome_random_notification() {
		wp_set_current_user( self::$admin_id );

		$theme  = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$plugin = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';

		update_option( 'sample_theme_install', ( time() - DAY_IN_SECONDS * 7 ) );
		$theme_product = new \ThemeisleSDK\Product( $theme );
		$this->add_filter( $theme_product->get_key(), true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $theme_product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Welcome', ( new \ThemeisleSDK\Modules\Welcome() )->load( $theme_product ) );

		update_option( 'sample_plugin_install', ( time() - DAY_IN_SECONDS * 7 ) );
		$plugin_product = new \ThemeisleSDK\Product( $plugin );
		$this->add_filter( $plugin_product->get_key(), true );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Welcome() )->can_load( $plugin_product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Welcome', ( new \ThemeisleSDK\Modules\Welcome() )->load( $plugin_product ) );


		$this->cycle_module_load( [ $theme_product, $plugin_product ] );

		$registered_notifications = apply_filters( 'themeisle_sdk_registered_notifications', [] );
		$this->assertTrue( ! empty( $registered_notifications ) );

		$displayed_notifications = [];
		for ( $i = 0; $i < 10; $i++ ) {
			remove_all_filters( 'themeisle_sdk_registered_notifications' );
			$this->cycle_module_load( [ $theme_product, $plugin_product ] );

			$registered_notifications       = apply_filters( 'themeisle_sdk_registered_notifications', [] );
			$id                             = $registered_notifications[0]['id'];
			$displayed_notifications[ $id ] = true;
		}

		$this->assertTrue( count( $displayed_notifications ) === 2 );
		$this->assertTrue( array_key_exists( 'sample_plugin_welcome_upsell_flag', $displayed_notifications ) );
		$this->assertTrue( array_key_exists( 'sample_theme_welcome_upsell_flag', $displayed_notifications ) );
	}
}

<?php
/**
 * Featured Plugins module tests.
 *
 * @package ThemeIsleSDK
 */


/**
 * Mock the plugins_api function.
 *
 * @param string       $action The API function being performed.
 * @param array|object $args   Plugin API arguments.
 *
 * @return object
 */
function plugins_api( $action, $args ) {
	return mock_plugin_api_results();
}

/**
 * Mock the plugin API results.
 *
 * @return object
 */
function mock_plugin_api_results() {
	$featured_plugin = array(
		'name'                     => 'Featured Plugin',
		'slug'                     => 'featured-plugin',
		'version'                  => '7.2.0',
		'author'                   => 'PHPUnit Featured Plugin',
		'author_profile'           => 'https://example.com/featured-plugin',
		'requires'                 => '6.3',
		'tested'                   => '6.5',
		'requires_php'             => '7.0',
		'requires_plugins'         => array(),
		'rating'                   => 80,
		'ratings'                  => array(
			5 => 3,
			4 => 0,
			3 => 0,
			2 => 0,
			1 => 1,
		),
		'num_ratings'              => 4,
		'support_threads'          => 1,
		'support_threads_resolved' => 0,
		'active_installs'          => 6000,
		'downloaded'               => 316410,
		'last_updated'             => '2024-03-11 9:17pm GMT',
		'added'                    => '2021-02-11',
		'homepage'                 => '',
		'short_description'        => 'Short Desc',
		'description'              => 'Long Desc',
		'download_link'            => 'https://example.com/plugin/featured-plugin.7.2.0.zip',
		'tags'                     => array(
			'auto-update'    => 'auto-update',
			'failure'        => 'failure',
			'feature-plugin' => 'feature-plugin',
			'update'         => 'update',
		),
		'donate_link'              => '',
		'icons'                    => array(
			'1x'  => 'https://example.com/featured-plugin/assets/icon.svg?rev=2787335',
			'svg' => 'https://example.com/featured-plugin/assets/icon.svg?rev=2787335',
		),
	);

	$results = array( $featured_plugin );

	$api_result          = new stdClass();
	$api_result->info    = new stdClass();
	$api_result->plugins = $results;
	$api_result->info    = array( 'results' => 1 );

	return $api_result;
}

/**
 * Test Featured Plugins loading.
 */
class Featured_Plugins_Test extends WP_UnitTestCase {

	private static $admin_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			array(
				'role' => 'administrator',
			)
		);

		wp_set_current_user( self::$admin_id );
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$admin_id );
	}

	/**
	 * Utility method to change the value of a protected property.
	 *
	 * @param \ThemeisleSDK\Product $object The object.
	 * @param string                $property The property name.
	 * @param mixed                 $new_value The new value.
	 *
	 * @return void
	 * @throws ReflectionException Throws an exception if the property does not exist.
	 */
	private function set_protected_property( $object, $property, $new_value ) {
		$reflection = new ReflectionClass( $object );
		$property   = $reflection->getProperty( $property );
		$property->setAccessible( true );
		$property->setValue( $object, $new_value );
	}

	/**
	 * Test plugin not loading without config.
	 */
	public function test_plugin_not_loading_if_not_pro() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->set_protected_property( $plugin_product, 'wordpress_available', true );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Featured_Plugins() )->can_load( $plugin_product ) );
	}

	/**
	 * Test plugin loading for pro.
	 */
	public function test_plugin_loading_for_pro() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_pro_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Featured_Plugins() )->can_load( $plugin_product ) );
	}

	/**
	 * Test plugin not loading for slugs that contain pro as part of a word. Eg. Product.
	 */
	public function test_plugin_loading_for_words_w_pro() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_pro_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->set_protected_property( $plugin_product, 'wordpress_available', true );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Featured_Plugins() )->can_load( $plugin_product ) );
	}

	/**
	 * Test plugin not loading for pro if disabled.
	 */
	public function test_plugin_not_loading_for_pro_disabled() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_pro_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		add_filter( 'themeisle_sdk_disable_featured_plugins', '__return_true' );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Featured_Plugins() )->can_load( $plugin_product ) );
	}

	/**
	 * Test the filter is added.
	 */
	public function test_plugins_api_result_filter_added() {
		wp_set_current_user( self::$admin_id );
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_pro_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$module = new \ThemeisleSDK\Modules\Featured_Plugins();
		$module->load( $plugin_product );

		$this->assertTrue( (bool) has_filter( 'plugins_api_result', [ $module, 'filter_plugin_api_results' ] ) );
	}

	/**
	 * Test the filter is not added if already registered.
	 */
	public function test_plugins_api_will_not_add_filter_if_marked_as_registered() {
		wp_set_current_user( self::$admin_id );
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_pro_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		add_filter( 'themeisle_sdk_plugin_api_filter_registered', '__return_true' );

		$module = new \ThemeisleSDK\Modules\Featured_Plugins();
		$module->load( $plugin_product );

		$this->assertFalse( (bool) has_filter( 'plugins_api_result', [ $module, 'filter_plugin_api_results' ] ) );

		add_filter( 'themeisle_sdk_plugin_api_filter_registered', '__return_false' );

		$module->load( $plugin_product );
		$this->assertTrue( (bool) has_filter( 'plugins_api_result', [ $module, 'filter_plugin_api_results' ] ) );
	}

	/**
	 * Test that even if a previous filter mutates the result type properties, the plugin API filter still works.
	 */
	public function test_plugins_api_result_filter() {
		wp_set_current_user( self::$admin_id );
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_pro_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$module = new \ThemeisleSDK\Modules\Featured_Plugins();
		$module->load( $plugin_product );

		$api_result       = plugins_api( 'query_plugins', array() );
		$args             = new stdClass();
		$args->page       = 1;
		$args->per_page   = 36;
		$args->browse     = 'featured';
		$args->wp_version = '6.4';

		$filtered_api_result = apply_filters( 'plugins_api_result', $api_result, 'query_plugins', $args );
		$this->assertEquals( 1, count( $filtered_api_result->plugins ) );

		// Mutate the plugins property to be an object.
		add_filter(
			'plugins_api_result',
			function( $results, $action, $args ) {
				$results->plugins = (object) $results->plugins;
				return $results;
			},
			9,
			3
		);

		// This should also pass if the result type properties are mutated.
		$filtered_api_result = apply_filters( 'plugins_api_result', $api_result, 'query_plugins', $args );
		$this->assertEquals( 1, count( $filtered_api_result->plugins ) );


		// Mutate a plugin from list to be an object.
		add_filter(
			'plugins_api_result',
			function( $results, $action, $args ) {
				$plugin           = $results->plugins[0];
				$plugin['name']   = 'Optimole';
				$plugin['slug']   = 'optimole-wp';
				$plugins          = $results->plugins;
				$plugins[]        = (object) $plugin;
				$results->plugins = $plugins;

				return $results;
			},
			11,
			3
		);

		// This should also pass if the plugin array contains a object within the list.
		$filtered_api_result = apply_filters( 'plugins_api_result', $api_result, 'query_plugins', $args );
		$this->assertEquals( 2, count( $filtered_api_result->plugins ) );
	}

}

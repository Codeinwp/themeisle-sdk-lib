<?php
/**
 * Dashboard widget related tests.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test Dashboard widget class.
 */
class Dashboard_Widget_Test extends WP_UnitTestCase {

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
		$this->assertEquals( count( $modules['sample_theme_external'] ), 0 );

	}

	private function filter_value( $value ) {
		return ( get_class( $value ) === 'ThemeisleSDK\\Modules\\Dashboard_widget' );
	}

	/**
	 * Test if dashboard widget is disabled on partners.
	 */
	public function test_dashboard_widget_can_load_partner() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme_external/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Dashboard_Widget() )->can_load( $product ) );

	}

	/**
	 * Test if dashboard widget is disabled on partners.
	 */
	public function test_dashboard_widget_can_load_regular() {

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$product = new \ThemeisleSDK\Product( $file );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Dashboard_Widget() )->can_load( $product ) );
		$this->assertInstanceOf( 'ThemeisleSDK\\Modules\\Dashboard_Widget', ( new \ThemeisleSDK\Modules\Dashboard_Widget() )->load( $product ) );

	}

	/**
	 * Private function to set up a tmp file for error log.
	 *
	 * @return false|resource
	 */
	private function setup_tmp_error_log_file() {
		$error_log_tmp_file = tmpfile();
		error_reporting( E_ALL ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.runtime_configuration_error_reporting
		ini_set( 'error_log', stream_get_meta_data( $error_log_tmp_file )['uri'] ); // phpcs:ignore WordPress.PHP.IniSet.Risky

		return $error_log_tmp_file;
	}

	/**
	 * Set up the XML load for the dashboard widget.
	 * To be used in the next tests.
	 */
	private function xml_load_setup() {
		delete_transient( 'themeisle_sdk_feed_items' );
		add_filter(
			'themeisle_sdk_dashboard_widget_feeds',
			function( $feeds ) {
				return [ 'https://themeisle.com/feed/random_feed' ];
			},
			10,
			1
		);

		// force the feed to be XML
		add_action(
			'wp_feed_options',
			function ( SimplePie $feed, $url ) {
				$feed->force_feed( true );
			},
			10,
			2
		);

		$file    = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$product = new \ThemeisleSDK\Product( $file );
		$module  = new \ThemeisleSDK\Modules\Dashboard_Widget();

		// force the dashboard widget to load
		add_filter( $product->get_slug() . '_load_dashboard_widget', '__return_true' );
		add_filter( 'themeisle_sdk_hide_dashboard_widget', '__return_false', 9999 );

		$module = $module->load( $product );


		$module->render_dashboard_widget();
	}

	/**
	 * Test that the output is clean even when the feed is forced to be XML.
	 * As the feed will use the filter to not enforce XML load for defined SDK urls.
	 */
	public function test_notice_output_is_clean() {
		// set error log to tmp file
		$prev_error_reporting = ini_get( 'error_reporting' );
		$prev_error_log       = ini_get( 'error_log' );
		$error_log_tmp_file   = $this->setup_tmp_error_log_file();

		$this->xml_load_setup();

		$result = stream_get_contents( $error_log_tmp_file );

		// Check that the output is clean.
		$this->assertTrue( empty( $result ) );


		// set error log back to normal
		ini_set( 'error_reporting', $prev_error_reporting ); // phpcs:ignore WordPress.PHP.IniSet.error_reporting_Blacklisted
		ini_set( 'error_log', $prev_error_log ); // phpcs:ignore WordPress.PHP.IniSet.Risky
	}

	/**
	 * Test that the notice is thrown when the feed is forced to be XML.
	 * This test is here to validate the behaviour when the filter is not applied.
	 */
	public function test_notice_is_thrown_on_forced_xml() {

		// set error log to tmp file, and define TI_SDK_PHPUNIT to true so that the filter is not applied.
		define( 'TI_SDK_PHPUNIT', true );
		$prev_error_reporting = ini_get( 'error_reporting' );
		$prev_error_log       = ini_get( 'error_log' );
		$error_log_tmp_file   = $this->setup_tmp_error_log_file();

		$this->xml_load_setup();

		$result = stream_get_contents( $error_log_tmp_file );

		// Check that the notice is thrown when the feed is forced to be XML.
		$this->assertStringContainsString( 'PHP Notice:', $result );
		$this->assertStringContainsString( 'is invalid XML, likely due to invalid characters. XML error:', $result );


		// set error log back to normal
		ini_set( 'error_reporting', $prev_error_reporting ); // phpcs:ignore WordPress.PHP.IniSet.error_reporting_Blacklisted
		ini_set( 'error_log', $prev_error_log ); // phpcs:ignore WordPress.PHP.IniSet.Risky
	}

}

<?php
/**
 * Float Widget data tests.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test Float Widget loading.
 */
class Float_Widget_Test extends WP_UnitTestCase {
	/**
	 * Test plugin not loading without config.
	 */
	public function test_plugin_not_loading_without_metadata() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Float_Widget() )->can_load( $plugin_product ) );
	}

	/**
	 * Test theme not loading without config.
	 */
	public function test_theme_not_loading_without_metadata() {
		$theme         = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$theme_product = new \ThemeisleSDK\Product( $theme );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\Float_Widget() )->can_load( $theme_product ) );
	}

	/**
	 * Test plugin loading.
	 */
	public function test_plugin_loading() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->add_filter( $plugin_product->get_slug(), 'plugins.php' );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Float_Widget() )->can_load( $plugin_product ) );
	}

	/**
	 * Test theme loading.
	 */
	public function test_theme_loading() {
		$theme         = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$theme_product = new \ThemeisleSDK\Product( $theme );

		$this->add_filter( $theme_product->get_slug(), 'themes.php' );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\Float_Widget() )->can_load( $theme_product ) );
	}

	/**
	 * Test plugin loading.
	 */
	public function test_plugin_assets() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$float_widget = new \ThemeisleSDK\Modules\Float_Widget();

		$this->add_filter( $plugin_product->get_slug(), 'plugins.php' );

		set_current_screen( 'edit-post' );
		$current_screen = get_current_screen();

		$this->assertTrue( $float_widget->can_load( $plugin_product ) );
		$float_widget->load( $plugin_product );

		$float_widget->enqueue_float_widget_script();

		global $wp_scripts; // phpcs:ignore
		$data                       = $wp_scripts->get_data( 'ti-sdk-float-' . $plugin_product->get_key(), 'data' );
		$data                       = str_replace( 'var tiSDKFloatData = ', '', $data );
		$data                       = substr( $data, 0, -1 );
		$themeisle_sdk_float_widget = json_decode( $data, true );

		$this->assertEquals( 'https://placehold.co/200x50.jpg', $themeisle_sdk_float_widget['logoUrl'] );
		$this->assertEquals( '#FF0000', $themeisle_sdk_float_widget['primaryColor'] );
		$this->assertEquals( 'Toggle Help Widget for Pretty Product Name', $themeisle_sdk_float_widget['strings']['toggleButton'] );
		$this->assertEquals( 'Thank you for using Pretty Product Name', $themeisle_sdk_float_widget['strings']['panelGreet'] );

		$this->assertTrue( ! empty( $themeisle_sdk_float_widget['links'] ) );

		$link_icons = array_column( $themeisle_sdk_float_widget['links'], 'icon' );

		$this->assertTrue( in_array( 'dashicons-format-status', $link_icons, true ) );
		$this->assertTrue( in_array( 'dashicons-superhero-alt', $link_icons, true ) );
		$this->assertTrue( in_array( 'dashicons-star-filled', $link_icons, true ) );

		$link_urls = array_column( $themeisle_sdk_float_widget['links'], 'link' );

		$this->assertTrue( in_array( 'https://wordpress.org/support/' . $plugin_product->get_type() . '/' . $plugin_product->get_slug() . '/', $link_urls, true ) );
		$this->assertTrue( in_array( 'https://example.com/upgrade', $link_urls, true ) );
		$this->assertTrue( in_array( 'https://wordpress.org/support/' . $plugin_product->get_type() . '/' . $plugin_product->get_slug() . '/reviews/#new-post', $link_urls, true ) );
	}

	/**
	 * Internal function to add the filter.
	 *
	 * @param string $slug The slug for the filter.
	 *
	 * @return void
	 */
	private function add_filter( $slug ) {
		add_filter(
			$slug . '_float_widget_metadata',
			function () {
				return [
					'logo'             => 'https://placehold.co/200x50.jpg',
					'primary_color'    => '#FF0000',
					'nice_name'        => 'Pretty Product Name',
					'pages'            => [ 'edit-post' ],
					'has_upgrade_menu' => true,
					'upgrade_link'     => esc_url( 'https://example.com/upgrade' ),
				];
			}
		);
	}

}

<?php
/**
 * About us data tests.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test About us loading.
 */
class About_Test extends WP_UnitTestCase {

	/**
	 * Test plugin not loading without config.
	 */
	public function test_plugin_not_loading_without_metadata() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\About_Us() )->can_load( $plugin_product ) );
	}

	/**
	 * Test theme not loading without config.
	 */
	public function test_theme_not_loading_without_metadata() {
		$theme         = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$theme_product = new \ThemeisleSDK\Product( $theme );

		$this->assertFalse( ( new \ThemeisleSDK\Modules\About_Us() )->can_load( $theme_product ) );
	}

	/**
	 * Test plugin loading.
	 */
	public function test_plugin_loading() {
		$plugin         = dirname( __FILE__ ) . '/sample_products/sample_plugin/plugin_file.php';
		$plugin_product = new \ThemeisleSDK\Product( $plugin );

		$this->add_filter( $plugin_product->get_slug(), 'plugins.php' );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\About_Us() )->can_load( $plugin_product ) );
	}

	/**
	 * Test theme loading.
	 */
	public function test_theme_loading() {
		$theme         = dirname( __FILE__ ) . '/sample_products/sample_theme/style.css';
		$theme_product = new \ThemeisleSDK\Product( $theme );

		$this->add_filter( $theme_product->get_slug(), 'themes.php' );

		$this->assertTrue( ( new \ThemeisleSDK\Modules\About_Us() )->can_load( $theme_product ) );
	}

	private function add_filter( $slug, $toplevel_page ) {
		add_filter(
			$slug . '_about_us_metadata',
			function () use ( $toplevel_page ) {
				return [
					'location'         => $toplevel_page,
					'logo'             => 'https://placehold.co/200x50.jpg',
					'page_menu'        => [
						[
							'text' => 'Example Link 1',
							'url'  => esc_url( 'https://example.com' ),
						],
						[
							'text' => 'Example Link 2',
							'url'  => esc_url( 'https://example.com' ),
						],
					],
					'has_upgrade_menu' => true,
					'upgrade_link'     => esc_url( 'https://example.com' ),
					'upgrade_text'     => 'Get Pro Version',
				];
			} 
		);
	}
}

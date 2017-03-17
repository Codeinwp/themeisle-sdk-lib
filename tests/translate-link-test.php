<?php
/**
 * Translation helper tests.
 *
 * @package ThemeIsleSDK
 */

/**
 * Test translation link functionality.
 */
class Translate_Link extends WP_UnitTestCase {

	public function test_default_path() {
		add_filter(
			'locale',
			function () {
				return 'de_DE';
			} 
		);
		$url = 'https://example.com';
		$this->assertEquals( $url . '/de', tsdk_translate_link( $url ) );
		$url = 'https://example.com/some/path';
		$this->assertEquals( 'https://example.com/de/some/path', tsdk_translate_link( $url ) );
		$url = 'https://example.com/some/path/';
		$this->assertEquals( 'https://example.com/de/some/path/', tsdk_translate_link( $url ) );
	}

	public function test_query() {
		add_filter(
			'locale',
			function () {
				return 'de_DE';
			} 
		);
		$url = 'https://example.com';
		$this->assertEquals( 'https://example.com?lang=de', tsdk_translate_link( $url, 'query' ) );
	}

	public function test_domain() {
		add_filter(
			'locale',
			function () {
				return 'de_DE';
			} 
		);
		$url = 'https://example.com';
		$this->assertEquals( 'https://optimole.de', tsdk_translate_link( $url, 'domain', [ 'de_DE' => 'optimole.de' ] ) );
	}

	public function test_non_existent() {
		add_filter(
			'locale',
			function () {
				return 'da_DK';
			} 
		);
		$url = 'https://example.com';
		$this->assertEquals( 'https://example.com', tsdk_translate_link( $url ) );
	}

}

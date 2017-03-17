/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Featured Plugin', () => {

	test( 'check recommendation', async({ page, admin }) => {
		await admin.visitAdminPage( 'plugin-install.php' );

		const optimoleCard = page.locator( '.plugin-card-optimole-wp' );

		await expect( optimoleCard ).toBeVisible();
		await expect( optimoleCard.locator( 'a[data-slug="optimole-wp"]' ) ).toBeVisible();

		const otterCard = page.locator( '.plugin-card-otter-blocks' );

		await expect( otterCard ).toBeVisible();
		await expect( otterCard.locator( 'a[data-slug="otter-blocks"]' ) ).toBeVisible();
	});
});

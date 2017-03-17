/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';


test.describe( 'Rollback', () => {

	test( 'rendering', async({ page, admin }) => {
		await admin.visitAdminPage( 'plugins.php' );

		const pluginContainer = page.locator( '[data-slug="visualizer"] .plugin-title' );
		await expect( pluginContainer ).toBeVisible();
		await expect( pluginContainer.getByRole( 'link', { name: 'Rollback to' }) ).toBeVisible();
	});
});

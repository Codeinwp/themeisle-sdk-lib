/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';


test.describe( 'Promotions', () => {

	test( 'on Theme Install page', async({ page, admin }) => {
		await admin.visitAdminPage( 'theme-install.php?browse=popular' );

		// Check if the promotions are visible.
		expect( await page.locator( '.ti-sdk-om-notice' ).count() ).toBeGreaterThan( 0 );

		// Check Neve promotion.
		const nevePromotion = page.locator( '#ti-neve-notice' );

		await expect( nevePromotion ).toBeVisible();
		await expect( nevePromotion.getByRole( 'button', { name: 'Install & Activate' }) ).toBeVisible();
		await expect( nevePromotion.getByRole( 'link', { name: 'Preview' }) ).toBeVisible();
		await expect( nevePromotion.getByRole( 'button', { name: 'Dismiss this notice.' })  ).toBeVisible();
	});

	test( 'on Edit page', async({ page, admin }) => {
		await admin.visitAdminPage( 'edit.php' );

		// Check if the promotions are visible.
		expect( await page.locator( '.ti-sdk-om-notice' ).count() ).toBeGreaterThan( 0 );

		// Check Revive Social promotion.
		const ropPromotion = page.locator( '#ti-rop-notice' );

		await expect( ropPromotion ).toBeVisible();
		await expect( ropPromotion.getByRole( 'button', { name: 'Install & Activate' }) ).toBeVisible();
		await expect( ropPromotion.getByRole( 'link', { name: 'Learn more' }) ).toBeVisible();
		await expect( ropPromotion.getByRole( 'button', { name: 'Dismiss this notice.' })  ).toBeVisible();
	});

	test( 'on Upload page', async({ page, admin }) => {
		await admin.visitAdminPage( 'upload.php' );

		// Check if the promotions are visible.
		expect( await page.locator( '.ti-sdk-om-notice' ).count() ).toBeGreaterThan( 0 );

		// Check Optimole promotion.
		const optimoleNotice = page.locator( '#ti-optml-notice' );

		await expect( optimoleNotice ).toBeVisible();
		await expect( optimoleNotice.getByRole( 'button', { name: 'Install Optimole' }) ).toBeVisible();
		await expect( optimoleNotice.getByRole( 'link', { name: 'Learn more' }) ).toBeVisible();
		await expect( optimoleNotice.getByRole( 'button', { name: 'Dismiss this notice.' })  ).toBeVisible();

		// Check CF7 promotion.
		const cf7Notice = page.locator( '#ti-redirection-cf7-notice' );

		await expect( cf7Notice ).toBeVisible();
		await expect( cf7Notice.getByRole( 'button', { name: 'Get Started Free' }) ).toBeVisible();
		await expect( cf7Notice.getByRole( 'link', { name: 'Learn more' }) ).toBeVisible();
		await expect( cf7Notice.getByRole( 'button', { name: 'Dismiss this notice.' })  ).toBeVisible();
	});

	test( 'on Gutenberg Editor page', async({ page, admin, editor }) => {
		await admin.createNewPost();

		// Check Optimole promotion in Image Core block settings.
		await editor.insertBlock({ name: 'core/image' });
		const optimoleNotice = page.locator( '.ti-sdk-om-notice' );

		await expect( optimoleNotice.getByRole( 'button', { name: 'Install Optimole' }) ).toBeVisible();
		await expect( optimoleNotice.getByRole( 'link', { name: 'Learn More' }) ).toBeVisible();
		await expect( optimoleNotice.getByRole( 'button', { name: 'Dismiss this notice.' }) ).toBeVisible();
	});
});

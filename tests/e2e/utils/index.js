const BLOCKED_URLS = [
	'https://api.themeisle.com/tracking/', // Do not send tracking data.
	'https://app.formbricks.com' // Do not initialize FormBricks survey.
];

/**
 * Block requests to specific URLs.
 *
 * @param {import('@playwright/test').BrowserContext} context Playwright browser context.
 */
export async function blockRequests( context ) {
	await context.route( '**/*', route => {
		const url = route.request().url();
		if ( BLOCKED_URLS.some( blockedUrl => url.startsWith( blockedUrl ) ) ) {
			console.log( `[UTILS] Blocked request to: ${url}` );
			route.abort();
		} else {
			route.continue();
		}
	});
}

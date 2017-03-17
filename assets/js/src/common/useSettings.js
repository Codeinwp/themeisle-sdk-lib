/**
 * WordPress dependencies.
 */
import {
	dispatch,
	useSelect
} from '@wordpress/data';

import {
	useState
} from '@wordpress/element';

/**
 * useSettings Hook.
 *
 * useSettings hook to get/update WordPress' settings database.
 *
 * Setting field needs to be registered to REST for this function to work.
 *
 * This hook works similar to get_option and update_option in PHP just without the option for a default value.
 * For notificiations to work, you need to add a Snackbar section to your React codebase if it isn't being
 * used inside the block editor.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/editor-snackbars/index.js
 * @author  Hardeep Asrani <hardeepasrani@gmail.com>
 * @version 1.1
 *
 */
const useSettings = () => {
	const { createNotice } = dispatch( 'core/notices' );

	const [ settings, setSettings ] = useState({});
	const [ status, setStatus ] = useState( 'loading' );

	useSelect( select => {
		
		// Bail out if settings are already loaded.
		if ( Object.keys( settings ).length ) {
			return;
		}
		
		const { getEntityRecord } = select( 'core' );
		const request = getEntityRecord( 'root', 'site' );

		if ( request ) {
			setStatus( 'loaded' );
			setSettings( request );
		}
	}, []);

	const getOption = option => settings?.[option];

	const updateWPOption = async (optionName, optionValue, success = 'Settings saved.') => {
		const data = { [optionName]: optionValue };
		
		try {
			const response = await fetch( '/wp-json/wp/v2/settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': wpApiSettings.nonce,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				setStatus( 'error' );
				createNotice(
					'error',
					'Could not save the settings.',
					{
						isDismissible: true,
						type: 'snackbar'
					}
				);
			}

			const settings = await response.json();
			
			setStatus( 'loaded' );
			createNotice(
				'success',
				success,
				{
					isDismissible: true,
					type: 'snackbar'
				}
			);
			
			setSettings( settings );
		} catch (error) {
			console.error('Error updating option:', error);
		}
	};

	return [ getOption, updateWPOption, status ];
};

export default useSettings;

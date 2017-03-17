import { Fragment, render, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { activatePlugin, installPluginOrTheme } from "./common/utils";
import useSettings from './common/useSettings';

const ROPNotice = ({ onDismiss = () => {} }) => {
	const [ status, setStatus ] = useState( '' );
	const [getOption, updateOption] = useSettings();

	const dismissNotice = async () => {
		const newValue = { ...window.themeisleSDKPromotions.option };
		newValue['rop-posts'] = new Date().getTime() / 1000 | 0;
		window.themeisleSDKPromotions.option = newValue;
		await updateOption( window.themeisleSDKPromotions.optionKey, JSON.stringify( newValue ) );

		if ( onDismiss ) {
			onDismiss();
		}
	};

	return (
		<Fragment>
			<Button
				disabled={ 'installing' === status }
				onClick={ dismissNotice }
				variant="link"
				className="om-notice-dismiss"
			>
				<span className="dashicons-no-alt dashicons"/>
				<span className="screen-reader-text">Dismiss this notice.</span>
			</Button>

			<p>Boost your content's reach effortlessly! Introducing <b>Revive Social</b>, a cutting-edge plugin from the makers of { window.themeisleSDKPromotions.product }. Seamlessly auto-share old & new content across social media, driving traffic like never before.</p>

			<div className="rop-notice-actions">
				{ 'installed' !== status ? (
					<Button
						variant="primary"
						isBusy={ 'installing' === status }
						onClick={ async() => {
							setStatus( 'installing' );
							await installPluginOrTheme('tweet-old-post');
							await activatePlugin( window.themeisleSDKPromotions.ropActivationUrl );
							updateOption('themeisle_sdk_promotions_rop_installed', !Boolean(getOption('themeisle_sdk_promotions_rop_installed')));
							setStatus( 'installed' );
						} }
					>
						Install & Activate
					</Button>
				) : (
					<Button
						variant="primary"
						href={ window.themeisleSDKPromotions.ropDash }
					>
						Visit Dashboard
					</Button>
				) }

				<Button
					variant="link"
					target="_blank"
					href="https://wordpress.org/plugins/tweet-old-post/"
				>
					<span className="dashicons dashicons-external"/>
					<span>Learn more</span>
				</Button>
			</div>
		</Fragment>
	);
};

class ROP {
	constructor() {
		const {showPromotion, debug} = window.themeisleSDKPromotions;
		this.promo = showPromotion;
		this.debug = debug === '1';
		this.domRef = null;

		this.run();
	}

	run() {
		if ( window.themeisleSDKPromotions.option['rop-posts'] ) {
			return;
		}

		const root = document.querySelector( '#ti-rop-notice' );

		if ( !root ) {
			return;
		}

		render(
			<ROPNotice
				onDismiss={() => {
					root.style.display = 'none';
				}}
			/>,
			root
		);
	}
}

new ROP();
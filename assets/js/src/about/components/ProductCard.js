import {useState} from '@wordpress/element';
import {Button, Tooltip} from '@wordpress/components';

import {installPluginOrTheme} from "../../common/utils";

export default function ProductCard({product, slug}) {
	const {icon, name, description, status, premiumUrl, activationLink} = product;
	const {strings, canInstallPlugins, canActivatePlugins } = window.tiSDKAboutData;
	const {
		installNow,
		installed,
		notInstalled,
		active,
		activate,
		learnMore
	} = strings;

	const isPremium = !!premiumUrl;
	const [productStatus, setProductStatus] = useState(status);
	const [loading, setLoading] = useState(false);

	const runInstall = async () => {
		setLoading(true);
		await installPluginOrTheme(slug, slug === 'neve').then((res) => {
			if (res.success) {
				setProductStatus('installed');
			}
		});
		setLoading(false);
	}

	const runActivate = async () => {
		setLoading(true);
		window.location.href = activationLink;
	}

	const buttonContent = ( () => {
		if ( productStatus === 'not-installed' && isPremium ) {
			return (
				<Button isLink icon={'external'} href={premiumUrl} target="_blank">
					{learnMore}
				</Button>
			);
		}

		if ( productStatus === 'not-installed' && !isPremium ) {
			return (
				<Button isPrimary onClick={runInstall} disabled={loading || ! canInstallPlugins}>
					{installNow}
				</Button>
			);
		}

		if ( productStatus === 'installed' ) {
			return (
				<Button isSecondary onClick={runActivate} disabled={loading || ! canActivatePlugins}>
					{activate}
				</Button>
			)
		}

		return null;
	});

	const actionsAreDisabled =
		(!canInstallPlugins && productStatus === 'not-installed') ||
		(!canActivatePlugins && productStatus === 'installed' ) ||
		false;

	const wrappedButtonContent = actionsAreDisabled ? (
		<Tooltip text={`Ask your admin to enable ${name} on your site`} position="top center">{buttonContent()}</Tooltip>
	) : (
		buttonContent()
	);

	return (<div className="product-card">
		<div className="header">
			{icon && <img src={icon} alt={name}/>}
			<h2>{name}</h2>
		</div>
		<div className="body">
			<p dangerouslySetInnerHTML={{__html: description}}/>
		</div>
		<div className="footer">
			<p>Status:
				{" "}
				<span className={productStatus}>
                    {productStatus === 'installed' && installed}
					{productStatus === 'not-installed' && notInstalled}
					{productStatus === 'active' && active}
                </span>
			</p>
			{productStatus !== 'active' && !loading && wrappedButtonContent }

			{loading && <span className="dashicons dashicons-update spin"/>}
		</div>
	</div>)
}

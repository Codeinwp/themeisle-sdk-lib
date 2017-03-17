import { createRoot, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import useSettings from "./common/useSettings";
import { activatePlugin, installPluginOrTheme } from './common/utils';

const WPFullPayNotice = ({
    onDismiss = () => {}
}) => {
    const {
        title,
        option,
        optionKey,
        labels,
        wpFullPayActivationUrl,
        wpFullPayDash,
    } = window.themeisleSDKPromotions;

    const [ dismissed, setDismissed ] = useState( false );
    const [ progress, setProgress ] = useState( null );
    const [ getOption, updateOption ] = useSettings();

    const dismissNotice = async () => {
        setDismissed( true );
        const newValue = { ...option };
        newValue['wp-full-pay-plugins-install'] = new Date().getTime() / 1000 | 0;
        window.themeisleSDKPromotions.option = newValue;
        await updateOption( optionKey, JSON.stringify( newValue ) );

        if ( onDismiss ) {
            onDismiss();
        }
    };

    const installPluginRequest = async e => {
        e.preventDefault();
        setProgress( 'installing' );
        await installPluginOrTheme( 'wp-full-stripe-free' );

        setProgress( 'activating' );
        await activatePlugin( wpFullPayActivationUrl );

        updateOption( 'themeisle_sdk_promotions_wp_full_pay_installed', ! Boolean( getOption( 'themeisle_sdk_promotions_wp_full_pay_installed' ) ) );
        setProgress('done');
    };

    if ( dismissed ) {
      return null;
    }

    const installPluginRequestStatus = () => {
      return progress === 'done' ? (
          <div className="done">
            <p>{ labels.all_set }</p>

            <Button
                icon="external"
                variant="primary"
                href={ wpFullPayDash }
                target="_blank"
            >
              { labels.wp_full_pay.gotodash }
            </Button>
          </div>
      ) : (
          <p className="om-progress">
            <span className="dashicons dashicons-update spin"/>
            <span>
              { progress === 'installing' && labels.installing }
              { progress === 'activating' && labels.activating }
              &hellip;
            </span>
          </p>
      );
    };

    const actionButtons = (
        <div className="actions">
            <Button
                variant="primary"
                onClick={ installPluginRequest }
            >
                { labels.wp_full_pay.install }
            </Button>

            <Button
                variant="link"
                target="_blank"
                href="https://wordpress.org/plugins/wp-full-stripe-free/"
            >
                <span className="dashicons dashicons-external"/>
                <span>{ labels.learnmore }</span>
            </Button>
        </div>
    );

    return (
        <>
            <Button
                disabled={ progress && progress !== 'done' }
                onClick={ dismissNotice }
                variant="link"
                className="om-notice-dismiss"
            >
                <span className="dashicons-no-alt dashicons"/>
                <span className="screen-reader-text">{ labels.wp_full_pay.dismisscta }</span>
            </Button>

            <div className="content">
                <div>
                    <p>{ title }</p>
                    <p className="description">{labels.wp_full_pay.message}</p>
                    { progress ? installPluginRequestStatus() : actionButtons }
                </div>
            </div>
        </>
    );
};

const renderWPFullPayNotice = () => {
    if ( window.themeisleSDKPromotions.option['wp-full-pay-plugins-install']) {
        return;
    }

    const root = document.querySelector( '#ti-wp-full-pay-notice' );

    if ( ! root ) {
        return;
    }

    createRoot( root ).render(
        <WPFullPayNotice
            onDismiss={() => {
                root.style.display = 'none';
            }}
        />
    );
};

renderWPFullPayNotice();

import { createRoot, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import useSettings from "./common/useSettings";
import { activatePlugin, installPluginOrTheme } from './common/utils';

const HyveNotice = ({
    onDismiss = () => {}
}) => {
    const {
        title,
        option,
        optionKey,
        labels,
        hyveActivationUrl,
        hyveDash,
    } = window.themeisleSDKPromotions;

    const [ dismissed, setDismissed ] = useState( false );
    const [ progress, setProgress ] = useState( null );
    const [ getOption, updateOption ] = useSettings();

    const dismissNotice = async () => {
        setDismissed( true );
        const newValue = { ...option };
        newValue['hyve-plugins-install'] = new Date().getTime() / 1000 | 0;
        window.themeisleSDKPromotions.option = newValue;
        await updateOption( optionKey, JSON.stringify( newValue ) );

        if ( onDismiss ) {
            onDismiss();
        }
    };

    const installPluginRequest = async e => {
        e.preventDefault();
        setProgress( 'installing' );
        await installPluginOrTheme( 'hyve-lite' );

        setProgress( 'activating' );
        await activatePlugin( hyveActivationUrl );

        updateOption( 'themeisle_sdk_promotions_hyve_installed', ! Boolean( getOption( 'themeisle_sdk_promotions_hyve_installed' ) ) );
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
                href={ hyveDash }
                target="_blank"
            >
              { labels.hyve.gotodash }
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
                { labels.hyve.install }
            </Button>

            <Button
                variant="link"
                target="_blank"
                href="https://wordpress.org/plugins/hyve-lite/"
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
                <span className="screen-reader-text">{ labels.hyve.dismisscta }</span>
            </Button>

            <div className="content">
                <div>
                    <p>{ title }</p>
                    <p className="description">{labels.hyve.message}</p>
                    { progress ? installPluginRequestStatus() : actionButtons }
                </div>
            </div>
        </>
    );
};

const renderHyveNotice = () => {
    if ( window.themeisleSDKPromotions.option['hyve-plugins-install']) {
        return;
    }

    const root = document.querySelector( '#ti-hyve-notice' );

    if ( ! root ) {
        return;
    }

    createRoot( root ).render(
        <HyveNotice
            onDismiss={() => {
                root.style.display = 'none';
            }}
        />
    );
};

renderHyveNotice();

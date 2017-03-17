import {useState} from '@wordpress/element';
import {Button} from '@wordpress/components';

import './style.scss';
import {activatePlugin, installPluginOrTheme} from "../common/utils";
import useSettings from "../common/useSettings";

export default function OptimoleNotice({stacked = false, type, onDismiss, onSuccess, initialStatus = null}) {
  const {
    title,
    option,
    optionKey,
    labels,
    optimoleActivationUrl,
    optimoleDash,
  } = window.themeisleSDKPromotions;
  const [dismissed, setDismissed] = useState(false);
  const [progress, setProgress] = useState(initialStatus);
  const [getOption, updateOption] = useSettings();

  const dismissNotice = async () => {
    setDismissed(true);
    const newValue = {...option};
    newValue[type] = new Date().getTime() / 1000 | 0;
    window.themeisleSDKPromotions.option = newValue;
    await updateOption(optionKey, JSON.stringify(newValue));

    if (onDismiss) {
      onDismiss();
    }
  };

  const installAndActivate = async (e) => {
    e.preventDefault();
    setProgress('installing');
    await installPluginOrTheme('optimole-wp');

    setProgress('activating');
    await activatePlugin(optimoleActivationUrl);

    updateOption('themeisle_sdk_promotions_optimole_installed', true).then(() => {
      setProgress('done');
    });
  }

  if (dismissed) {
    return null;
  }

  const renderProgress = () => {
    return progress === 'done' ? (
        <div className="done">
          <p> {labels.all_set}</p>
          <Button icon="external" isPrimary href={optimoleDash} target="_blank">
            {labels.optimole.gotodash}
          </Button>
        </div>
    ) : (
        <p className="om-progress">
          <span className="dashicons dashicons-update spin"/>
          <span>
              {progress === 'installing' && labels.installing}
            {progress === 'activating' && labels.activating}
            &hellip;
            </span>
        </p>
    );
  };

  const dismissButton = () => (
      <Button disabled={progress && progress !== 'done'} onClick={dismissNotice} isLink
              className="om-notice-dismiss">
        <span className="dashicons-no-alt dashicons"/>
        <span className="screen-reader-text">{labels.optimole.dismisscta}</span>
      </Button>
  );

  const actionButtons = (stacked = false) => (
      <>
        <Button isPrimary onClick={installAndActivate} className={ stacked ? 'cta' : ''}>
          {labels.optimole.installOptimole}
        </Button>
        <Button isLink target="_blank" href="https://wordpress.org/plugins/optimole-wp">
          <span className="dashicons dashicons-external"/>
          <span> {labels.learnmore}</span>
        </Button>
      </>
  )

  const stackedNotice = (
      <div className="ti-om-stack-wrap ti-sdk-om-notice">
        <div className="om-stack-notice">
          {dismissButton()}
          <i>{title}</i>
          <p>
            {['om-editor', 'om-image-block'].includes(type) ? labels.optimole.message1 : labels.optimole.message2}
          </p>
          {progress ? renderProgress() : actionButtons(true)}
        </div>
      </div>
  );

  const notice = (
      <>
        {dismissButton()}
        <div className="content">
          <div>
            <p>{title}</p>
            <p className="description">
              {type === 'om-media' ? labels.optimole.message3 : labels.optimole.message4}
            </p>
            {progress ? renderProgress() : (
                <div className="actions">
                  {actionButtons()}
                </div>
            )}
          </div>
        </div>
      </>
  );

  return stacked ? stackedNotice : notice;
}
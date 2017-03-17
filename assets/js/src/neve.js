import {Fragment, render, useState} from "@wordpress/element";
import {Button} from "@wordpress/components";
import useSettings from "./common/useSettings";
import {activatePlugin, installPluginOrTheme} from "./common/utils";

const NeveFSENotice = ({onDismiss = () => {}}) => {
  const {
    title,
    optionKey,
    labels,
    neveAction,
    activateNeveURL
  } = window.themeisleSDKPromotions;

  const [getOption, updateOption] = useSettings();
  const [progress, setProgress] = useState(null);

  const dismissNotice = async () => {
    const newValue = {...window.themeisleSDKPromotions.option};
    newValue["neve-themes-popular"] = (new Date().getTime() / 1000) | 0;
    window.themeisleSDKPromotions.option = newValue
    await updateOption(optionKey, JSON.stringify(newValue));

    if (onDismiss) {
      onDismiss();
    }
  };

  const handlePrimaryAction = (e) => {
    e.preventDefault();

    if (neveAction === 'activate') {
      setProgress('activating');
      updateOption('themeisle_sdk_promotions_neve_installed', true).then(() => {
          window.location.href = activateNeveURL;
      });
      return;
    }

    setProgress('installing');
    installPluginOrTheme('neve', true).then(r => {
      setProgress('activating');
      updateOption('themeisle_sdk_promotions_neve_installed', true).then(() => {
        window.location.href = r.data.activateUrl;
      })
    });
  };

  return (
      <>
        <Button
            disabled={progress && progress !== "done"}
            onClick={dismissNotice}
            isLink
            className="om-notice-dismiss"
        >
          <span className="dashicons-no-alt dashicons"/>
          <span className="screen-reader-text">
          {labels.redirectionCF7.dismisscta}
        </span>
        </Button>
        <div className="content">
          <div>
            <p>{title}</p>
            <p className="description">
              Meet <b>Neve</b>, from the creators of {window.themeisleSDKPromotions.product}. A very fast and free
              theme,
              trusted by over 300,000 users for building their websites and rated
              4.7 stars!
            </p>

            {!progress && <div className="actions">
              <Button variant="primary" onClick={handlePrimaryAction}>
                {neveAction === 'install' && labels.installActivate}
                {neveAction === 'activate' && labels.activate}
              </Button>
              <Button variant="link" href={window.themeisleSDKPromotions.nevePreviewURL}>
                {labels.preview}
              </Button>
            </div>}
            {progress && progress !== "done" && (
                <p className="om-progress">
                  <span className="dashicons dashicons-update spin"/>
                  <span>
                    {progress === 'installing' && labels.installing}
                    {progress === 'activating' && labels.activating}
                    &hellip;
                  </span>
                </p>
            )
            }
          </div>
        </div>
      </>
  );
};

class NeveFSE {
  constructor() {
    const {showPromotion, debug} = window.themeisleSDKPromotions;
    this.promo = showPromotion;
    this.debug = debug === "1";
    this.domRef = null;

    this.run();
  }

  run() {
    if (window.themeisleSDKPromotions.option["neve-themes-popular"]) {
      return;
    }

    const root = document.querySelector("#ti-neve-notice");

    if (!root) {
      return;
    }

    render(
        <NeveFSENotice
            onDismiss={() => {
              root.style.display = "none";
            }}
        />,
        root
    );
  }
}

new NeveFSE();

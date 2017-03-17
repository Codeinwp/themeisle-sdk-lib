import { render } from '@wordpress/element';
import RedirectionForCF7 from "./RedirectionForCF7";

class RedirectionForCF7Notice {
    constructor() {
        this.run();
    }

    run() {
        if (window.themeisleSDKPromotions.option['redirection-cf7']) {
            return;
        }

        const root = document.querySelector('#ti-redirection-cf7-notice');

        if (!root) {
            return;
        }

        render(
            <RedirectionForCF7
                type="redirection-cf7"
                onDismiss={() => {
                    root.style.display = 'none';
                }}
            />, root);
    }
}

new RedirectionForCF7Notice();
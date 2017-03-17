import {InspectorControls} from '@wordpress/block-editor';
import {Button, PanelBody} from '@wordpress/components';
import {createHigherOrderComponent} from '@wordpress/compose';
import {select} from '@wordpress/data';
import {Fragment, useEffect, useState} from '@wordpress/element';
import {addFilter} from '@wordpress/hooks';

import useSettings from './common/useSettings.js';
import {installPluginOrTheme, activatePlugin} from './common/utils.js';

const style = {
    button: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
    },
    image: {
        padding: '20px 0'
    },
    skip: {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        button: {
            fontSize: '9px'
        },
        poweredby: {
            fontSize: '9px',
            textTransform: 'uppercase'
        }
    }
};

const upsells = {
    'blocks-css': {
        title: 'Custom CSS',
        description: 'Enable Otter Blocks to add Custom CSS for this block.',
        image: 'css.jpg'
    },
    'blocks-animation': {
        title: 'Animations',
        description: 'Enable Otter Blocks to add Animations for this block.',
        image: 'animation.jpg'
    },
    'blocks-conditions': {
        title: 'Visibility Conditions',
        description: 'Enable Otter Blocks to add Visibility Conditions for this block.',
        image: 'conditions.jpg'
    }
};

const Footer = ({onClick}) => {
    return (
        <div style={style.skip.container}>
            <Button
                style={style.skip.button}
                variant="tertiary"
                onClick={onClick}
            >
                Skip for now
            </Button>
            <span style={style.skip.poweredby}>Recommended by {window.themeisleSDKPromotions.product}</span>
        </div>
    );
};

const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {

        const [isLoading, setLoading] = useState(false);
        const [installStatus, setInstallStatus] = useState('default');
        const [hasSkipped, setHasSkipped] = useState(false);
        const [getOption, updateOption, status] = useSettings();


        const onSkip = () => {
            const option = {...window.themeisleSDKPromotions.option};
            option[window.themeisleSDKPromotions.showPromotion] = new Date().getTime() / 1000 | 0;
            updateOption('themeisle_sdk_promotions', JSON.stringify(option));
            window.themeisleSDKPromotions.showPromotion = false;
        };

        useEffect(() => {
            if (hasSkipped) {
                onSkip();
            }
        }, [hasSkipped]);



        if (! props.isSelected || ! Boolean(window.themeisleSDKPromotions.showPromotion)) {
            return <BlockEdit {...props} />;
        }
        
        const install = async () => {
            setLoading(true);
            await installPluginOrTheme('otter-blocks');
            updateOption('themeisle_sdk_promotions_otter_installed', !Boolean(getOption('themeisle_sdk_promotions_otter_installed')));
            await activatePlugin(window.themeisleSDKPromotions.otterActivationUrl);
            setLoading(false);
            setInstallStatus('installed');
        };

        const Install = () => {
            if ('installed' === installStatus) {
                return <p><strong>Awesome! Refresh the page to see Otter Blocks in action.</strong></p>;
            }

            return (
                <Button
                    variant="secondary"
                    onClick={install}
                    isBusy={isLoading}
                    style={style.button}
                >
                    Install & Activate Otter Blocks
                </Button>
            );
        };

        if (hasSkipped) {
            return <BlockEdit {...props} />;
        }

        return (
            <Fragment>
                <BlockEdit {...props} />

                <InspectorControls>
                    {Object.keys(upsells).map(key => {
                        if (key === window.themeisleSDKPromotions.showPromotion) {
                            const upsell = upsells[key];

                            return (
                                <PanelBody
                                    key={key}
                                    title={upsell.title}
                                    initialOpen={false}
                                >
                                    <p>{upsell.description}</p>

                                    <Install/>

                                    <img style={style.image}
                                            src={window.themeisleSDKPromotions.assets + upsell.image}/>

                                    <Footer onClick={() => setHasSkipped(true)}/>
                                </PanelBody>
                            );
                        }
                    })}
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withInspectorControl');

if (!select('core/edit-site')) {
    addFilter('editor.BlockEdit', 'themeisle-sdk/with-inspector-controls', withInspectorControls);
}

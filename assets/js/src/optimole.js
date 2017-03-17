import {Fragment, render, unmountComponentAtNode, useState} from '@wordpress/element';
import {registerPlugin,} from '@wordpress/plugins';
import {PluginPostPublishPanel} from '@wordpress/edit-post';
import {useSelect} from '@wordpress/data';
import {createHigherOrderComponent} from '@wordpress/compose';
import {addFilter} from '@wordpress/hooks';
import {InspectorControls} from '@wordpress/block-editor';

import {getBlocksByType} from "./common/utils";
import OptimoleNotice from "./OptimoleNotice";

const TiSdkMoleEditorPromo = () => {
    const [show, setShow] = useState(true);

    const hide = () => {
        setShow(false);
    };

    const {getBlocks} = useSelect((select) => {
        const {getBlocks} = select('core/block-editor');
        return {
            getBlocks
        };
    });

    const imageBlocksCount = getBlocksByType(getBlocks(), 'core/image').length;

    if (imageBlocksCount < 2) {
        return null;
    }

    const classes = `ti-sdk-optimole-post-publish ${show ? '' : 'hidden'}`;

    return (
        <PluginPostPublishPanel className={classes}>
            <OptimoleNotice stacked type="om-editor" onDismiss={hide}/>
        </PluginPostPublishPanel>
    );
};

class Optimole {
    constructor() {
        const {showPromotion, debug} = window.themeisleSDKPromotions;
        this.promo = showPromotion;
        this.debug = debug === '1';
        this.domRef = null;

        this.run();
    }

    run() {
        if (this.debug) {
            this.runAll();

            return;
        }

        switch (this.promo) {
            case 'om-attachment' :
                this.runAttachmentPromo();
                break;
            case 'om-media' :
                this.runMediaPromo();
                break;
            case 'om-editor' :
                this.runEditorPromo();
                break;
            case 'om-image-block' :
                this.runImageBlockPromo();
                break;
            case 'om-elementor' :
                this.runElementorPromo();
                break;
        }
    }

    runAttachmentPromo() {
        wp.media.view.Attachment.Details.prototype.on("ready", () => {
            setTimeout(() => {
                this.removeAttachmentPromo();
                this.addAttachmentPromo();
            }, 100)
        });
        wp.media.view.Modal.prototype.on("close", () => {
            setTimeout(this.removeAttachmentPromo, 100)
        });
    }

    runMediaPromo() {
        if (window.themeisleSDKPromotions.option['om-media']) {
            return;
        }

        const root = document.querySelector('#ti-optml-notice');

        if (!root) {
            return;
        }

        render(
            <OptimoleNotice
                type="om-media"
                onDismiss={() => {
                    root.style.opacity = 0;
                }}
            />, root);
    }

    runImageBlockPromo() {
        if (window.themeisleSDKPromotions.option['om-image-block']) {
            return;
        }

        let showNotice = true;
        let initialStatus = null;

        const withImagePromo = createHigherOrderComponent( BlockEdit => {
            return props => {
                if ( 'core/image' === props.name && showNotice ) {
                    return (
                        <Fragment>
                            <BlockEdit { ...props } />
                            <InspectorControls>
                                <OptimoleNotice
                                    stacked
                                    type="om-image-block"
                                    initialStatus={ initialStatus }
                                    onDismiss={() => {
                                        showNotice = false;
                                    }}
                                    onSuccess={() => {
                                        initialStatus = 'done';
                                    }}
                                />
                            </InspectorControls>
                        </Fragment>
                    );
                }

                return <BlockEdit { ...props } />;
            };
        }, 'withImagePromo' );
        
        addFilter( 'editor.BlockEdit', 'optimole-promo/image-promo', withImagePromo, 99 );
    }

    runEditorPromo() {
        if (window.themeisleSDKPromotions.option['om-editor']) {
            return;
        }
        registerPlugin('optimole-promo', {
            render: TiSdkMoleEditorPromo,
        });
    }

    runElementorPromo() {
        if (!window.elementor) {
            return;
        }

        const self = this;

        elementor.on("preview:loaded", () => {
            elementor.panel.currentView.on("set:page:editor", (details) => {
                if (self.domRef) {
                    unmountComponentAtNode(self.domRef);
                }

                if (!details.activeSection) {
                    return;
                }

                if (details.activeSection !== 'section_image') {
                    return;
                }

                self.runElementorActions(self)
            })
        });
    }

    addAttachmentPromo() {
        if (this.domRef) {
            unmountComponentAtNode(this.domRef);
        }

        if (window.themeisleSDKPromotions.option['om-attachment']) {
            return;
        }

        const mount = document.querySelector('#ti-optml-notice-helper');

        if (!mount) {
            return;
        }

        this.domRef = mount;

        render(
            <div className="notice notice-info ti-sdk-om-notice" style={{margin: 0}}>
                <OptimoleNotice
                    type="om-attachment"
                    onDismiss={() => {
                        mount.style.opacity = 0;
                    }}/>
            </div>, mount);

    }

    removeAttachmentPromo() {
        const mount = document.querySelector('#ti-optml-notice-helper');

        if (!mount) {
            return;
        }

        unmountComponentAtNode(mount);
    }

    runElementorActions(self) {
        if ((window.themeisleSDKPromotions.option)['om-elementor']) {
            return;
        }

        const controlsWrap = document.querySelector('#elementor-panel__editor__help');
        const mountPoint = document.createElement('div');
        mountPoint.id = 'ti-optml-notice';

        self.domRef = mountPoint;

        if (controlsWrap) {
            controlsWrap.parentNode.insertBefore(mountPoint, controlsWrap);
            render(<OptimoleNotice
                stacked
                type="om-elementor"
                onDismiss={() => {
                    mountPoint.style.opacity = 0;
                }}
            />, mountPoint);
        }
    }


    runAll() {
        this.runAttachmentPromo();
        this.runMediaPromo();
        this.runEditorPromo();
        this.runImageBlockPromo();
        this.runElementorPromo();
    }
}

new Optimole();
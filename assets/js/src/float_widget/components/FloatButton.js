import { Fragment } from '@wordpress/element';
import WidgetPanel from "./WidgetPanel";
import { Popover } from '@wordpress/components';


export default function FloatButton( {isActive, onToggle, onClose} ) {
    const { logoUrl, strings } = window.tiSDKFloatData;

    const screenReaderText = strings.toggleButton;

    const activeClassLogo = !isActive ? 'active' : '';
    const activeClassClose = isActive ? 'active' : '';

    return (
        <Fragment>
            <button id="ti-toggle-widget-float" tabIndex="0" className="ti-float-button" onClick={onToggle} aria-label='' aria-pressed={isActive}
                    aria-disabled={false} title={screenReaderText}>
                <img className={'ti-float-logo ' + activeClassLogo} src={logoUrl}/>
                <span className={'dashicons dashicons-no-alt ti-float-close-icon ' + activeClassClose}></span>
                <span className="screen-reader-text">{screenReaderText}</span>

                {
                    isActive &&
                    <Popover
                        variant="unstyled"
                        placement="top-end"
                        //focusOnMount={true}
                        onFocusOutside={() => {
                            console.log('Focus Outside');
                            onClose();
                        }}
                    >
                        <WidgetPanel/>
                    </Popover>
                }
            </button>
        </Fragment>
    );
}

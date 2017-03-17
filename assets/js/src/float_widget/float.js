import './float.scss';
import {Fragment, render, useState} from '@wordpress/element';
import FloatButton from "./components/FloatButton";


function Float() {
    const [isOpen, setIsOpen] = useState( false );

    return (
        <Fragment>
            <FloatButton isActive={isOpen} onToggle={() => { setIsOpen( !isOpen ) }} onClose={ () => { setIsOpen(false) }}/>
        </Fragment>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#ti-sdk-float-widget');

    if (!root) {
        return;
    }

    render(
        <Float/>,
        root
    );
});

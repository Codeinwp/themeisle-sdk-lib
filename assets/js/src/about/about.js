import './about.scss';

import {Fragment, render, useEffect, useState} from '@wordpress/element';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCards from './components/ProductCards';
import ProductPage from './components/ProductPage';

const getTabHash = () => {
    let hash = window.location.hash;

    if ('string' !== typeof window.location.hash) {
        return null;
    }

    return hash;
};

function About() {
    const { productPages } = window.tiSDKAboutData;
    const pages = productPages ? Object.keys(productPages).map( ( key ) => {
        const result = productPages[key];
        result.id = key;
        return result;
    }) : [];

    const [hash, setHash] = useState( getTabHash() );

    const setTabToCurrentHash = () => {
        const hash = getTabHash();
        if (null === hash) {
            return;
        }

        setHash( hash );
    };

    useEffect(() => {
        setTabToCurrentHash();
        window.addEventListener('hashchange', setTabToCurrentHash);

        return () => {
            window.removeEventListener('hashchange', setTabToCurrentHash);
        };
    }, [] );

    const isHashInPages = pages.filter( ( page ) => {
        return page.hash === hash;
    } );

    if ( isHashInPages.length > 0 ) {
        return (
            <div className="ti-about">
                <Header pages={pages} selected={hash}/>
                <ProductPage page={isHashInPages[0]}/>
            </div>
        );
    }

    return (
        <div className="ti-about">
            <Header pages={pages}/>
            <Hero/>
            <ProductCards/>
        </div>
    );

}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('#ti-sdk-about');

    if (!root) {
        return;
    }

    render(
        <About/>,
        root
    );
});

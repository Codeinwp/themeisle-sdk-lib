document.addEventListener('DOMContentLoaded', () => {
    document.dispatchEvent(new Event('themeisle:banner:init'));
});

// NOTE: use this event if you need to load the banner on an event other than DOMContentLoaded
document.addEventListener('themeisle:banner:init', () => {
    initializeBanner();
});

function initializeBanner() {
    if ( 'undefined' === typeof window.tsdk_banner_data ) {
        return;
    }

    const bannerRoot = document.getElementById('tsdk_banner');
    if ( ! bannerRoot ) {
        return;
    }

    bannerRoot.innerHTML = window.tsdk_banner_data.content;
}
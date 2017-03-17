export default function Header( { pages = [], selected = '' } ) {
    const {currentProduct, logoUrl, strings, links } = window.tiSDKAboutData;

    const hasActiveClass = (hash = '') => {
      return  hash === selected ? 'active' : '';
    };

    const supportURLBasePath = ['neve', 'hestia'].indexOf( currentProduct.slug ) > -1 ? 'theme' : 'plugin';
    const reviewLink         = `https://wordpress.org/support/${supportURLBasePath}/${currentProduct.slug?.replaceAll( '_', '-' )}/reviews/#new-post`;

    return (
        <div>
            <div className="head">
                <div className="container">
                    <img src={logoUrl} alt={currentProduct.name}/>
                    <p>by <a href="https://themeisle.com">Themeisle</a></p>
                    <p className="review-link">Enjoying {currentProduct.name}? <a href={reviewLink} target="_blank">Give us a rating!</a></p>
                </div>
            </div>
            {( links.length > 0 || pages.length > 0 ) && <div className="container">
                <ul className="nav">
                    <li className={hasActiveClass()}>
                        <a href={window.location}>{strings.aboutUs}</a>
                    </li>

                    {pages.map((page, index) => (
                        <li className={hasActiveClass(page.hash)} key={index}>
                            <a href={page.hash}>
                                {page.name}
                            </a>
                        </li>
                    ))}

                    {links.map((link, index) => (
                        <li key={index}>
                            <a href={link.url}>
                                {link.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>}
        </div>
    );
}

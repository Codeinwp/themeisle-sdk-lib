export default function WidgetPanel( {isActive, onToggle} ) {

    const { logoUrl, primaryColor, strings, links } = window.tiSDKFloatData;

    return (
        <div className={`ti-float-widget-panel`} style={ { '--ti-float-primary-color': primaryColor } }>
            <div className="ti-float-widget-panel__header">
                <img src={logoUrl} alt="Site Logo" />
                { strings.panelGreet && <p>{ strings.panelGreet }</p> }
                { strings.panelTitle && <h3>{ strings.panelTitle }</h3> }
            </div>
            <div className="ti-float-widget-panel__content">
                {
                    links &&
                    links.map((link, index) => (
                        <a key={'ti-float_link_' + index} href={link.link} target={ link?.internal === true ? "_self" : "_blank" }>
                            <span className={'dashicons ' + link.icon}></span>
                            {link.title}
                        </a>
                    ))
                }
                <a href="#ti-toggle-widget-float" className="screen-reader-shortcut">{ strings.closeToggle ? strings.closeToggle : 'Close' }</a>
            </div>
        </div>
    );
}

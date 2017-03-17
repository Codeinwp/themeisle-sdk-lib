import {useState} from '@wordpress/element';
import {Button} from '@wordpress/components';

export default function Hero() {
    const {
        strings, teamImage, homeUrl, pageSlug
    } = window.tiSDKAboutData;

    const {
        heroHeader, heroTextFirst, heroTextSecond, teamImageCaption, newsHeading, emailPlaceholder, signMeUp,
    } = strings;

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSubscribed, setHasSubscribed] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch('https://api.themeisle.com/tracking/subscribe', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, */*;q=0.1',
                'Cache-Control': 'no-cache'
            }, body: JSON.stringify({
                slug: 'about-us',
                site: homeUrl,
                from: pageSlug,
                email
            })
        })
            .then(r => r.json())
            .then((response) => {
                setLoading(false);

                if ( 'success' === response.code ) {
                    setHasSubscribed(true);
                }
            })?.catch((error) => {
                setLoading(false);
            });
    };


    const updateEmail = (e) => {
        setEmail(e.target.value);
    }

    return (<div className="container">
        <div className="story-card">
            <div className="body">
                <div>
                    <h2>{heroHeader}</h2>
                    <p>{heroTextFirst}</p>
                    <p>{heroTextSecond}</p>
                </div>

                <figure>
                    <img src={teamImage} alt={teamImageCaption}/>
                    <figcaption>{teamImageCaption}</figcaption>
                </figure>
            </div>

            <div className="footer">
                <h2>
                    {newsHeading}
                </h2>
                <form onSubmit={submit}>
                    <input
                        disabled={loading || hasSubscribed}
                        type="email"
                        value={email}
                        onChange={updateEmail}
                        placeholder={emailPlaceholder}
                    />
                    {!loading && ! hasSubscribed && <Button isPrimary type="submit">{signMeUp}</Button>}
                    {loading && <span className="dashicons dashicons-update spin"/>}
                    {hasSubscribed && <span className="dashicons dashicons-yes-alt"/>}
                </form>
            </div>
        </div>
    </div>);
}
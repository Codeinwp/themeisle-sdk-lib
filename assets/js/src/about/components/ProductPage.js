import Otter from './pages/Otter';

const pagesMap = {
    'otter-page': Otter
}

function Page( props ) {
    const CurrentPage = pagesMap[props.id];
    return <CurrentPage page={ props.page } />;
}
export default function ProductPage({page= {}}) {
    return (<div className={'product-page' + ( page && page.product ? ' ' + page.product : '' ) }>
        <Page id={ page.id } page={page}/>
    </div>);
}

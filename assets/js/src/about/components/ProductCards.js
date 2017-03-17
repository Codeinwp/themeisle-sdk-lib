import ProductCard from './ProductCard';

export default function ProductCards() {
    const {products} = window.tiSDKAboutData;
    return (
        <div className="container">
            <div className="product-cards">
                {Object.keys(products).map((key, index) => (
                    <ProductCard key={key} slug={key} product={products[key]}/>
                ))}
            </div>
        </div>
    );
}
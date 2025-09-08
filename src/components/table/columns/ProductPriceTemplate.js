"use client";

import ProductPrice from "@/components/product/ProductPrice";

export default function ProductPriceTemplate({ product }) {
    const productPrice = ProductPrice({ product: product });

    if (!productPrice.canViewPrice) {
        return (
            <div className="flex items-center lg:flex-col lg:items-start gap-1">
                <div className="text-shade1">{"-"}</div>
            </div>
        );
    }

    if (!productPrice.price && !productPrice.priceWithoutDiscount) {
        return <div className="text-sm text-shade1">Price not available</div>;
    }

    return (
        <div className="flex items-center lg:flex-col lg:items-start gap-1">
            {productPrice.priceWithoutDiscount ? (
                <div className="text-xs font-normal text-shade1/50 line-through">
                    {productPrice.priceWithoutDiscount}
                </div>
            ) : null}
            <div className="text-shade1">{productPrice.price || "-"}</div>
        </div>
    );
}

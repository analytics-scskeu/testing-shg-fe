"use client";

import { formatPrice } from "@/utils/helper";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";

export default function ProductPrice({ product }) {
    const user = useSelector(selectorUser);
    const canViewPrice = user.permissions.includes("view_price");

    const price =
        canViewPrice && product?.price?.regularPrice?.amount?.value
            ? formatPrice(product.price.regularPrice.amount.currency, product.price.regularPrice.amount.value)
            : null;
    const priceWithoutDiscount =
        canViewPrice && product?.special_price
            ? formatPrice(product?.price?.regularPrice?.amount?.currency, product.special_price ?? 0)
            : null;

    return {
        price,
        priceWithoutDiscount,
        canViewPrice,
    };
}

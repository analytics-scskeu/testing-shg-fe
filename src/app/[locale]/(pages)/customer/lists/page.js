"use client";

import { Selected, Selector } from "@/components/customer/lists";
import { useState } from "react";

export default function Wishlists() {
    const [selectedWishlist, setSelectedWishlist] = useState([]);

    return (
        <div className="wishlist-listing-wrapper flex flex-wrap gap-8 mt-6 pt-8">
            <Selector selected={selectedWishlist} setSelected={setSelectedWishlist} />
            <Selected selected={selectedWishlist} />
        </div>
    );
}

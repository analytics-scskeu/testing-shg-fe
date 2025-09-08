import React from "react";
import { headers } from "next/headers";
import { serverClient } from "@/api/apolloClient";

import { GET_SUBCATEGORIES } from "@/api/queries/category";

import ProductsListing from "@/components/product/ProductsListing";

const ALL_SUBCATEGORIES_ID = 0;

export default async function ProductsListingPage({ params }) {
    const { slug: categoryUrl } = await params;

    const urlPath = "products/" + categoryUrl;

    const h = await headers();
    const client = await serverClient(h);
    const { data: subcategoriesData } = await client.query({
        query: GET_SUBCATEGORIES,
        variables: { url_key: categoryUrl },
    });

    const {
        name: subcategoryName = "",
        children_count: subcategoriesCount = 0,
        children: rawSubcategoriesList = [],
    } = subcategoriesData?.categories?.items?.[0] ?? {};

    const mappedSubcategories = (() => {
        const subcategories = rawSubcategoriesList?.map((subcategory) => ({
            id: subcategory?.id,
            label: subcategory?.name,
            url_path: subcategory?.url_path,
        }));

        subcategories.unshift({
            id: ALL_SUBCATEGORIES_ID,
            label: "All",
            url_path: urlPath,
        });

        return subcategories;
    })();

    return (
        <div className="container flex flex-col items-center justify-center mt-14 mx-auto">
            <h1 className="w-118 sm:w-full mb-10 md:w-auto md:px-0 text-lg md:text-2xl lg:text-3xl xl:text-[32px] font-medium text-shade1">
                {subcategoryName}
            </h1>

            <ProductsListing
                mappedSubcategories={mappedSubcategories}
                subcategoriesCount={subcategoriesCount}
                urlPath={urlPath}
            />
        </div>
    );
}

import { GET_BIZTALK_ITEM, GET_PRODUCT, GET_PRODUCT_ATTRIBUTES } from "@/api/queries/product";
import { serverClient } from "@/api/apolloClient";
import Tabs from "@/components/Tabs";
import { BoxIcon, CubesIcon, PCIcon } from "@/resources/images/icons";
import { SvgIcon } from "@/components/icons";
import ProductDataSection from "@/components/product/ProductDataSection";
import GeneralInfo from "@/components/product/GeneralInfo";
import { headers } from "next/headers";
import NotFound from "@/app/not-found";
import { GET_CATEGORIES } from "@/api/queries/category";
import { getTranslations } from "next-intl/server";
import ProductsListing from "@/components/product/ProductsListing";

function getUniqueCategoryIds(products) {
    return Array.from(
        new Set(products.map((product) => product.categories.map((category) => category.id)).flat())
    ).sort((a, b) => a - b);
}

export default async function ProductPage({ params }) {
    const { slug } = await params;
    const h = await headers();
    const t = await getTranslations();
    const client = await serverClient(h);

    const { data: responseProducts } = await client.query({
        query: GET_PRODUCT,
        variables: { url_key: slug },
    });

    const { data: attributesResponse } = await client.query({
        query: GET_PRODUCT_ATTRIBUTES,
    });

    const attributes = attributesResponse?.attributesList?.items || [];
    const product = responseProducts?.products?.items?.[0];

    const { data: subcategoriesData } = await client.query({
        query: GET_CATEGORIES,
        variables: { categoriesIds: getUniqueCategoryIds(product.crosssell_products) },
    });
    const rawCategoriesList = subcategoriesData?.categories?.items;
    const subcategoriesCount = subcategoriesData?.categories?.total_count ?? 0;

    const mappedCategories = (() => {
        const categories = rawCategoriesList.map((category) => ({
            id: category?.id,
            label: category?.name,
            url_path: category?.url_path,
        }));

        return categories;
    })();

    if (!product) {
        return NotFound();
    }

    const { data: responseBiztalkItem } = await client.query({
        query: GET_BIZTALK_ITEM,
        variables: { item_no: product.sku },
    });
    const productData = JSON.parse(responseBiztalkItem?.biztalkItemList?.data ?? "{}");

    const downloads = [
        { label: "ISO Technical data in Excel", url: "/downloads/iso-data.xlsx" },
        { label: "DIN Technical data in Excel", url: "/downloads/din-data.xlsx" },
        { label: "Product image in JPEG", url: "/downloads/image.jpg" },
        { label: "Basic 2D CAD in DXF", url: "/downloads/cad2d.pdf" },
        { label: "Basic 3D CAD in STEP", url: "/downloads/cad3d.pdf" },
    ];

    const tabs = [
        {
            key: "product",
            label: "Product data",
            content: (
                <ProductDataSection
                    product={product}
                    attributes={attributes}
                    downloads={downloads}
                    gallery={product.media_gallery}
                />
            ),
            icon: <SvgIcon icon={PCIcon} className="w-10 h-8"></SvgIcon>,
        },
        {
            key: "complimentary",
            label: "Complimentary products",
            content: (
                <ProductsListing
                    title={t("product.complimentary_products")}
                    mappedSubcategories={mappedCategories}
                    subcategoriesCount={subcategoriesCount}
                    skus={product.crosssell_products.map((item) => item.sku)}
                />
            ),
            icon: <SvgIcon icon={BoxIcon} className="w-10 h-8"></SvgIcon>,
        },
        {
            key: "similar",
            label: "Similar products",
            icon: <SvgIcon icon={CubesIcon} className="w-10 h-8"></SvgIcon>,
            content: (
                <ProductsListing
                    title={t("product.similar_products")}
                    skus={product.related_products.map((item) => item.sku)}
                />
            ),
        },
    ];

    return (
        <>
            <GeneralInfo product={product} productData={productData} />
            <Tabs tabs={tabs} defaultActiveTab="product" />
        </>
    );
}

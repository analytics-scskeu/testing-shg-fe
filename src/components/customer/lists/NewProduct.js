"use client";

import { Button, Input } from "@/components/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADD_PRODUCT_TO_WISHLIST, GET_WISHLIST_ITEMS } from "@/api/queries/wishlist";
import { GET_PRODUCTS } from "@/api/queries/product";
import { Spinner } from "@/components/icons";
import { useDebounce } from "@/hooks";
import Image from "next/image";

export default function AddNewWishlistProduct({ wishlistId }) {
    const t = useTranslations();

    const [searchProducts, { loading: searchingProducts }] = useLazyQuery(GET_PRODUCTS);
    const [addProductToWishlist, { loading: addingProductToWishlist }] = useMutation(ADD_PRODUCT_TO_WISHLIST, {
        update(cache, { data }) {
            const newItem = data.addProductToWishlist.wishlist_item;

            cache.updateQuery(
                {
                    query: GET_WISHLIST_ITEMS,
                    variables: { wishlistId: wishlistId },
                },
                (data) => {
                    if (!data?.wishlistItems?.items) return data;

                    return {
                        ...data,
                        wishlistItems: {
                            ...data.wishlistItems,
                            items: [...data.wishlistItems.items, newItem],
                            total_count: data.wishlistItems.total_count + 1,
                        },
                    };
                }
            );
        },
    });

    const [addNewProduct, setAddNewProduct] = useState(false);
    const [foundProducts, setFoundProducts] = useState([]);

    const searchForProduct = useDebounce(async (query) => {
        if (query) {
            const searchProductsResponse = await searchProducts({
                variables: {
                    search: query,
                    currentPage: 1,
                    pageSize: 5,
                },
            });
            setFoundProducts(searchProductsResponse.data.products.items);
        }
    }, 500);

    const addToWishlist = async (productId) => {
        await addProductToWishlist({
            variables: {
                input: {
                    wishlist_id: wishlistId,
                    product_id: productId,
                    qty: 1,
                },
            },
        });
        setFoundProducts([]);
        setAddNewProduct(false);
    };

    return (
        <div className="py-4">
            {!addNewProduct && (
                <Button styling="secondary" className="w-full lg:w-auto" onClick={() => setAddNewProduct(true)}>
                    <FontAwesomeIcon icon={faPlus} width={16} height={16} className="mr-2" />
                    {t("customer.lists.table.new")}
                </Button>
            )}
            {addNewProduct && (
                <div className="mt-2">
                    <div>
                        <span className="font-medium text-body/50 text-sm">
                            {t("customer.lists.table.search_title")}
                        </span>
                    </div>
                    <div className="relative">
                        <Input
                            onChange={(value) => {
                                setFoundProducts([]);
                                searchForProduct(value);
                            }}
                            placeholder={t("customer.lists.table.search")}
                            disabled={searchingProducts || addingProductToWishlist}
                        />
                        <button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => {
                                setFoundProducts([]);
                                setAddNewProduct(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                    {(searchingProducts || foundProducts.length > 0) && (
                        <div className="mt-2 bg-white border border-gray-shade2 shadow-lg relative min-h-12">
                            {foundProducts.map((product) => (
                                <div
                                    className="p-2 hover:bg-gray-shade3 cursor-pointer"
                                    key={product.id}
                                    onClick={() => addToWishlist(product.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={product.image.url}
                                            alt={product.image.label}
                                            width={32}
                                            height={32}
                                        />
                                        <div>
                                            <div className="text-sm font-medium">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.sku}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(searchingProducts || addingProductToWishlist) && (
                                <div className="grid place-items-center absolute top-0 w-full h-full bg-primary-shade1/10 backdrop-blur-xs">
                                    <Spinner className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

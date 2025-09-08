"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faComments, faShareAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, QuantitySelector } from "@/components/form";
import { useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import { useMutation, useQuery } from "@apollo/client";
import {
    ADD_WISHLIST_PRODUCTS_TO_CART,
    GET_WISHLIST_ITEMS,
    REMOVE_PRODUCTS_FROM_WISHLIST,
    UPDATE_PRODUCTS_IN_WISHLIST,
} from "@/api/queries/wishlist";
import Table from "@/components/table/Table";
import Image from "next/image";
import { NewProduct } from "@/components/customer/lists/index";
import { GET_CUSTOMER_CART } from "@/api/queries/cart";
import ProductPriceTemplate from "@/components/table/columns/ProductPriceTemplate";

export default function WishlistSelected({ selected }) {
    const t = useTranslations();

    const { refetch: refetchCustomerCart } = useQuery(GET_CUSTOMER_CART);
    const { data: items, loading: loadingWishlistItems } = useQuery(GET_WISHLIST_ITEMS, {
        variables: {
            wishlistId: selected,
        },
    });
    const [updateWishlist, { loading: updatingWishlistProduct }] = useMutation(UPDATE_PRODUCTS_IN_WISHLIST, {
        update(cache, { data }, { variables }) {
            const updatedItem = data.updateProductsInWishlist.wishlist.items_v2.items.find(
                (item) => parseInt(item.id) === variables.wishlistItems[0].wishlist_item_id
            );

            cache.updateQuery(
                {
                    query: GET_WISHLIST_ITEMS,
                    variables: { wishlistId: selected },
                },
                (data) => {
                    if (!data?.wishlistItems?.items) return data;

                    return {
                        ...data,
                        wishlistItems: {
                            ...data.wishlistItems,
                            items: data.wishlistItems.items.map((item) =>
                                item.wishlist_item_id === parseInt(updatedItem.id)
                                    ? { ...item, qty: updatedItem.quantity }
                                    : item
                            ),
                        },
                    };
                }
            );
        },
    });
    const [removeProductsFromWishlist, { loading: removingProductFromWishlist }] = useMutation(
        REMOVE_PRODUCTS_FROM_WISHLIST,
        {
            update(cache, { data }, { variables }) {
                if (!data.removeProductsFromWishlist.items_deleted) return;
                const removedIds = variables.wishlistItemsIds;

                cache.updateQuery(
                    {
                        query: GET_WISHLIST_ITEMS,
                        variables: { wishlistId: selected },
                    },
                    (data) => {
                        if (!data?.wishlistItems?.items) return data;

                        return {
                            ...data,
                            wishlistItems: {
                                ...data.wishlistItems,
                                items: data.wishlistItems.items.filter(
                                    (item) => !removedIds.includes(item.wishlist_item_id)
                                ),
                                total_count: data.wishlistItems.total_count - removedIds.length,
                            },
                        };
                    }
                );
            },
        }
    );
    const [addWishlistProductToCart, { loading: addingWishlistProductToCart }] = useMutation(
        ADD_WISHLIST_PRODUCTS_TO_CART,
        {
            update(cache, { data }) {
                const remainingIds = data.addWishlistItemsToCart.wishlist.items_v2.items.map((item) =>
                    parseInt(item.id)
                );

                cache.updateQuery(
                    {
                        query: GET_WISHLIST_ITEMS,
                        variables: { wishlistId: selected },
                    },
                    (data) => {
                        if (!data?.wishlistItems?.items) return data;

                        return {
                            ...data,
                            wishlistItems: {
                                ...data.wishlistItems,
                                items: data.wishlistItems.items.filter((item) =>
                                    remainingIds.includes(item.wishlist_item_id)
                                ),
                                total_count: remainingIds.length,
                            },
                        };
                    }
                );

                refetchCustomerCart();
            },
        }
    );
    const [modalOpen, setModalOpen] = useState(false);

    const updateQuantity = async (id, value) => {
        await updateWishlist({
            variables: {
                wishlistItems: [
                    {
                        quantity: value,
                        wishlist_item_id: id,
                    },
                ],
                wishlistId: selected,
            },
        });
    };

    const deleteItems = async (ids) => {
        await removeProductsFromWishlist({
            variables: {
                wishlistItemsIds: ids,
                wishlistId: selected,
            },
        });
    };

    const addToCart = async (ids) => {
        await addWishlistProductToCart({
            variables: {
                wishlistItemIds: ids,
                wishlistId: selected,
            },
        });
    };

    const columns = [
        {
            label: t("customer.lists.table.prod_title"),
            property: "wishlist_item_id",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                        <Image
                            src={item.product.small_image.url}
                            alt={item.product.small_image.label}
                            className="h-16 w-16 object-contain"
                            width={64}
                            height={64}
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-xs opacity-80">{item.product.sku}</div>
                        <div className="text-sm font-medium">{item.product.name}</div>
                        <div className="text-xs opacity-80">
                            {t("customer.lists.table.number")}: <span>{item.product_id}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: t("customer.lists.table.stock"),
            labelCentered: true,
            property: "stock",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: () => "TODO Stock",
        },
        {
            label: t("customer.lists.table.price"),
            labelCentered: true,
            property: "price",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => <ProductPriceTemplate product={item.product} />,
        },
        {
            label: t("customer.lists.table.qty"),
            labelCentered: true,
            property: "qty",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => (
                <div className="flex justify-center">
                    <QuantitySelector
                        value={item.qty}
                        onChange={(value) => updateQuantity(item.wishlist_item_id, value)}
                        className="mt-2 w-23 h-12"
                        inputClassName="text-lg md:text-lg font-medium"
                        buttonClassName="text-2xl font-semibold"
                    />
                </div>
            ),
        },
        {
            label: t("general.actions"),
            labelClassName: "ml-auto",
            labelCentered: true,
            property: "actions",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        styling="clean"
                        className="min-w-auto w-12 lg:w-auto text-danger hover:text-danger-shade1"
                        onClick={() => deleteItems([item.wishlist_item_id])}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Button
                        styling="primary"
                        onClick={() => addToCart([item.wishlist_item_id])}
                        className="min-w-auto w-12 lg:w-max"
                    >
                        <FontAwesomeIcon icon={faCartPlus} className="lg:mr-2" />
                        <span className="hidden lg:inline">{t("customer.lists.table.add_to_cart")}</span>
                    </Button>
                </div>
            ),
        },
    ];

    const [sortBy, setSortBy] = useState({
        property: "wishlist_item_id",
        direction: "DESC",
    });
    const [checkedItems, setCheckedItems] = useState([]);

    return (
        <div className="wishlist-products-listing grow basis-5xl">
            <div className="flex flex-wrap flex-col lg:flex-row justify-between lg:items-center mb-4 gap-3">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold">
                        {checkedItems.length === 0
                            ? items?.wishlistItems.wishlist_info.name
                            : checkedItems.length + " items selected"}
                    </h2>
                    {items?.wishlistItems.total_count > 0 && (
                        <Button
                            styling="clean"
                            className="ml-auto inline lg:hidden"
                            onClick={() => setCheckedItems([])}
                        >
                            {t("customer.lists.selected.cancel")}
                        </Button>
                    )}
                </div>
                {items?.wishlistItems.total_count > 0 && (
                    <div className="flex items-center gap-2 grow">
                        {checkedItems.length === 0 && (
                            <div className="flex items-center gap-4 lg:gap-2 grow">
                                <Button
                                    styling="primary"
                                    className="w-full lg:w-auto lg:ml-auto mr-4"
                                    onClick={() =>
                                        addToCart(items.wishlistItems.items.map((item) => item.wishlist_item_id))
                                    }
                                >
                                    <FontAwesomeIcon icon={faCartPlus} size="xl" className="h-6 w-6 mr-2" />
                                    {t("customer.lists.selected.all_to_cart")}
                                </Button>
                                <Button styling="secondary" className="min-w-auto px-4b">
                                    <FontAwesomeIcon icon={faShareAlt} size="xl" className="h-6 w-6" />
                                </Button>
                                <Button styling="secondary" className="min-w-auto px-4b" href="/contact">
                                    <FontAwesomeIcon icon={faComments} size="xl" className="h-6 w-6" />
                                </Button>
                            </div>
                        )}
                        {checkedItems.length > 0 && (
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 gap-y-6 grow">
                                <Button
                                    styling="clean"
                                    className="ml-auto hidden lg:block"
                                    onClick={() => setCheckedItems([])}
                                >
                                    {t("customer.lists.selected.cancel")}
                                </Button>
                                <Button
                                    styling="primary"
                                    className="grow lg:grow-0"
                                    onClick={() => {
                                        addToCart(checkedItems);
                                        setCheckedItems([]);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCartPlus} size="xl" className="h-6 w-6 mr-2" />
                                    {t("customer.lists.selected.selected_to_cart")}
                                </Button>
                                <Button styling="danger" className="grow lg:grow-0" onClick={() => setModalOpen(true)}>
                                    <FontAwesomeIcon icon={faTrash} size="xl" className="h-6 w-6 mr-2" />
                                    {t("customer.lists.selected.delete_selected")}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="my-6">
                <Table
                    columns={columns}
                    items={items?.wishlistItems.items ?? []}
                    loading={
                        loadingWishlistItems ||
                        updatingWishlistProduct ||
                        removingProductFromWishlist ||
                        addingWishlistProductToCart
                    }
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    checkbox={true}
                    checkedItems={checkedItems}
                    setCheckedItems={setCheckedItems}
                    rowKey={"wishlist_item_id"}
                    showHeaderOnMobile={true}
                    noItems={t("customer.lists.table.all_empty")}
                />
                <NewProduct wishlistId={selected} />
            </div>
            <Modal
                show={modalOpen}
                onConfirmText="Remove"
                onConfirm={() => {
                    deleteItems(checkedItems);
                    setCheckedItems([]);
                    setModalOpen(false);
                }}
                onCancelText="Cancel"
                onClose={() => setModalOpen(false)}
            >
                {t("customer.lists.table.confirm")}
            </Modal>
        </div>
    );
}

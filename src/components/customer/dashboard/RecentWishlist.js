"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Button } from "@/components/form";
import { useMutation, useQuery } from "@apollo/client";
import {
    GET_LATEST_WISHLIST_PRODUCTS,
    GET_WISHLIST_ITEMS,
    REMOVE_PRODUCTS_FROM_WISHLIST,
} from "@/api/queries/wishlist";
import { useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import { useState } from "react";
import Table from "@/components/table/Table";

export default function RecentWishlist() {
    const t = useTranslations();

    const { data: items, loading: loadingWishlistProducts } = useQuery(GET_LATEST_WISHLIST_PRODUCTS);
    const [removeProductsFromWishlist, { loading: removingProductFromWishlist }] = useMutation(
        REMOVE_PRODUCTS_FROM_WISHLIST,
        {
            update(cache, { data }, { variables }) {
                if (!data.removeProductsFromWishlist.items_deleted) return;
                const removedIds = variables.wishlistItemsIds;

                cache.updateQuery(
                    {
                        query: GET_WISHLIST_ITEMS,
                        variables: { wishlistId: variables.wishlistId },
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
                            },
                        };
                    }
                );
            },
        }
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteDetails, setDeleteDetails] = useState({
        wishlistId: null,
        wishlistItemId: null,
    });

    const deleteItem = async (wishlistId, wishlistItemId) => {
        await removeProductsFromWishlist({
            variables: {
                wishlistItemsIds: [wishlistItemId],
                wishlistId: wishlistId,
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
                        onClick={() => {
                            setDeleteDetails({
                                wishlistId: item.wishlist_id,
                                wishlistItemId: item.wishlist_item_id,
                            });
                            setModalOpen(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} width={24} height={24} />
                    </Button>
                </div>
            ),
        },
    ];

    const [sortBy, setSortBy] = useState({
        property: "wishlist_item_id",
        direction: "DESC",
    });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium">{t("customer.lists.table.recent.title")}</h2>
                <Button href="/customer/lists" styling="secondary">
                    {t("customer.lists.table.recent.button")}
                </Button>
            </div>
            <div className="mb-5">
                <div className="wishlist-history lg:overflow-x-auto">
                    <Table
                        columns={columns}
                        items={items?.lastAddedWishlistItems.items ?? []}
                        loading={loadingWishlistProducts || removingProductFromWishlist}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        rowKey={"wishlist_item_id"}
                        showHeaderOnMobile={true}
                        noItems={t("customer.lists.table.all_empty")}
                    />
                </div>
            </div>
            <Modal
                show={modalOpen}
                onConfirmText="Remove"
                onConfirm={() => {
                    deleteItem(deleteDetails.wishlistId, deleteDetails.wishlistItemId);
                    setModalOpen(false);
                }}
                onCancelText="Cancel"
                onClose={() => setModalOpen(false)}
            >
                {t("customer.lists.table.confirm")}
            </Modal>
        </>
    );
}

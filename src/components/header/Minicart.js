"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CUSTOMER_CART, REMOVE_ITEM_FROM_CART } from "@/api/queries/cart";
import { Button } from "@/components/form";
import { useMemo, useState } from "react";
import { CartIcon, PencilIcon, TrashIcon } from "@/resources/images/icons";
import Image from "next/image";
import { formatPrice } from "@/utils/helper";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/icons";
import { useClickOutside } from "@/hooks";

export default function Minicart() {
    const t = useTranslations();

    const [open, setOpen] = useState(false);
    const { data: customerCart, refetch: refetchCustomerCart } = useQuery(GET_CUSTOMER_CART);
    const [removeItemFromCart, { loading: removingItemFromCart }] = useMutation(REMOVE_ITEM_FROM_CART);

    const minicartRef = useClickOutside(() => setOpen(false));

    const productsCount = useMemo(() => {
        return customerCart?.customerCart.itemsV2.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    }, [customerCart]);

    const removeCartItem = (cartItemUid) => {
        removeItemFromCart({
            variables: {
                input: {
                    cart_id: customerCart.customerCart.id,
                    cart_item_uid: cartItemUid,
                },
            },
        }).then(() => refetchCustomerCart());
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className={`text-link icon px-2 !py-2 min-w-auto hover:bg-gray-shade5 relative`}
                styling="clean"
            >
                <CartIcon className="w-7 min-w-7 h-7.5" />
                {customerCart?.customerCart.itemsV2.total_count > 0 && (
                    <span
                        className="absolute top-0 md:-top-1.5 md:-right-1.5 h-5 px-2 py-1 rounded-full bg-primary text-white
                                text-xs font-semibold leading-none text-center"
                    >
                        {productsCount}
                    </span>
                )}
            </Button>

            {open && (
                <div className="fixed right-0 top-0 z-40 flex justify-end w-full bg-black/25">
                    <div ref={minicartRef} className="relative min-h-screen w-screen max-w-md shadow-2xl bg-white">
                        <div className="flex flex-col h-full max-h-screen px-1 py-3 sm:px-3">
                            <div className="w-full p-3 flex justify-between items-center">
                                <p id="cart-drawer-title" className="text-lg font-medium leading-7 text-gray-900">
                                    <strong>{t("cart.title")}</strong>
                                </p>
                                <Button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-300 hover:text-black transition-colors p-0! min-w-auto"
                                    styling="clean"
                                >
                                    <FontAwesomeIcon icon={faX} width={24} height={24} />
                                </Button>
                            </div>
                            {customerCart?.customerCart.itemsV2.items.length > 0 && (
                                <>
                                    <div className="relative grid gap-6 sm:gap-8 px-1 py-3 sm:px-3 border-b border-gray-100 mb-3 overflow-y-auto overscroll-y-contain no-scrollbar">
                                        {customerCart?.customerCart.itemsV2.items.map((item) => (
                                            <div
                                                key={item.uid}
                                                className="flex items-start p-3 space-x-4 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100"
                                            >
                                                <Button
                                                    href={`/${item.product.url_key}`}
                                                    className="!ml-0 w-1/4 min-w-auto p-0!"
                                                    styling="clean"
                                                >
                                                    <Image
                                                        src={item.product.thumbnail.url}
                                                        alt={item.product.name}
                                                        width={78}
                                                        height={78}
                                                    />
                                                </Button>
                                                <div className="w-3/4 space-y-2">
                                                    <div>
                                                        <p className="text-xl">
                                                            {item.quantity} x {item.product.name}
                                                        </p>
                                                        <p className="text-sm">{item.product.sku}</p>
                                                    </div>
                                                    <p className="font-medium">
                                                        {formatPrice(
                                                            item.prices.price.currency,
                                                            item.prices.price.value
                                                        )}
                                                    </p>
                                                    <div className="pt-4 flex gap-3">
                                                        <Button className="min-w-auto p-2! w-9 h-9">
                                                            {/* TODO: ADD URL TO PRODUCT PAGE WITH UPDATE */}
                                                            <PencilIcon />
                                                        </Button>
                                                        <Button
                                                            onClick={() => removeCartItem(item.uid)}
                                                            className="min-w-auto p-2! w-9 h-9"
                                                        >
                                                            <TrashIcon />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full p-3 space-x-4 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100">
                                        <p>
                                            {t("cart.subtotal")}:{" "}
                                            {formatPrice(
                                                customerCart?.customerCart.prices.grand_total.currency,
                                                customerCart?.customerCart.prices.grand_total.value
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-full p-3 flex gap-4 items-center transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 mt-2">
                                        <Button href="/checkout" className="min-w-auto">
                                            {t("cart.to_checkout")}
                                        </Button>
                                        <span>or</span>
                                        <Link href="/checkout/cart" className="underline">
                                            {/* TODO: REMOVE WARNING */}
                                            {t("cart.to_view")}
                                        </Link>
                                    </div>
                                    {removingItemFromCart && (
                                        <div className="grid place-items-center absolute top-0 left-0 w-full h-full bg-primary-shade1/10 backdrop-blur-xs">
                                            <Spinner />
                                        </div>
                                    )}
                                </>
                            )}
                            {customerCart?.customerCart.itemsV2.items.length === 0 && (
                                <p className="p-3">{t("cart.empty")}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

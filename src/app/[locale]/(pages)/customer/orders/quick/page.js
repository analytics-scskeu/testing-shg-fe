"use client";

import { Button, Input, QuantitySelector } from "@/components/form";
import { TrashIcon } from "@/resources/images/icons";
import { Spinner, SvgIcon } from "@/components/icons";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { formatPrice } from "@/utils/helper";
import {
    ADD_PRODUCTS_TO_CART,
    CHECK_PRODUCT_AVAILABILITY,
    GET_CUSTOMER_CART,
    REMOVE_ITEM_FROM_CART,
} from "@/api/queries/cart";
import { useTranslations } from "next-intl";

export default function QuickOrder() {
    const t = useTranslations();

    const { data: cart, refetch: refetchCart } = useQuery(GET_CUSTOMER_CART);
    const [checkProductAvailability] = useLazyQuery(CHECK_PRODUCT_AVAILABILITY);
    const [addProductsToCart, { loading: addingProductsToCart }] = useMutation(ADD_PRODUCTS_TO_CART);
    const [removeItemFromCart, { loading: removingItemFromCart }] = useMutation(REMOVE_ITEM_FROM_CART);
    const [lines, setLines] = useState([{ id: 0, sku: "", qty: 1, error: false }]);
    const [nextId, setNextId] = useState(1);
    const [inputsDisabled, setInputsDisabled] = useState(false);

    const addLine = () => {
        setLines([...lines, { id: nextId, sku: "", qty: 1, error: false }]);
        setNextId(nextId + 1);
    };

    const updateSku = (value, name) => {
        const index = name.replace(/\D/g, "");
        setLines(lines.map((line, i) => (i === parseInt(index) ? { ...line, sku: value, error: false } : line)));
    };

    const updateQuantity = (index, value) => {
        setLines(lines.map((line, i) => (i === index ? { ...line, qty: parseInt(value), error: false } : line)));
    };

    const deleteLine = (index) => {
        setLines(lines.filter((line, i) => i !== index));
    };

    const checkAvailability = () => {
        setInputsDisabled(true);

        let validationError = false;
        for (const line of lines) {
            if (!line.sku) {
                addErrorToLine(line.sku, "SKU is required");
                validationError = true;
                break;
            }
        }
        if (validationError) {
            setInputsDisabled(false);
            return;
        }

        checkProductAvailability({
            variables: {
                items: lines.map(({ sku, qty }) => ({ sku, qty })),
            },
        }).then((response) => {
            let errors = [];
            response.data.checkAvailability.items.map((item) => {
                if (!item.is_available) {
                    if (item.price === "N/A") {
                        errors.push({ sku: item.sku, error: item.name });
                    } else {
                        errors.push({ sku: item.sku, error: `Only ${item.stock_qty} items available` });
                    }
                }
            });
            if (!errors.length) {
                addProductsToCart({
                    variables: {
                        cartId: cart.customerCart.id,
                        cartItems: lines.map(({ sku, qty }) => ({ sku, quantity: qty })),
                    },
                }).then((response) => {
                    if (!response.data.addProductsToCart.user_errors.code) {
                        refetchCart();
                        setLines([{ id: 0, sku: "", qty: 1, error: false }]);
                    }
                });
            } else {
                const errorMap = new Map(errors.map((error) => [error.sku, error.error]));
                const updatedLines = lines.map((line) => ({
                    ...line,
                    error: errorMap.has(line.sku) ? errorMap.get(line.sku) : false,
                }));
                setLines(updatedLines);
            }
            setInputsDisabled(false);
        });
    };

    const addErrorToLine = (sku, errorMessage) => {
        setLines(lines.map((line) => (line.sku === sku ? { ...line, error: errorMessage } : line)));
    };

    const removeCartItem = (cartItemUid) => {
        removeItemFromCart({
            variables: {
                input: {
                    cart_id: cart.customerCart.id,
                    cart_item_uid: cartItemUid,
                },
            },
        }).then(() => refetchCart());
    };

    return (
        <div className="flex flex-wrap gap-8">
            <div className="grow">
                <h1 className="mb-8 text-3xl font-medium">{t("customer.orders.quick.title")}</h1>
                <div className="flex gap-6 px-4 py-3 text-xs font-medium bg-container">
                    <span className="grow">{t("customer.orders.quick.lines.sku")}</span>
                    <span className="w-[6.5rem]">{t("customer.orders.quick.lines.qty")}</span>
                </div>
                <fieldset>
                    {lines.map((line, index) => (
                        <div
                            className="flex flex-wrap gap-6 px-6 py-4 border-b border-[#14142A1F] last:border-0"
                            key={line.id}
                        >
                            <div className="grow">
                                <Input
                                    disabled={inputsDisabled}
                                    type="text"
                                    className="w-full border-body/15"
                                    value={line.sku}
                                    onChange={updateSku}
                                    name={`sku[${line.id}]`}
                                    error={line.error}
                                    placeholder={t("customer.orders.quick.lines.placeholder")}
                                />
                            </div>
                            <QuantitySelector
                                value={line.qty}
                                onChange={(value) => updateQuantity(index, value)}
                                disabled={inputsDisabled}
                                className="mt-2 w-23 h-13.5 md:h-14.5"
                                inputClassName="text-lg md:text-lg font-medium"
                                buttonClassName="text-2xl font-semibold"
                            />
                            {lines.length > 1 && (
                                <div className="grid place-items-center">
                                    <SvgIcon
                                        className="cursor-pointer text-danger"
                                        icon={TrashIcon}
                                        onClick={() => deleteLine(line.id)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </fieldset>
                <div className="mt-4">
                    <Button styling="clean" onClick={addLine} className="min-w-none p-0!" disabled={inputsDisabled}>
                        <FontAwesomeIcon icon={faPlus} width={16} height={16} />
                        {t("customer.orders.quick.lines.add")}
                    </Button>
                </div>
                <div className="mt-10">
                    <Button styling="primary" onClick={checkAvailability} disabled={inputsDisabled}>
                        <span>{t("customer.orders.quick.lines.check")}</span>
                    </Button>
                </div>
            </div>
            <div className="w-full lg:w-2/5 card p-8 bg-white shadow-long self-start">
                <h2 className="text-2xl font-medium pb-6 mb-6 border-b border-[#14142A1F]">
                    {t("customer.orders.quick.cart.title")}
                </h2>
                <div className="flex gap-6 px-4 py-3 text-xs font-medium bg-container mt-6">
                    <span className="w-3/6 min-w-fit">{t("customer.orders.quick.cart.product_title")}</span>
                    <span className="w-2/6 min-w-fit">{t("customer.orders.quick.cart.price")}</span>
                    <span className="w-1/6 text-center min-w-fit">{t("customer.orders.quick.cart.qty")}</span>
                    <span className="min-w-6"></span>
                </div>
                <fieldset className="relative min-h-20">
                    {cart?.customerCart.itemsV2.items.map((item) => (
                        <div
                            className="flex items-center gap-6 px-4 pt-3 pb-4 border-b border-[#14142A1F]"
                            key={item.uid}
                        >
                            <div className="w-3/6 flex flex-col">
                                <span className="text-xs">{item.product.sku}</span>
                                <span className="font-medium text-sm">{item.product.name}</span>
                            </div>
                            <span className="w-2/6 font-medium text-sm">
                                {formatPrice(item.prices.price.currency, item.prices.price.value)}
                            </span>
                            <span className="w-1/6 font-medium text-sm text-center">{item.quantity}</span>
                            <span className="min-w-6 flex text-center">
                                <SvgIcon
                                    icon={TrashIcon}
                                    className="text-danger cursor-pointer"
                                    onClick={() => removeCartItem(item.uid)}
                                />
                            </span>
                        </div>
                    ))}
                    {(!cart || addingProductsToCart || removingItemFromCart) && (
                        <div className="grid place-items-center absolute top-0 w-full h-full py-5 bg-primary-shade1/10 backdrop-blur-xs min-h-20">
                            <Spinner />
                        </div>
                    )}
                </fieldset>
                <div className="mt-10 w-full">
                    <Button styling="primary" href="/checkout">
                        <span>{t("customer.orders.quick.cart.to_checkout")}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

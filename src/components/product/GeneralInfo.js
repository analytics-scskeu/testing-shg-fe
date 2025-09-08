"use client";

import { Button, Input, QuantitySelector, Select } from "@/components/form";
import { SvgIcon } from "@/components/icons";
import {
    CartIcon,
    CommentIcon,
    CompareIcon,
    HeartIcon,
    InfoIcon,
    PrintIcon,
    ShareIcon,
} from "@/resources/images/icons";
import ProductGrades from "@/components/product/ProductGrades";
import { useLocale, useTranslations } from "next-intl";
import ProductGallerySection from "@/components/slider/ProductGallerySection";
import Modal from "@/components/Modal";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ADD_PRODUCT_TO_WISHLIST, CREATE_WISHLIST, GET_WISHLISTS } from "@/api/queries/wishlist";
import { ADD_PRODUCT_TO_COMPARE } from "@/api/queries/product";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ADD_WISHLIST_SCHEMA } from "@/utils/validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCopy, faEnvelope, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faFacebookSquare, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useNotifications } from "@/hooks";
import { Tooltip } from "react-tooltip";
import { ADD_TO_CART, GET_CUSTOMER_CART } from "@/api/queries/cart";
import { parseProductData } from "@/utils/helper";

export default function GeneralInfo({ product, productData }) {
    const t = useTranslations();
    const locale = useLocale();
    const { stock_locations, stock_total } = parseProductData(productData);
    const { setNotifications, RenderNotifications } = useNotifications();
    const user = useSelector(selectorUser);
    const [quantity, setQuantity] = useState(1);
    const [showDialog, setShowDialog] = useState("");
    const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ADD_WISHLIST_SCHEMA),
        mode: "onSubmit",
        defaultValues: {
            wishlist: "",
            newWishlist: false,
        },
    });
    const [addProductToCompare] = useMutation(ADD_PRODUCT_TO_COMPARE);
    const [addProductToWishlist] = useMutation(ADD_PRODUCT_TO_WISHLIST);
    const [createWishlist] = useMutation(CREATE_WISHLIST, {
        update(cache) {
            cache.evict({
                fieldName: "customerWishlists",
            });
            cache.gc();
        },
    });
    const [addProductToCart] = useMutation(ADD_TO_CART);

    const { data: responseWishlists } = useQuery(GET_WISHLISTS, {
        skip: !user.data,
    });
    const [getCustomerCart] = useLazyQuery(GET_CUSTOMER_CART);

    const addToWishlist = async (formData) => {
        if (formData.newWishlist) {
            const { data: responseCreateWishlist } = await createWishlist({
                variables: {
                    input: {
                        name: formData.wishlist,
                    },
                },
            });

            if (responseCreateWishlist?.createWishlist.success) {
                await addProductToWishlist({
                    variables: {
                        input: {
                            wishlist_id: responseCreateWishlist.createWishlist.wishlist.wishlist_id,
                            product_id: product.id,
                            qty: 1,
                        },
                    },
                });
            }
        } else {
            await addProductToWishlist({
                variables: {
                    input: {
                        wishlist_id: formData.wishlist,
                        product_id: product.id,
                        qty: 1,
                    },
                },
            });
        }

        setShowDialog("");
    };

    const addToCart = async () => {
        const { data: responseGetCustomerCart, error: errorGetCustomerCart } = await getCustomerCart();
        if (errorGetCustomerCart || !responseGetCustomerCart?.customerCart) {
            setNotifications([
                {
                    type: "error",
                    message: t("something_went_wrong"),
                },
            ]);
            return;
        }

        const cartId = responseGetCustomerCart.customerCart.id;
        const { errors: errorsAddProductToCart } = await addProductToCart({
            variables: {
                cartId: cartId,
                cartItems: [
                    {
                        data: {
                            quantity: quantity,
                            sku: product.sku,
                        },
                    },
                ],
            },
        });

        if (errorsAddProductToCart?.length) {
            setNotifications([
                {
                    type: "error",
                    message: errorsAddProductToCart[0].message,
                },
            ]);
        } else {
            setNotifications([
                {
                    type: "success",
                    message: t("product.added_to_cart"),
                },
            ]);
        }
    };

    const addToCompare = async () => {
        const { data: responseAddToCompare, errors } = await addProductToCompare({
            variables: {
                input: [product.id],
            },
        });

        setNotifications([
            {
                type: "error",
                message: t("something_went_wrong"),
            },
        ]);

        if (responseAddToCompare.createCompareList) {
            setNotifications([
                {
                    type: "success",
                    message: t("product.added_to_compare"),
                },
            ]);
        }

        if (errors?.length) {
            setNotifications([
                {
                    type: "error",
                    message: t("something_went_wrong"),
                },
            ]);
        }
    };

    const renderShareTooltipContent = () => {
        return (
            <div className="flex flex-row gap-1">
                <Button
                    onClick={() => {
                        window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                            "_blank"
                        );
                    }}
                    target="_blank"
                    className="px-2 py-2 md:py-2 min-w-auto z-50"
                    styling="clean"
                >
                    <FontAwesomeIcon icon={faFacebookSquare} className={"text-xl"}></FontAwesomeIcon>
                </Button>
                <Button
                    onClick={() => {
                        window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                            "_blank"
                        );
                    }}
                    className="px-2 py-2 md:py-2 min-w-auto"
                    styling="clean"
                >
                    <FontAwesomeIcon icon={faLinkedin} className={"text-xl"}></FontAwesomeIcon>
                </Button>
                <Button
                    data-tooltip-id={`copy-tooltip`}
                    onClick={() => {
                        console.log("Not implemented yet");
                    }}
                    className="px-2 py-2 md:py-2 min-w-auto"
                    styling="clean"
                >
                    <FontAwesomeIcon icon={faEnvelope} className={"text-xl"}></FontAwesomeIcon>
                </Button>
                <Button
                    data-tooltip-id={`copy-tooltip`}
                    onClick={async () => {
                        if (window.location.protocol !== "https:") {
                            console.log("The copy functionality work only on secure pages. (https)");
                            return;
                        }
                        await navigator.clipboard.writeText(window.location.href);
                        setCopyTooltipOpen(true);
                        setTimeout(() => {
                            setCopyTooltipOpen(false);
                        }, 2000);
                    }}
                    className="px-2 py-2 md:py-2 min-w-auto"
                    styling="clean"
                >
                    <FontAwesomeIcon icon={faCopy} className={"text-xl"}></FontAwesomeIcon>
                </Button>
                <Tooltip
                    id={`copy-tooltip`}
                    place="bottom"
                    content={t("product.copy_tooltip")}
                    isOpen={copyTooltipOpen}
                />
            </div>
        );
    };

    return (
        <>
            <RenderNotifications containerClassName={"mt-4"} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 lg:p-6 w-full relative">
                <Modal
                    show={showDialog === "add-to-wishlist"}
                    onConfirmText={t("general.yes")}
                    onConfirm={handleSubmit(addToWishlist)}
                    onCancelText={t("general.no")}
                    onClose={() => {
                        setShowDialog("");
                        setValue("newWishlist", false);
                        setValue("wishlist", "");
                    }}
                >
                    {watch("newWishlist") ? (
                        <Input
                            control={control}
                            error={errors.wishlist?.message}
                            required={true}
                            placeholder={t("customer.lists.selector.name")}
                            label={t("fields.wishlist")}
                            name={"wishlist"}
                        />
                    ) : (
                        <Select
                            error={errors.wishlist?.message}
                            placeholder={t("customer.lists.selector.select")}
                            control={control}
                            label={t("fields.wishlist")}
                            name={"wishlist"}
                            options={responseWishlists?.customerWishlists?.items?.map((wishlist) => ({
                                label: wishlist.name,
                                value: wishlist.wishlist_id,
                            }))}
                            errors={[errors.wishlist]}
                            required={true}
                        />
                    )}
                    <Button
                        className={"pl-0"}
                        styling={"clean"}
                        onClick={(e) => {
                            e.preventDefault();
                            setValue("newWishlist", !watch("newWishlist"));
                            setValue("wishlist", "");
                        }}
                    >
                        {watch("newWishlist") ? (
                            <>
                                <FontAwesomeIcon className={"pr-1"} icon={faArrowLeft} />
                                <span>{t("product.use_existing_wishlist")}</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon className={"pr-1"} icon={faPlus} />
                                <span>{t("product.create_new_wishlist")}</span>
                            </>
                        )}
                    </Button>
                </Modal>
                <div className="lg:absolute right-0 top-0 flex lg:mx-3 -mx-2 justify-end">
                    <Button className="px-2 py-1 min-w-auto" styling="clean" data-tooltip-id={`product-share-tooltip`}>
                        <SvgIcon icon={ShareIcon} className="w-10 h-10"></SvgIcon>
                    </Button>
                    <Tooltip
                        id={`product-share-tooltip`}
                        place="bottom"
                        content={renderShareTooltipContent()}
                        clickable={true}
                        openOnClick={true}
                        offset={0}
                        className={"!border-primary-shade1 !px-2 !py-1 !border-2 !bg-white z-50"}
                        arrowColor={"#000000"}
                    ></Tooltip>
                    <Button href={"/contact"} className="px-2 py-1 min-w-auto" styling="clean">
                        <SvgIcon icon={CommentIcon} className="w-10 h-10"></SvgIcon>
                    </Button>
                    <Button
                        onClick={() => {
                            window.print();
                        }}
                        className="px-2 py-1 min-w-auto"
                        styling="clean"
                    >
                        <SvgIcon icon={PrintIcon} className="w-10 h-10"></SvgIcon>
                    </Button>
                </div>
                <div className="p-4 flex justify-center items-center bg-container">
                    <ProductGallerySection images={product.media_gallery} />
                </div>

                <div className="">
                    <p className="text-xs md:text-sm text-shade1/78 mb-2">{product.sku ?? "1234555"}</p>
                    <h1 className="text-lg md:text-[32px] font-bold">SDPX0580S06H03</h1>
                    <h3 className="mt-2 text-shade1/78 text-xs md:text-lg">{product.name}</h3>

                    <div className="md:grid grid-cols-2 mt-4">
                        <div className="">
                            <h3 className="text-xs md:text-sm text-shade1/78 mb-3">
                                {" "}
                                {t("product.workpiece_materials")}
                            </h3>
                            <ProductGrades gradeClass={product.grade_class} />
                        </div>

                        <div className="">
                            <h3 className="text-xs md:text-sm text-shade1/78 mb-3">{t("product.applications")}</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-sm text-shade1/78">
                        <div>
                            <p className="text-xs md:text-sm">{t("product.stock")}</p>
                            <span className="font-bold text-md md:text-base">{stock_total}</span>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm">{t("product.stock_location")}</p>
                            <span className="font-bold text-md md:text-base">
                                {t("product.stock_location_message", {
                                    locations: new Intl.ListFormat(locale, {
                                        style: "long",
                                        type: "conjunction",
                                    }).format(stock_locations),
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="min-[400px]:flex gap-3 mt-6">
                        {user.data && (
                            <Button
                                onClick={() => setShowDialog("add-to-wishlist")}
                                className="px-4 max-[400px]:w-full max-[400px]:mb-3"
                                styling="secondary"
                            >
                                <SvgIcon icon={HeartIcon} className="max-md:h-5"></SvgIcon>{" "}
                                {t("product.add_to_wishlist")}
                            </Button>
                        )}
                        <Button onClick={addToCompare} className="px-4 max-[400px]:w-full" styling="secondary">
                            <SvgIcon icon={CompareIcon} className="max-md:h-5"></SvgIcon>
                            {t("product.compare_products")}
                        </Button>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                        <div className="">
                            <p className="text-shade1/78 text-xs md:text-sm">{t("product.net_price")}</p>

                            {product.price?.minimalPrice?.amount?.value !==
                                product.price?.maximalPrice?.amount?.value && (
                                <div className="flex items-center gap-1 text-shade1/78 text-[10px] md:text-xs my-2">
                                    <p className="line-through">
                                        {product.price?.maximalPrice?.amount?.value.toFixed(2)}{" "}
                                        {product.price?.maximalPrice?.amount?.currency}
                                    </p>
                                    <span className="no-underline">({t("product.discount")})</span>
                                </div>
                            )}

                            <p className="text-2xl font-bold">
                                {product.price?.minimalPrice?.amount?.value.toFixed(2)}{" "}
                                {product.price?.minimalPrice?.amount?.currency}
                            </p>
                        </div>
                        <SvgIcon icon={InfoIcon} className="items-center justify-center ml-4" width={18} height={18} />
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <QuantitySelector
                            value={quantity}
                            onChange={setQuantity}
                            max={stock_total}
                            disabled={!stock_total}
                            className="w-40 h-14"
                            inputClassName="text-lg md:text-lg font-medium"
                            buttonClassName="w-15 text-2xl font-semibold"
                        />
                        <Button
                            disabled={product.stock_status !== "IN_STOCK"}
                            className="mx-2 whitespace-nowrap mt-1"
                            onClick={addToCart}
                        >
                            <div className="flex items-center justify-center text-white">
                                <SvgIcon
                                    className="mr-2 w-6 h-6 text-white"
                                    icon={CartIcon}
                                    alt="{t('product.add_to_cart')}"
                                />
                                {t("product.add_to_cart")}
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

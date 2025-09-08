"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";

import Table from "@/components/table/Table";
import TablePagination from "@/components/table/TablePagination";
import FiltersCard from "@/components/FiltersCard";
import SubcategorySelector from "@/components/SubcategorySelector";
import Modal from "@/components/Modal";
import { Button, Input, QuantitySelector, Select } from "@/components/form";
import ProductGrades from "@/components/product/ProductGrades";
import ProductActionsTemplate from "@/components/table/columns/ProductActionsTemplate";
import ProductPriceTemplate from "@/components/table/columns/ProductPriceTemplate";
import ProductTitleTemplate from "@/components/table/columns/ProductTitleTemplate";
import ColumnsSettings from "@/components/ColumnsSettings";
import CustomScrollbar from "@/components/CustomScrollbar";
import { Spinner } from "@/components/icons";

import { ADD_PRODUCT_TO_COMPARE, GET_PRODUCTS } from "@/api/queries/product";
import { GET_ATTRIBUTES } from "@/api/queries/attributes";
import { ADD_PRODUCT_TO_WISHLIST, CREATE_WISHLIST, GET_WISHLISTS } from "@/api/queries/wishlist";
import { ADD_TO_CART, GET_CUSTOMER_CART } from "@/api/queries/cart";

import { useDebounce, useNotifications } from "@/hooks";
import { selectorUser } from "@/store/user";
import { ADD_WISHLIST_SCHEMA } from "@/utils/validation";

const DEFAULT_ITEMS_PER_PAGE = 10;
const DEFAULT_SORT_BY = { property: "name", direction: "ASC" };
const ALL_SUBCATEGORIES_ID = 0;
const SEARCH_DEBOUNCE_TIME = 500;
const EXCLUDED_COLUMNS = ["grade_class", "category_uid"];

export default function ProductsListing({ title, mappedSubcategories, subcategoriesCount, urlPath, skus }) {
    const t = useTranslations();
    const scrollRef = useRef(null);
    const user = useSelector(selectorUser);
    const { setNotifications, RenderNotifications } = useNotifications();
    const isLoggedIn = !user.isGuest;
    const canAddToCart = user.permissions.includes("add_to_cart");

    const [selectedSubcategory, setSelectedSubcategory] = useState(ALL_SUBCATEGORIES_ID);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [productToAddToWishlist, setProductToAddToWishlist] = useState(null);

    const debouncedSetSearch = useDebounce(setSearch, SEARCH_DEBOUNCE_TIME);

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

    const { data: attributesData, loading: filtersLoading } = useQuery(GET_ATTRIBUTES);
    const [addProductToCompare] = useMutation(ADD_PRODUCT_TO_COMPARE);
    const [addProductToWishlistMutation] = useMutation(ADD_PRODUCT_TO_WISHLIST);
    const [createWishlistMutation] = useMutation(CREATE_WISHLIST, {
        update(cache) {
            cache.evict({
                fieldName: "customerWishlists",
                args: { customerId: user.data.id },
            });
            cache.gc();
        },
    });
    const [addProductToCartMutation] = useMutation(ADD_TO_CART);
    const [getCustomerCartQuery] = useLazyQuery(GET_CUSTOMER_CART);

    const { data: wishlistsData } = useQuery(GET_WISHLISTS, {
        skip: !user.data,
    });

    const mappedAttributes = useMemo(() => {
        return (
            attributesData?.attributesList?.items?.map((attribute) => ({
                id: attribute?.code,
                label: attribute?.label,
                type: attribute?.frontend_input,
                options:
                    attribute?.options?.map((option) => ({
                        label: option?.label,
                        value: option?.value,
                    })) ?? [],
            })) ?? []
        );
    }, [attributesData]);

    const getFilterType = useCallback(
        (filterCode) => mappedAttributes.find((f) => f.id === filterCode)?.type ?? null,
        [mappedAttributes]
    );

    const productFilters = useMemo(() => {
        const filters = {};
        const selectedSubcategoryPath = mappedSubcategories?.find(
            (subcategory) => subcategory.id === selectedSubcategory
        )?.url_path;

        if (skus) {
            filters.sku = { in: skus };
            if (selectedSubcategoryPath) {
                filters.category_url_path = { eq: selectedSubcategoryPath };
            }
        } else if (selectedSubcategoryPath) {
            filters.category_url_path = { eq: selectedSubcategoryPath };
        } else if (urlPath) {
            filters.category_url_path = { eq: urlPath };
        }

        for (const id in selectedFilters) {
            const filterType = getFilterType(id);
            const filterValue = selectedFilters[id];

            switch (filterType) {
                case "PRICE":
                    if (typeof filterValue === "string" && filterValue.includes("_")) {
                        const [from, to] = filterValue.split("_");
                        if (from && to) filters[id] = { from, to };
                    }
                    break;
                case "MULTISELECT":
                    if (Array.isArray(filterValue) && filterValue.length > 0) {
                        filters[id] = { in: filterValue };
                    }
                    break;
                default:
                    filters[id] = { eq: String(filterValue) };
                    break;
            }
        }
        return filters;
    }, [selectedFilters, selectedSubcategory, mappedSubcategories, urlPath, skus, getFilterType]);

    const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
        variables: {
            search,
            filter: productFilters,
            sort: { [sortBy.property]: sortBy.direction },
            currentPage,
            pageSize: itemsPerPage,
        },
    });

    const {
        items: products = [],
        aggregations: columns = [],
        total_count: totalProducts = 0,
        page_info: pageInfo = {},
    } = productsData?.products ?? {};

    const handleAddToCart = async (product, quantity) => {
        const { data: customerCartData, error: customerCartError } = await getCustomerCartQuery();

        if (customerCartError || !customerCartData?.customerCart) {
            setNotifications([{ type: "error", message: t("something_went_wrong") }]);
            return;
        }

        const cartId = customerCartData.customerCart.id;
        const { errors: addProductErrors } = await addProductToCartMutation({
            variables: {
                cartId,
                cartItems: [{ data: { quantity, sku: product.sku } }],
            },
        });

        if (addProductErrors?.length) {
            setNotifications([{ type: "error", message: addProductErrors[0].message }]);
        } else {
            setNotifications([{ type: "success", message: t("product.added_to_cart") }]);
        }
    };

    const handleAddToCompare = async (product) => {
        const { data: compareResponse, errors } = await addProductToCompare({
            variables: { input: [product.id] },
        });

        if (compareResponse?.createCompareList) {
            setNotifications([{ type: "success", message: t("product.added_to_compare") }]);
        } else if (errors?.length) {
            setNotifications([{ type: "error", message: t("something_went_wrong") }]);
        }
    };

    const handleAddToWishlist = async (formData) => {
        let wishlistId = formData.wishlist;

        if (formData.newWishlist) {
            const { data: createWishlistResponse } = await createWishlistMutation({
                variables: { input: { name: formData.wishlist } },
            });

            if (!createWishlistResponse?.createWishlist.success) {
                setNotifications([{ type: "error", message: t("something_went_wrong") }]);
                return;
            }
            wishlistId = createWishlistResponse.createWishlist.wishlist.wishlist_id;
        }

        const { errors: addProductToWishlistErrors } = await addProductToWishlistMutation({
            variables: {
                input: {
                    wishlist_id: wishlistId,
                    product_id: productToAddToWishlist.id,
                    qty: 1,
                },
            },
        });

        if (addProductToWishlistErrors?.length) {
            setNotifications([{ type: "error", message: addProductToWishlistErrors[0].message }]);
        } else {
            setNotifications([{ type: "success", message: t("product.added_to_wishlist") }]);
        }

        setProductToAddToWishlist(null);
        setValue("newWishlist", false);
        setValue("wishlist", "");
    };

    const columnsBefore = [
        {
            label: "Product Title",
            labelClassName: "w-62 md:w-72",
            cellClassName: "",
            property: "name",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (product) => <ProductTitleTemplate product={product} />,
        },
        {
            label: "Workpiece",
            labelClassName: "",
            cellClassName: "",
            property: "grade",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (product) => (
                <ProductGrades gradeClass={product?.grade_class} showLetter={false} className={"pb-0"} />
            ),
        },
    ];

    const configurableColumns = columns
        .filter((column) => !EXCLUDED_COLUMNS.includes(column.attribute_code))
        .map((column) => ({
            label: column.label,
            property: column.attribute_code,
            renderCell: (product) => product?.[column.attribute_code],
            labelClassName: "",
            cellClassName: "",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
        }));

    const shownConfigurableColumns = configurableColumns.filter((column) => selectedColumns.includes(column.property));

    const columnsAfter = [
        {
            label: "Stock",
            labelClassName: "",
            cellClassName: "",
            property: "stock",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (product) => (product?.stock_status ? 90 : 0),
        },
        {
            label: "Price",
            labelClassName: "",
            cellClassName: "",
            property: "price",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (product) => <ProductPriceTemplate product={product} />,
        },
        {
            label: "Qty",
            labelClassName: "",
            cellClassName: "",
            property: "quantity",
            sortable: false,
            visibleWhenMobile: false,
            collapsedWhenMobile: false,
            renderCell: (product, quantity, setQuantity) => (
                <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    className="w-20 h-12"
                    inputClassName="text-sm md:text-sm font-medium"
                    buttonClassName="text-base font-semibold"
                />
            ),
        },
        {
            label: "Actions",
            labelClassName: "absolute right-25 lg:static",
            cellClassName: "ml-auto",
            property: "actions",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (product, quantity, setQuantity) => (
                <ProductActionsTemplate
                    product={product}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    addToComparedProducts={handleAddToCompare}
                    addToWishlist={setProductToAddToWishlist}
                    addToCart={handleAddToCart}
                    canAddToCart={canAddToCart}
                    isLoggedIn={isLoggedIn}
                />
            ),
        },
    ];

    useEffect(() => {
        setSelectedSubcategory(ALL_SUBCATEGORIES_ID);
        setSelectedFilters({});
        setSearch("");
        setSortBy(DEFAULT_SORT_BY);
        setCurrentPage(1);
        setItemsPerPage(DEFAULT_ITEMS_PER_PAGE);
        setProductToAddToWishlist(null);
        setValue("newWishlist", false);
        setValue("wishlist", "");
    }, [urlPath, skus, setValue]);

    useEffect(() => {
        debouncedSetSearch(debouncedSearch);
    }, [debouncedSearch, debouncedSetSearch]);

    return (
        <div className={title ? "mt-6" : ""}>
            {title && <div className="font-medium items-center text-sm md:text-2xl">{title}</div>}

            <RenderNotifications containerClassName="mt-4 sticky top-34 md:top-23 z-1000" />

            {subcategoriesCount > 0 && (
                <SubcategorySelector
                    title={!skus}
                    subcategories={mappedSubcategories}
                    selected={selectedSubcategory}
                    setSelected={setSelectedSubcategory}
                    className="w-118 sm:w-full"
                />
            )}

            <FiltersCard
                filters={mappedAttributes}
                loading={filtersLoading}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                filteredProductsTotal={totalProducts}
                className="w-118"
            />

            <div className="container flex flex-col gap-6 lg:flex-row justify-between items-center w-118 sm:w-full pt-4">
                <Input
                    type="search"
                    placeholder={t("product.search_products")}
                    value={debouncedSearch}
                    onChange={setDebouncedSearch}
                    className="w-full lg:w-120 h-10 lg:h-14 mt-0"
                    inputClassName="w-full lg:w-120 h-10 lg:h-14"
                    relativeContainerClassName="w-full lg:w-120 h-10 lg:h-14"
                />
                <ColumnsSettings
                    columns={configurableColumns}
                    selectedColumns={selectedColumns}
                    setSelectedColumns={setSelectedColumns}
                />
            </div>

            {productsLoading ? (
                <div className="text-center py-10">
                    <div className="w-full h-15 lg:h-20 flex justify-center items-center">
                        <Spinner className={"w-15 h-15 lg:w-20 lg:h-20"} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="hidden lg:flex container">
                        <Table
                            items={products}
                            columns={columnsBefore}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            loading={productsLoading}
                            className="mt-6"
                            rowsClassName="h-27"
                        />
                        <CustomScrollbar
                            containerRef={scrollRef}
                            columns={shownConfigurableColumns}
                            options={{
                                enabled: true,
                                thumbColor:
                                    "linear-gradient(111.43deg, #221E77 0.76%, #4B2BAB 58.63%, #3F38DD 113.26%)",
                                trackColor: "rgba(0,0,0,0.1)",
                                height: 8,
                                topOffset: 8,
                                sideOffset: 10,
                            }}
                        >
                            <Table
                                items={products}
                                columns={shownConfigurableColumns}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                loading={productsLoading}
                                className="mt-6"
                                rowsClassName="h-27"
                            />
                        </CustomScrollbar>
                        <Table
                            items={products}
                            columns={columnsAfter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            loading={productsLoading}
                            className="mt-6"
                            rowsClassName="h-27"
                        />
                    </div>

                    <Table
                        items={products}
                        columns={[...columnsBefore, ...shownConfigurableColumns, ...columnsAfter]}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        loading={productsLoading}
                        className="w-118 mt-6 lg:hidden"
                    />
                </>
            )}

            {totalProducts > 0 && (
                <TablePagination
                    currentPage={pageInfo?.current_page}
                    totalPages={pageInfo?.totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    className="w-118 mt-6"
                />
            )}

            <Modal
                show={productToAddToWishlist !== null}
                onConfirmText={t("general.yes")}
                onConfirm={handleSubmit(handleAddToWishlist)}
                onCancelText={t("general.no")}
                onClose={() => {
                    setProductToAddToWishlist(null);
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
                        options={wishlistsData?.customerWishlists?.items?.map((wishlist) => ({
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
        </div>
    );
}

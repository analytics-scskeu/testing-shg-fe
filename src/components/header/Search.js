"use client";

import { useLazyQuery } from "@apollo/client";
import { useRef, useState } from "react";
import { SEARCH_NEWS, SEARCH_PRODUCTS } from "@/api/queries/search";
import useClickOutside from "@/hooks/useClickOutside";
import { Input } from "@/components/form";
import SearchResultSection from "./search/SearchResultSection";
import { useTranslations } from "next-intl";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchProducts, { data: productsData, loading: productsLoading }] = useLazyQuery(SEARCH_PRODUCTS);
    const [searchNews, { data: newsData, loading: newsLoading }] = useLazyQuery(SEARCH_NEWS);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useClickOutside(wrapperRef, () => setOpen(false));
    const handleChange = (value) => {
        setSearchTerm(value);
        if (value.length >= 2) {
            searchProducts({ variables: { search: value } });
            searchNews({ variables: { search: value } });
            if (!open) setOpen(true);
        }
    };
    const t = useTranslations();
    return (
        <>
            <div className="relative w-full z-50" ref={wrapperRef}>
                <Input
                    type="search"
                    placeholder={t("general.search")}
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => {
                        setOpen(true);
                    }}
                    className="mt-0 max-md:mb-2"
                    inputClassName="bg-white shadow-none py-2.5 font-normal"
                />
                <div className="absolute top-full left-0 right-0 z-50 bg-white shadow">
                    {open && searchTerm.length >= 2 && (
                        <div className="p-4 overflow-y-scroll overflow-x-hidden max-h-[90vh]">
                            <SearchResultSection
                                title="Products"
                                items={productsData?.products?.items}
                                viewAllLink=""
                                type="product"
                            />
                            <SearchResultSection
                                title="News"
                                items={newsData?.sumitomoBlogPosts?.items}
                                viewAllLink=""
                                type="news"
                            />
                            {/*<SearchResultSection
                            title="Brochures"
                            items={data?.products?.items}
                            viewAllLink="/brochures"
                            type="brochure"
                        />
                        <SearchResultSection
                            title="Videos"
                            items={data?.products?.items}
                            viewAllLink="/videos"
                            type="video"
                        /> */}

                            {open &&
                                !productsLoading &&
                                !newsLoading &&
                                productsData?.products?.items?.length === 0 &&
                                newsData?.blogPosts?.items?.length ===
                                <div className="text-sm text-gray-500">No results found.</div>}
                        </div>
                    )}
                </div>
            </div>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}

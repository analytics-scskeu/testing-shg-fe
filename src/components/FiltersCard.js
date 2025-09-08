import React, { useCallback, useMemo, useState } from "react";
import Select from "./form/Select";
import { twMerge } from "tailwind-merge";
import MultiSelect from "./form/MultiSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { Spinner } from "./icons";
import { Button, DatePicker, Input } from "./form";
import { useHandleResize } from "@/hooks";

const BREAKPOINT_ITEMS_PER_ROW = {
    xxl: 5,
    xl: 4,
    lg: 3,
    md: 2,
};

export default function FiltersCard({
    filters,
    loading,
    selectedFilters,
    setSelectedFilters,
    filteredProductsTotal,
    className,
    showHeader = true,
    showTotals = true,
    defaultDropdownOpen = false,
}) {
    const t = useTranslations();

    const [dropdownIsOpen, setDropdownIsOpen] = useState(defaultDropdownOpen);
    const [isExpanded, setIsExpanded] = useState(false);
    const [itemsPerCurrentRow, setItemsPerCurrentRow] = useState(filters?.length);

    const filtersApplied = Object.keys(selectedFilters).length;

    const classes = twMerge(
        `flex flex-col items-center justify-center sm:w-full my-4 p-4 lg:p-8 bg-white shadow-xl`,
        className
    );

    const handleFilterChange = useCallback(
        (filterId, value) => {
            setSelectedFilters((prevFilters) => {
                const updatedFilters = { ...prevFilters };

                const isValueEmpty =
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    (Array.isArray(value) && value.length === 0);

                if (isValueEmpty) {
                    delete updatedFilters[filterId];
                } else {
                    updatedFilters[filterId] = value;
                }
                return updatedFilters;
            });
        },
        [setSelectedFilters]
    );

    useHandleResize(() => {
        const screenWidth = window.innerWidth;

        if (screenWidth >= 1536) {
            setItemsPerCurrentRow(BREAKPOINT_ITEMS_PER_ROW["xxl"]);
        } else if (screenWidth >= 1280) {
            setItemsPerCurrentRow(BREAKPOINT_ITEMS_PER_ROW["xl"]);
        } else if (screenWidth >= 1024) {
            setItemsPerCurrentRow(BREAKPOINT_ITEMS_PER_ROW["lg"]);
        } else if (screenWidth >= 768) {
            setItemsPerCurrentRow(BREAKPOINT_ITEMS_PER_ROW["md"]);
        } else {
            setItemsPerCurrentRow(filters.length);
        }
    });

    const numberOfVisibleFilters = itemsPerCurrentRow * 2;
    const hasMoreFilters = filters && filters.length > numberOfVisibleFilters;

    const filtersToDisplay = useMemo(
        () => (isExpanded || !hasMoreFilters ? filters : filters?.slice(0, numberOfVisibleFilters)),
        [isExpanded, hasMoreFilters, filters, numberOfVisibleFilters]
    );

    const renderFilterInput = useCallback(
        (filter, index) => {
            const currentValue = selectedFilters?.[filter.id] || "";
            const commonProps = {
                value: currentValue,
                onChange: (value) => handleFilterChange(filter.id, value),
                options: filter.options,
                showClear: true,
                placeholder: filter.label,
                className: "w-full h-10 md:h-12 mt-0 font-normal",
            };

            switch (filter.type) {
                case "PRICE":
                case "SELECT":
                    return <Select key={index} {...commonProps} />;
                case "MULTISELECT":
                    return <MultiSelect key={index} {...commonProps} />;
                case "DATE":
                    return <DatePicker key={index} {...commonProps} />;
                case "TEXT":
                    return <Input key={index} type={filter.type} {...commonProps} />;
                default:
                    return null;
            }
        },
        [selectedFilters, handleFilterChange]
    );

    return (
        <div className={classes}>
            {showHeader && (
                <div className="flex justify-between mt-2 md:mt-4 md:pb-6 w-full md:border-b md:border-shade1/16 ">
                    <div className="flex items-center gap-1">
                        <div className="font-medium text-sm md:text-2xl">{t("filters.title")}</div>
                        {showTotals && (
                            <div className="text-sm font-normal mr-1">
                                ({filteredProductsTotal} {t("filters.number_of_products")})
                            </div>
                        )}
                        <div className="flex md:hidden items-center justify-center h-4 w-4 bg-link rounded-full text-white text-[10px] font-medium">
                            {filtersApplied}
                        </div>
                    </div>
                    <div
                        className="flex items-center md:hidden cursor-pointer"
                        onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                    >
                        <FontAwesomeIcon icon={dropdownIsOpen ? faChevronUp : faChevronDown} />
                    </div>
                </div>
            )}

            <div
                className={`grid gap-4 md:gap-6 mt-4 w-full ${
                    dropdownIsOpen ? "grid-cols-1" : "hidden md:grid"
                } md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`}
            >
                {loading ? (
                    <div className="w-full h-15 lg:h-20 flex justify-center items-center">
                        <Spinner className={"w-15 h-15 lg:w-20 lg:h-20"} />
                    </div>
                ) : (
                    filtersToDisplay?.map(renderFilterInput)
                )}

                {!loading && hasMoreFilters && (
                    <div className="w-full hidden md:flex justify-center mt-4 col-span-full">
                        <Button
                            styling="clean"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 text-link font-medium"
                        >
                            {isExpanded ? t("filters.show_less") : t("filters.show_more")}
                            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

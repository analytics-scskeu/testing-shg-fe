import React, { useMemo } from "react";
import HeaderTemplate from "./HeaderTemplate";
import { Checkbox } from "@/components/form";
import ItemTemplate from "./ItemTemplate";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@/components/icons";

export default function Table({
    items,
    columns,
    sortBy,
    setSortBy,
    checkbox = false,
    checkedItems,
    setCheckedItems,
    rowKey = "id",
    noItems = "No items found",
    showHeaderOnMobile = false,
    loading,
    className,
    rowsClassName,
}) {
    const classes = twMerge(`container sm:w-full`, className);
    const rowsClasses = twMerge("", rowsClassName);

    const tableColumns = useMemo(() => {
        if (!checkbox) {
            return columns;
        }

        const allItemsSelected = items?.length > 0 && checkedItems?.length === items.length;

        const checkboxColumn = {
            label: (
                <Checkbox
                    name="select_all"
                    labelClassName="font-medium text-shade1"
                    value={allItemsSelected}
                    onChange={() => {
                        setCheckedItems(allItemsSelected ? [] : items.map((item) => item[rowKey]));
                    }}
                />
            ),
            property: "checkbox_header",
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            sortable: false,
            renderCell: (item) => (
                <Checkbox
                    name={`select_${item?.[rowKey]}`}
                    value={checkedItems?.includes(item?.[rowKey])}
                    labelClassName="font-medium text-shade1"
                    onChange={() => {
                        setCheckedItems((prevCheckedItems) => {
                            if (prevCheckedItems.includes(item?.[rowKey])) {
                                return prevCheckedItems.filter((id) => id !== item?.[rowKey]);
                            } else {
                                return [...prevCheckedItems, item?.[rowKey]];
                            }
                        });
                    }}
                />
            ),
        };

        return [checkboxColumn, ...columns];
    }, [checkbox, items, checkedItems, columns, setCheckedItems, rowKey]);

    const headerRowContent = useMemo(() => {
        return tableColumns.map((column, index) => (
            <HeaderTemplate
                key={column.property || column.label || `header-${index}`}
                className={twMerge(
                    column.visibleWhenMobile && !column.collapsedWhenMobile ? "" : "hidden lg:table-cell",
                    column.labelClassName
                )}
                label={column.label}
                property={column.property}
                sortable={column.sortable}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isCentered={(checkbox && index === 0) || column.labelCentered}
            />
        ));
    }, [tableColumns, sortBy, setSortBy, checkbox]);

    const tableRows = useMemo(() => {
        if (loading) {
            return (
                <tr className={rowsClasses}>
                    <td colSpan={tableColumns.length} className="text-center py-10">
                        <div className="w-full h-15 lg:h-20 flex justify-center items-center">
                            <Spinner className={"w-15 h-15 lg:w-20 lg:h-20"} />
                        </div>
                    </td>
                </tr>
            );
        }

        if (items?.length === 0 && noItems) {
            return (
                <tr className={rowsClasses}>
                    <td colSpan={tableColumns.length} className="text-center">
                        <div className="flex justify-center items-center p-5">{noItems}</div>
                    </td>
                </tr>
            );
        }

        if (!items || items.length === 0) {
            return null;
        }

        return items?.map((item) => (
            <ItemTemplate
                key={item?.[rowKey]}
                item={item}
                columns={tableColumns}
                renderCheckboxColumn={checkbox}
                className={rowsClasses}
            />
        ));
    }, [items, rowKey, tableColumns, checkbox, noItems, rowsClasses, loading]);

    if (!items) {
        return null;
    }

    return (
        <div className={classes}>
            <table className="w-full">
                <thead
                    className={`h-12 flex lg:table-header-group bg-gray-shade3 ${!showHeaderOnMobile ? "hidden" : ""}`}
                >
                    <tr className="flex w-full justify-start align-middle items-center relative lg:table-row text-xs font-medium text-left whitespace-nowrap px-4 [&>th]:px-1 lg:[&>th]:px-1 xl:[&>th]:px-3 2xl:[&>th]:px-6">
                        <th className="lg:hidden w-6 flex items-center -order-99" />
                        {headerRowContent}
                    </tr>
                </thead>

                <tbody>{tableRows}</tbody>
            </table>
        </div>
    );
}

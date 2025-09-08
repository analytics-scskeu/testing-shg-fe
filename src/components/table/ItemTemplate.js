import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ItemTemplate({ item, columns, className }) {
    const [quantity, setQuantity] = useState(1);
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

    const notCollapsedWhenMobileColumns = columns.filter((column) => !column.collapsedWhenMobile);
    const hasCollapsedColumns = columns.some((column) => column.collapsedWhenMobile);

    const rowClasses = twMerge(
        "flex flex-wrap mx-auto px-4 lg:table-row text-sm font-medium sm:w-full [&>td]:px-1 lg:[&>td]:px-1 xl:[&>td]:px-3 2xl:[&>td]:px-6 [&>*]:py-4 last:border-0 border-b-1 border-shade1/16",
        className
    );

    return (
        <tr className={rowClasses} key={item?.sku}>
            {hasCollapsedColumns ? (
                <td
                    className="flex items-center lg:hidden -order-99 cursor-pointer"
                    onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                >
                    <FontAwesomeIcon icon={dropdownIsOpen ? faChevronUp : faChevronDown} />
                </td>
            ) : null}

            {columns.map((column, index) => {
                const isNotCollapsed = !column.collapsedWhenMobile;
                let orderClass = "";
                let cellClass = twMerge("", column.cellClassName);

                if (isNotCollapsed) {
                    const orderIndex = notCollapsedWhenMobileColumns.indexOf(column);
                    if (orderIndex !== -1) {
                        orderClass = `-order-${notCollapsedWhenMobileColumns.length - orderIndex}`;
                    }
                }
                return column.visibleWhenMobile ? (
                    column.collapsedWhenMobile ? (
                        <td
                            key={index}
                            className={`w-full lg:w-auto ${
                                !dropdownIsOpen
                                    ? "hidden lg:table-cell"
                                    : "flex justify-between items-center lg:table-cell"
                            }
                            ${cellClass}
                            `}
                        >
                            <span className="font-medium lg:hidden">{column.label}</span>
                            {column.renderCell(item, quantity, setQuantity)}
                        </td>
                    ) : (
                        <td
                            key={index}
                            className={`flex justify-between items-center lg:table-cell ${cellClass} ${orderClass}`}
                        >
                            {column.renderCell(item, quantity, setQuantity)}
                        </td>
                    )
                ) : (
                    <td key={index} className={`hidden lg:table-cell ${cellClass}`}>
                        {column.renderCell(item, quantity, setQuantity)}
                    </td>
                );
            })}
        </tr>
    );
}

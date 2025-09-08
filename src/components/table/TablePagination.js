import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Select } from "@/components/form";

export default function TablePagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSiblingsCount = 1,
    className = "",
    itemsPerPage,
    itemsPerPageOptions = [10, 20, 50, 100],
    onItemsPerPageChange,
}) {
    const classes = twMerge("flex flex-col md:flex-row justify-center items-center gap-4 sm:w-full", className);

    const paginationRange = useMemo(() => {
        const totalPageNumbers = pageSiblingsCount * 2 + 5;

        const leftSiblingIndex = Math.max(currentPage - pageSiblingsCount, 1);
        const rightSiblingIndex = Math.min(currentPage + pageSiblingsCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftRangeLength = 3 + pageSiblingsCount * 2;

            leftRangeLength = Math.min(leftRangeLength, totalPages);

            let leftRange = Array.from({ length: leftRangeLength }, (_, i) => i + 1);
            return [...leftRange, "...", totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightRangeLength = 3 + pageSiblingsCount * 2;

            rightRangeLength = Math.min(rightRangeLength, totalPages);
            let rightRange = Array.from({ length: rightRangeLength }, (_, i) => totalPages - rightRangeLength + i + 1);
            return [1, "...", ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [1, "...", ...middleRange, "...", totalPages];
        }

        return [];
    }, [currentPage, totalPages, pageSiblingsCount]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    if (totalPages <= 1 || paginationRange.length === 0) {
        return null;
    }

    return (
        <nav className={classes}>
            <div className="flex justify-center items-center space-x-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-8 h-8 border font-bold text-sm transition-colors duration-200
                           ${
                               currentPage === 1
                                   ? "border-shade1/10 text-shade1/64 cursor-not-allowed"
                                   : "border-shade1/16 text-shade1 hover:bg-gray-shade4"
                           }`}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
                </button>

                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex items-center justify-center w-8 h-8 text-shade1"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = pageNumber === currentPage;
                    return (
                        <button
                            key={index}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`flex items-center justify-center w-8 h-8 border font-bold text-sm transition-colors duration-200
                                   ${
                                       isActive
                                           ? "bg-primary-shade2/20 border-primary-shade1 text-primary-shade1"
                                           : "bg-white border-shade1/16 text-shade1 hover:bg-gray-shade4"
                                   }`}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-8 h-8 border font-bold text-sm transition-colors duration-200
                    ${
                        currentPage === totalPages
                            ? "border-shade1/10 text-shade1/64 cursor-not-allowed"
                            : "border-shade1/16 text-shade1 hover:bg-gray-shade4"
                    }`}
                >
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
                </button>
            </div>

            {itemsPerPageOptions?.length > 0 && (
                <div className="flex items-center space-x-2 ml-4">
                    <Select
                        name="items-per-page"
                        value={itemsPerPage}
                        options={itemsPerPageOptions.map((option) => ({
                            value: option,
                            label: option,
                        }))}
                        onChange={onItemsPerPageChange}
                        className="w-27 h-10 px-0"
                        labelClassName="hidden"
                        showClear={false}
                    />
                </div>
            )}
        </nav>
    );
}

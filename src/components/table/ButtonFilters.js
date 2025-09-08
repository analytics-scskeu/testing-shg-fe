"use client";

import { Button } from "@/components/form";
import FiltersCard from "@/components/FiltersCard";
import { useEffect, useState } from "react";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    offset,
    shift,
    useClick,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { twMerge } from "tailwind-merge";
import { useHandleResize } from "@/hooks";
import { useTranslations } from "next-intl";
import { SvgIcon } from "@/components/icons";
import { FilterIcon } from "@/resources/images/icons";

export default function ButtonFilters({
    filters,
    selectedFilters,
    setSelectedFilters,
    containerClassName,
    buttonClassName,
    filtersClassName,
}) {
    const t = useTranslations();

    const [preparedFilters, setPreparedFilters] = useState(selectedFilters);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useHandleResize(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 1024) {
            setIsOpen(true);
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    });

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "bottom-start",
        middleware: [flip(), offset(15), shift()],
        transform: !isMobile,
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const role = useRole(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, role]);

    const handleClosePopup = () => {
        setPreparedFilters(selectedFilters);
        setIsOpen(false);
    };

    const handleUpdateFilters = () => {
        setSelectedFilters(preparedFilters);
        setIsOpen(false);
    };

    const containerClasses = twMerge(
        `bg-white z-10 lg:shadow-long py-2 w-full lg:w-auto
        ${isMobile ? "relative! top-0! left-0!" : ""}
        ${containerClassName}`
    );

    const buttonClasses = twMerge(
        `hidden lg:block min-w-auto w-14 h-14 p-0!
        ${buttonClassName}`
    );

    const filterClasses = twMerge(
        `md:w-full w-full lg:shadow-none mx-0 mb-0 lg:mb-4
        ${filtersClassName}`
    );

    useEffect(() => {
        if (isMobile) {
            setPreparedFilters(selectedFilters);
        }
    }, [isMobile, selectedFilters]);

    return (
        <>
            <Button styling="secondary" className={buttonClasses} ref={refs.setReference} {...getReferenceProps()}>
                <SvgIcon icon={FilterIcon} width={32} height={32} className="mx-auto" />
            </Button>
            {isOpen && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        className={containerClasses}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        <FiltersCard
                            filters={filters}
                            selectedFilters={isMobile ? selectedFilters : preparedFilters}
                            setSelectedFilters={isMobile ? setSelectedFilters : setPreparedFilters}
                            showHeader={isMobile}
                            showTotals={false}
                            className={filterClasses}
                        />
                        {!isMobile && (
                            <div className="flex gap-4 justify-end mx-8 mb-6">
                                <Button styling="clean" onClick={handleClosePopup}>
                                    {t("general.filters.cancel")}
                                </Button>
                                <Button styling="primary" onClick={handleUpdateFilters}>
                                    {t("general.filters.apply")}
                                </Button>
                            </div>
                        )}
                    </div>
                </FloatingFocusManager>
            )}
        </>
    );
}

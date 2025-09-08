"use client";

import React, { useState } from "react";
import { Button } from "./form";
import { CogwheelIcon } from "@/resources/images/icons";
import { CogwheelWhiteIcon } from "@/resources/images/icons";
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
import { useTranslations } from "next-intl";
import MultiSelect from "./form/MultiSelect";
import { useHandleResize } from "@/hooks";

export default function ColumnsSettings({ columns, selectedColumns, setSelectedColumns }) {
    const t = useTranslations();

    const [selectedOptions, setSelectedOptions] = useState(selectedColumns);

    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: "bottom-end",
        middleware: [flip(), offset(15), shift()],
        transform: !isMobile,
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const role = useRole(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, role]);

    useHandleResize(() => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 1024) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    });

    const handleClosePopup = () => {
        setSelectedColumns(selectedColumns);
        setIsMobile(false);
        setIsOpen(false);
    };

    const handleUpdateColumns = () => {
        setSelectedColumns(selectedOptions);
        setIsOpen(false);
    };

    const containerClasses = twMerge(
        `flex flex-col justify-center align-middle container bg-white z-10 shadow-long py-2 w-140
        ${isMobile ? "relative top-0 left-0" : ""}`
    );
    return (
        <div className="flex lg:block flex-col justify-center align-middle w-full lg:w-auto shadow-xl lg:shadow-none">
            <Button
                styling="secondary"
                className="relative font-bold w-full lg:w-auto cursor-pointer group"
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <CogwheelIcon
                    className="absolute ml-1 top-1/2 -translate-y-1/2 left-2 cursor-pointer transition-opacity duration-200 group-hover:opacity-0"
                    alt="Columns Settings"
                    width={24}
                    height={24}
                />
                <CogwheelWhiteIcon
                    className="absolute ml-1 top-1/2 -translate-y-1/2 left-2 cursor-pointer transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                    alt="Columns Settings"
                    width={24}
                    height={24}
                />
                <div className="ml-6">{t("columnsSettings.title")}</div>
            </Button>
            {isOpen && !isMobile && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        className={containerClasses}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        <div className="bg-white flex justify-center align-middle my-3 font-bold text-2xl text-shade1">
                            {t("columnsSettings.selectColumns")}
                        </div>

                        <div className="flex justify-center align-middle w-full">
                            <MultiSelect
                                value={selectedOptions}
                                onChange={setSelectedOptions}
                                options={columns.map((column) => ({
                                    label: column.label,
                                    value: column.property,
                                }))}
                                showClear
                                searchable
                                maxVisibleTags={2}
                                placeholder={t("columnsSettings.title")}
                                className="w-130 h-10 md:h-12 mt-0 font-normal"
                            />
                        </div>

                        <div className="flex gap-4 justify-end mx-8 mt-3 md:mt-4 mb-1 md:mb-2">
                            <Button styling="clean" onClick={handleClosePopup}>
                                {t("columnsSettings.cancel")}
                            </Button>
                            <Button styling="primary" onClick={handleUpdateColumns}>
                                {t("columnsSettings.apply")}
                            </Button>
                        </div>
                    </div>
                </FloatingFocusManager>
            )}

            {isOpen && isMobile && (
                <div>
                    <div className="bg-white flex justify-center align-middle mt-6 lg:mt-3 mb-3 font-bold text-lg text-shade1">
                        {t("columnsSettings.selectColumns")}
                    </div>

                    <div className="flex justify-center align-middle w-full">
                        <MultiSelect
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            options={columns.map((column) => ({
                                label: column.label,
                                value: column.property,
                            }))}
                            showClear
                            searchable
                            maxVisibleTags={2}
                            placeholder={t("columnsSettings.title")}
                            className="w-full lg:w-110 h-10 md:h-12 lg:mt-0 font-normal"
                            relativeContainerClassName="w-full lg:w-110 h-10 md:h-12 mx-8"
                        />
                    </div>

                    <div className="flex gap-4 justify-end mx-8 mt-7 md:mt-4 mb-4 lg:mb-2">
                        <Button styling="clean" onClick={handleClosePopup}>
                            {t("columnsSettings.cancel")}
                        </Button>
                        <Button styling="primary" onClick={handleUpdateColumns}>
                            {t("columnsSettings.apply")}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

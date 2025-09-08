"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import ArrowIcon from "@/components/icons/ArrowIcon";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

const SliderArrowButton = ({ onClick, extraClassName, isPrev = false, arrowInside = false, ...props }) => {
    const t = useTranslations();

    const classes = twMerge(
        "!text-shade1 block transition-colors hover:!text-primary-shade3 !z-1",
        "[&.slick-disabled]:opacity-50 [&.slick-disabled]:!text-gray-shade1 [&.slick-disabled]:hover:!text-gray-shade1",
        isPrev ? "max-md:!-top-8 max-md:!right-8 max-md:!left-auto" : "max-md:!-top-8 max-md:!right-2",
        arrowInside &&
            `max-md:!top-[50%] !bg-gray-shade2 md:!flex md:!items-center md:!justify-center !w-[35px] !h-[35px]
            ${isPrev ? "md:!left-0 max-md:!left-0" : "md:!right-0 max-md:!right-0"}`,
        props.className || "",
        extraClassName
    );

    return (
        <button
            onClick={onClick}
            className={classes}
            aria-label={isPrev ? t("general.previous_slide") : t("general.next_slide")}
        >
            <ArrowIcon className={`hidden md:block ${isPrev ? "rotate-180" : ""}`} />
            <FontAwesomeIcon
                icon={isPrev ? faChevronLeft : faChevronRight}
                className="text-shade1 !h-3 w-3 md:!hidden"
            />
        </button>
    );
};

export default SliderArrowButton;

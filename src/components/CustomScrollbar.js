import React, { useRef } from "react";
import { useCustomScrollbar } from "@/hooks/useCustomScrollbar";
import { twMerge } from "tailwind-merge";

const CustomScrollbar = ({
    columns,
    className = "",
    options = {
        enabled: true,
        thumbColor: "linear-gradient(111.43deg, #221E77 0.76%, #4B2BAB 58.63%, #3F38DD 113.26%)",
        trackColor: "rgba(0,0,0,0.1)",
        height: 8,
        topOffset: 8,
        sideOffset: 10,
    },
    children,
}) => {
    const scrollRef = useRef(null);

    const { scrollbarRef, thumbRef, isScrollable, scrollbarStyles, thumbStyles } = useCustomScrollbar({
        ...options,
        dependencies: [columns],
        containerRef: scrollRef,
    });

    const classes = twMerge(`custom-scrollbar ${!isScrollable ? "hidden" : ""}`, className);
    const wrapperClasses = twMerge(`w-full bg-white overflow-hidden relative`, !columns.length && "hidden");
    return (
        <div className={wrapperClasses}>
            <div
                ref={scrollRef}
                className="overflow-x-auto overflow-y-hidden"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <div ref={scrollbarRef} className={classes} style={scrollbarStyles}>
                    <div ref={thumbRef} className="custom-scrollbar-thumb" style={thumbStyles} />
                </div>
                {children}
            </div>
        </div>
    );
};

export default CustomScrollbar;

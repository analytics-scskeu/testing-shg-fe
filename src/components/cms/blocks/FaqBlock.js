"use client";

import { useState, createContext } from "react";
import { twMerge } from "tailwind-merge";

export const FaqContext = createContext({
    openIndex: null,
    toggle: () => {},
    parentProps: {},
});

export default function FaqBlock({ children, ...props }) {
    const [openIndex, setOpenIndex] = useState(null);

    const classes = twMerge(
        "lg:max-w-[60%] mx-auto divide-y divide-gray-200 border border-gray-200 rounded-lg",
        props.textAlign === "center" && "text-center",
        props.textAlign === "right" && "text-end"
    );

    return (
        <FaqContext.Provider
            value={{
                openIndex,
                toggle: (index) => {
                    setOpenIndex(openIndex === index ? null : index);
                },
                parentProps: {
                    ...props,
                },
            }}
        >
            <div className={classes}>{children}</div>
        </FaqContext.Provider>
    );
}

"use client";

import { Fragment, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { Link } from "@/i18n/routing";
import { Button } from "./index";
import { twMerge } from "tailwind-merge";

export default function Dropdown({ options = [], text, arrow = false, className, optionClasses }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useClickOutside(() => setOpen(false));

    const classes = twMerge(
        `inline-flex items-center px-2 !py-2 hover:bg-gray-shade5 font-semibold min-w-auto text-black hover:text-black`,
        className
    );

    const renderOptions = (options) => {
        return options.map(({ href, label, onClick, children, disabled }, i) => {
            const listItemClasses = twMerge(
                `block px-4 py-2 ${!disabled && "hover:bg-gray-shade4 cursor-pointer"}`,
                optionClasses
            );

            const listItems =
                href && !disabled ? (
                    <Link href={href} className={listItemClasses}>
                        {label}
                    </Link>
                ) : (
                    <li
                        onClick={() => {
                            if (disabled) return;
                            setOpen(false);
                            onClick && onClick();
                        }}
                        className={listItemClasses}
                    >
                        {label}
                    </li>
                );

            return (
                <Fragment key={i}>
                    {listItems}
                    {children && <div className="ml-6 my-1">{renderOptions(children)}</div>}
                </Fragment>
            );
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button styling="clean" className={classes} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
                {text}

                {arrow && (
                    <svg
                        className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </Button>

            {open && (
                <ul className="absolute right-0 mt-3 w-48 bg-container shadow-md z-20">{renderOptions(options)}</ul>
            )}
        </div>
    );
}

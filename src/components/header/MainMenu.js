"use client";

import React, { useState } from "react";
import TopLevelMenuItem from "./TopLevelMenuItem";
import close from "@/resources/images/icons/close.svg";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import useClickOutside from "@/hooks/useClickOutside";

export default function MainMenu({ menuVisible, setMenuVisible, menu_items }) {
    const [submenuVisible, setSubmenuVisible] = useState(null);
    const [activeSection, setActiveSection] = useState(null);

    // useClickOutside hook
    const navRef = useClickOutside(() => {
        setSubmenuVisible(null);
        setActiveSection(null);
        setMenuVisible(false);
    });

    if (!menu_items || Object.keys(menu_items).length === 0) return null;

    const topLevelMenuItems = Object.values(menu_items);

    return (
        <>
            {menuVisible && (
                <div className="fixed inset-0 bg-black/50 z-10 lg:top-36" onClick={() => setMenuVisible(false)} />
            )}
            <div
                className={`z-20 order-2 sm:order-1 lg:order-2 navigation desktop-nav ${menuVisible ? "block" : "hidden"} lg:flex`}
            >
                <nav ref={navRef} className="desktop-main-nav" aria-label="Main menu">
                    <ul
                        className="max-lg:absolute max-lg:left-0 max-lg:-top-14 max-lg:bg-white max-lg:w-5/6 max-lg:py-6 max-lg:px-4 max-lg:min-h-screen block
                lg:flex justify-start flex-wrap gap-1 2xl:gap-x-4 z-10"
                    >
                        <div className="lg:hidden mb-1 lg:mb-2">
                            <span className="text-lg font-semibold">Menu</span>
                            <Image
                                width="24"
                                height="24"
                                src={close}
                                alt="close"
                                className="right-0 w-5 !h-5 ml-1 absolute top-6 right-3 cursor-pointer text-shade1 hover:text-primary transition-colors duration-200"
                                onClick={() => setMenuVisible(false)}
                            />
                        </div>
                        {topLevelMenuItems.map((menuItem, index) => (
                            <TopLevelMenuItem
                                key={menuItem.name || index}
                                menuItem={menuItem}
                                isActive={submenuVisible === menuItem.name}
                                toggleMenu={() => {
                                    setSubmenuVisible(submenuVisible === menuItem.name ? null : menuItem.name);
                                    setActiveSection(null);
                                    setMenuVisible(submenuVisible === menuItem.name ? false : true);
                                }}
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                            />
                        ))}
                        <div className="lg:hidden mb-2 absolute bottom-2">
                            <Link href="/" className="text-base font-medium">
                                Sign Out
                            </Link>
                        </div>
                    </ul>
                </nav>
            </div>
        </>
    );
}

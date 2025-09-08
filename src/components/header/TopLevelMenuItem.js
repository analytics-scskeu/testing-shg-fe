import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SubmenuRight from "./RightSubmenu";
import SubmenuLeft from "./LeftSubmenu";
import { Link } from "@/i18n/routing";
import { useHandleResize } from "@/hooks";

function MenuButton({ menuItem, isActive, toggleMenu }) {
    return (
        <span className="flex items-center text-md group lg:border-b-4 border-transparent">
            {menuItem.childData && menuItem.childData.length > 0 ? (
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="w-full relative tracking-tight text-base font-medium level-0 py-2 transition-colors duration-200 text-left"
                    title={menuItem.name}
                >
                    {menuItem.name}
                    <span className="lg:ml-2 max-lg:absolute max-lg:right-0">
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`text-shade1 !h-3.5 w-3 transform transition-transform duration-300 max-lg:-rotate-90 ${isActive ? "rotate-180" : "rotate-0"}`}
                        />
                    </span>
                </button>
            ) : (
                <Link
                    href={menuItem.url}
                    className="w-full tracking-tight text-base font-medium level-0 py-2 transition-colors duration-200 text-left"
                    title={menuItem.name}
                >
                    {menuItem.name}
                </Link>
            )}
        </span>
    );
}

function Submenu({ menuItem, isActive, activeSection, setActiveSection, toggleMenu }) {
    const { isDesktop } = useHandleResize();
    if (!menuItem.childData || menuItem.childData.length === 0) return null;

    return (
        <div
            className={`submenu-dropdown absolute w-full left-0 max-lg:top-12 top-full z-10 lg:py-8 shadow-md bg-container ${
                isActive ? "block max-lg:min-h-screen max-lg:bg-white border-t border-shade1/5" : "hidden"
            }`}
        >
            <div className="submenu-container container lg:flex mx-auto lg:px-4">
                <SubmenuLeft
                    menuItem={menuItem}
                    activeSection={activeSection ?? 0}
                    setActiveSection={setActiveSection}
                    toggleMenu={toggleMenu}
                />
                <SubmenuRight
                    menuItem={menuItem}
                    activeSection={isDesktop ? (activeSection ?? 0) : activeSection}
                    setActiveSection={setActiveSection}
                />
            </div>
        </div>
    );
}

export default function TopLevelMenuItem({ menuItem, isActive, toggleMenu, activeSection, setActiveSection }) {
    return (
        <li className={`level-0 ${isActive ? "menu-item-active" : ""}`}>
            <MenuButton menuItem={menuItem} isActive={isActive} toggleMenu={toggleMenu} />
            <Submenu
                menuItem={menuItem}
                isActive={isActive}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                toggleMenu={toggleMenu}
            />
        </li>
    );
}

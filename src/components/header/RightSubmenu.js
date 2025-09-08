import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@/i18n/routing";
import { useState } from "react";

export default function SubmenuRight({ menuItem, activeSection, setActiveSection }) {
    const [expandedKey, setExpandedKey] = useState(null);

    if (
        typeof activeSection !== "number" ||
        !menuItem.childData[activeSection] ||
        !menuItem.childData[activeSection].isSectionHeader
    )
        return null;

    const section = menuItem.childData[activeSection];

    const toggleExpand = (key) => {
        setExpandedKey(expandedKey === key ? null : key);
    };

    return (
        <div className="col-span-3 pl-4 lg:pl-10 pt-4 pb-10 right-side-content max-lg:absolute max-lg:w-full max-lg:left-0 max-lg:bg-white max-lg:absolute max-lg:top-0 max-lg:h-full max-lg:pr-4 max-lg:min-h-max">
            <h3 className="text-base font-medium mb-3 lg:hidden" onClick={() => setActiveSection(null)}>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="lg:!hidden text-shade1 w-2 transition-transform duration-300 mr-3"
                />
                {section.name}
            </h3>
            <div className="right-items-wrapper lg:grid grid-cols-6 gap-6">
                {(section.subItems || []).map((column, colIndex) => (
                    <div key={column.name || colIndex} className="menu-column">
                        {column.isColumn && column.subItems ? (
                            column.subItems.map((item, itemIndex) => {
                                const key = `${colIndex}-${itemIndex}`;
                                return (
                                    <div key={item.name || itemIndex} className="menu-item mb-3">
                                        <Link
                                            href={item.url}
                                            title={item.name}
                                            className="block w-full py-1 mb-3 lg:font-medium text-sm hover:text-primary cursor-pointer flex justify-between items-center"
                                            onClick={(e) => {
                                                if (
                                                    window.innerWidth < 1024 &&
                                                    item.hasSubItems &&
                                                    item.subSubItems.length > 0
                                                ) {
                                                    e.preventDefault();
                                                    toggleExpand(key);
                                                }
                                            }}
                                        >
                                            {item.name}
                                            {item.subSubItems?.length > 0 && (
                                                <FontAwesomeIcon
                                                    icon={faChevronRight}
                                                    className={`lg:!hidden text-shade1 w-2 transition-transform duration-300 ${
                                                        expandedKey === key ? "rotate-90" : "rotate-0"
                                                    }`}
                                                />
                                            )}
                                        </Link>
                                        {item.hasSubItems && item.subSubItems?.length > 0 && (
                                            <ul
                                                className={`lg:pt-1 pb-3 overflow-hidden transition-[max-height] duration-300 ease-in-out max-lg:${
                                                    expandedKey === key
                                                        ? "block absolute w-full h-full bg-white top-4 left-0 pl-4 z-1"
                                                        : "hidden"
                                                } lg:max-h-full lg:block`}
                                            >
                                                <h4
                                                    className="text-base font-medium mb-3 lg:hidden"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleExpand(key);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faChevronLeft}
                                                        className="lg:!hidden text-shade1 w-2 transition-transform duration-300 mr-3"
                                                    />
                                                    {item.name}
                                                </h4>
                                                {item.subSubItems.map((subItem, subSubIndex) => (
                                                    <li key={subItem.name || subSubIndex} className="mb-2 pt-1">
                                                        <Link
                                                            href={subItem.url}
                                                            title={subItem.name}
                                                            className="block w-full text-sm lg:text-xs font-normal hover:text-primary mb-4 lg:mb-3"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })
                        ) : column.subSubItems?.length > 0 ? (
                            <div className="menu-item mb-3">
                                <span className="block w-full py-1 mb-3 lg:font-medium text-sm">{column.name}</span>
                                <ul className="pt-1 pb-3 max-lg:hidden">
                                    {column.subSubItems.map((subItem, subSubIndex) => (
                                        <li key={subItem.name || subSubIndex} className="mb-2 lg:pt-1">
                                            <Link
                                                href={subItem.url}
                                                title={subItem.name}
                                                className="block w-full text-sm lg:text-xs font-normal hover:text-primary mb-4 lg:mb-3"
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

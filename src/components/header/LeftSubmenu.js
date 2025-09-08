import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/i18n/routing";

export default function SubmenuLeft({ menuItem, activeSection, setActiveSection, toggleMenu }) {
    return (
        <div className="col-span-1 left-side-content">
            <div className="left-side-content-inner bg-white py-4 lg:py-6 min-w-[230px]">
                <h3
                    className="text-base font-medium lg:text-lg lg:font-bold px-4 lg:px-6 "
                    onClick={() => {
                        setActiveSection(null);
                        toggleMenu();
                    }}
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="lg:!hidden text-shade1 w-2 transition-transform duration-300 mr-3"
                    />
                    {menuItem.name}
                </h3>
                <ul>
                    {menuItem.childData.map((childItem, index) => (
                        <li key={childItem.name || index} className="level-1">
                            {childItem.isSectionHeader ? (
                                <button
                                    type="button"
                                    onClick={() => setActiveSection(activeSection === index ? 0 : index)}
                                    className={`flex justify-between items-center w-full py-2 px-6 mt-2 lg:mt-4 text-left text-sm lg:font-medium hover:text-primary max-lg:px-4 ${
                                        activeSection === index ? "submenu-item-active bg-gray-shade3" : ""
                                    }`}
                                >
                                    <span>{childItem.name}</span>
                                    {childItem.subItems?.length > 0 && (
                                        <FontAwesomeIcon icon={faChevronRight} className="text-shade1 w-2" />
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={childItem.url}
                                    className="flex justify-between items-center w-full py-2 px-4 lg:px-6 mt-3 lg:mt-4 text-left text-sm lg:font-medium hover:text-primary"
                                    title={childItem.name}
                                >
                                    <span>{childItem.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

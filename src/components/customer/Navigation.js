"use client";

import { Link } from "./navigation/index";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useHandleResize } from "@/hooks";

export default function Navigation() {
    const { isGuest } = useSelector(selectorUser);

    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const arrowsRef = useRef(null);
    const user = useSelector(selectorUser);
    const canViewPrice = user.permissions.includes("view_price");

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const t = useTranslations();

    const checkScrollPosition = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    const checkPageMargins = () => {
        const parent = containerRef.current?.parentElement.firstElementChild;

        if (!parent?.offsetLeft) {
            const computedStyles = getComputedStyle(parent);
            applyStyles({
                paddingLeft: parseFloat(computedStyles.paddingLeft),
                paddingRight: parseFloat(computedStyles.paddingRight),
            });
            return;
        }
        const computedStyles = getComputedStyle(parent);

        applyStyles(parseFloat(computedStyles.marginLeft) + parseFloat(computedStyles.paddingLeft));
    };

    const applyStyles = (padding) => {
        Object.assign(scrollRef.current.style, {
            paddingLeft: `${padding}px`,
            paddingRight: `${padding}px`,
        });
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    useHandleResize(() => {
        checkPageMargins();
        checkScrollPosition();
    });

    return (
        <div
            className={`block relative account-nav h-8 md:h-10 filter-option mb-6 ${!scrollRef.current?.style.paddingLeft && "container mx-auto px-4 lg:px-6"}`}
            ref={containerRef}
        >
            <div className="relative container mx-auto w-full">
                <div
                    className="absolute right-0 -mt-6 lg:-mt-8 -translate-y-full h-7 md:h-9 flex items-center gap-4 px-4 lg:px-6"
                    ref={arrowsRef}
                >
                    {(canScrollLeft || canScrollRight) && (
                        <>
                            <div
                                className={`w-6 h-6 cursor-pointer grid items-center ${!canScrollLeft && "opacity-25"}`}
                                onClick={scrollLeft}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} width={24} height={24} />
                            </div>
                            <div
                                className={`w-6 h-6 cursor-pointer grid items-center ${!canScrollRight && "opacity-25"}`}
                                onClick={scrollRight}
                            >
                                <FontAwesomeIcon icon={faChevronRight} width={24} height={24} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="content account-nav-content w-full" id="account-nav">
                <ul
                    ref={scrollRef}
                    onScroll={checkScrollPosition}
                    className="flex overflow-x-auto no-scrollbar gap-4 font-medium w-full absolute"
                >
                    <li>
                        <Link path="/customer/dashboard" text={t("customer.navigation.dashboard")} />
                    </li>
                    <li>
                        <Link path="/customer/account/edit" text={t("customer.navigation.info")} />
                    </li>
                    {!isGuest && (
                        <li>
                            <Link path="/customer/company/index" text={t("customer.navigation.company")} />
                        </li>
                    )}
                    {!isGuest && (
                        <li>
                            <Link path="/customer/company/addresses" text={t("customer.navigation.addresses")} />
                        </li>
                    )}
                    {!isGuest && (
                        <li>
                            <Link path="/customer/orders/downloads" text={t("customer.navigation.downloads")} />
                        </li>
                    )}
                    {!isGuest && canViewPrice && (
                        <li>
                            <Link path="/customer/orders/index" text={t("customer.navigation.orders")} />
                        </li>
                    )}
                    {!isGuest && canViewPrice && (
                        <li>
                            <Link path="/customer/orders/quick" text={t("customer.navigation.quick_order")} />
                        </li>
                    )}
                    {!isGuest && (
                        <li>
                            <Link path="/customer/orders/upload" text={t("customer.navigation.upload_order")} />
                        </li>
                    )}
                    <li>
                        <Link path="/customer/lists" text={t("customer.navigation.lists")} />
                    </li>
                </ul>
            </div>
        </div>
    );
}

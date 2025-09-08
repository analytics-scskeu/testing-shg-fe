"use client";

import { Link } from "@/i18n/routing";
import MainMenu from "@/components/header/MainMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Button, Dropdown } from "@/components/form";
import Heart from "@/components/icons/Heart";
import { useSelector } from "react-redux";
import accountIcon from "@/resources/images/icons/account.svg";
import Image from "next/image";
import { selectorUser } from "@/store/user";
import { useSession } from "@/hooks";
import { selectorStoreConfig } from "@/store/config";
import { useTranslations } from "next-intl";
import Search from "@/components/header/Search";
import LocalSwitcher from "@/components/header/switcher/LocalSwitcher";
import Minicart from "@/components/header/Minicart";
import { useSuspenseQuery } from "@apollo/client";
import { GET_CMS_BLOCK } from "@/api/queries/cmsBlock";
import { escapeHTML } from "@/utils/helper";

export default function Header({ menu_items }) {
    const storeConfig = useSelector(selectorStoreConfig);
    const [menuVisible, setMenuVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { logout } = useSession();
    const user = useSelector(selectorUser);

    const t = useTranslations();

    const { data: cmsBlocks } = useSuspenseQuery(GET_CMS_BLOCK, {
        variables: { identifier: "top_left_ribbon" },
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const userMenuOptions = [
        { href: "/customer/dashboard", label: t("general.my_account") },
        { href: "/customer/lists", label: t("general.my_lists") },
        { href: "/customer/orders/index", label: t("general.my_orders") },
        { href: "/customer/company/addresses", label: t("general.address_book") },
        {
            onClick: logout,
            label: t("general.sign_out"),
        },
    ];

    return (
        <header className="z-10 contents">
            <div className="page-header bg-white">
                <div className="header-panel-inner max-md:px-4 px-6 flex items-center justify-between mx-auto py-2 2xl:container">
                    <div className="header-panel-inner-ribbon">
                        <div className="header-panel-inner-ribbon-content">
                            <div
                                className="text-[10px] md:text-sm font-medium"
                                dangerouslySetInnerHTML={{
                                    __html: escapeHTML(cmsBlocks?.cmsBlocks?.items[0]?.content),
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="header-panel-inner-contact max-md:hidden">
                            <Link
                                href="/contact"
                                className="text-sm font-medium inline-block align-middle hover:text-primary"
                            >
                                {t("general.contact_us")}
                            </Link>
                        </div>
                        <LocalSwitcher />
                    </div>
                </div>
            </div>
            <div
                id="header"
                className={`sticky top-0 z-10 w-full bg-container bg-gradient-to-b md:bg-none from-[#FBFBFB] from-47% to-white to-47% transition-all duration-100 !border-shade1/10
                ${scrolled ? "border-b shadow-lg bg-white z-30" : ""}`}
            >
                <div className="header-container-div 2xl:container mx-auto flex flex-wrap lg:flex-nowrap gap-4 gap-y-5 xl:gap-8 items-center justify-between w-full px-4 md:px-6 mx-auto py-2 md:py-3 m-0">
                    <div className="lg:hidden">
                        <FontAwesomeIcon
                            icon={faBars}
                            className="text-shade1 w-5 lg:!hidden text-xl"
                            onClick={() => setMenuVisible(true)}
                        />
                    </div>
                    <div className="order-1 md:pb-2 w-auto sm:pb-0">
                        <Link
                            id="logo"
                            className="flex items-center justify-center text-xl font-medium tracking-wide text-gray-800
            no-underline hover:no-underline font-title"
                            href={"/"}
                            aria-label="Home"
                        >
                            <Image
                                priority
                                src={`${storeConfig?.base_media_url}logo/${storeConfig?.header_logo_src}`}
                                alt="Logo"
                                width={storeConfig?.logo_width || 174}
                                height={storeConfig?.logo_height || 56}
                                loading="eager"
                            />
                        </Link>
                    </div>
                    <MainMenu menuVisible={menuVisible} setMenuVisible={setMenuVisible} menu_items={menu_items} />
                    <div className="flex z-0 order-last w-full md:w-auto md:order-3 ml-auto">
                        <Search />
                    </div>
                    <div className="flex items-center gap-2 md:gap-5 order-4 md:-mr-1 ml-auto md:ml-0">
                        <Button
                            href="/customer/lists"
                            className={`${user.data ? "text-link" : "text-shade1 pointer-events-none opacity-25"} px-1.5 !py-2.5 min-w-auto hover:bg-gray-shade5`}
                            styling="clean"
                            aria-label={t("fields.wishlist")}
                        >
                            <Heart className="w-7 h-6.5" />
                        </Button>
                        {user.data ? (
                            <>
                                <Dropdown
                                    options={userMenuOptions}
                                    text={
                                        <Image className="w-7 min-w-7 h-7.5" priority src={accountIcon} alt="Account" />
                                    }
                                />
                                <Minicart />
                            </>
                        ) : (
                            <Button
                                href="/login"
                                className="!py-2.5 px-5.5 min-w-auto font-bold hover:from-gray-shade5 hover:via-gray-shade5 hover:to-gray-shade5 hover:text-link"
                                styling="secondary"
                            >
                                {t("general.login")}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

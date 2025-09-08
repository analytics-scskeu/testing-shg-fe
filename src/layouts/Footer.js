"use client";

import dayjs from "dayjs";
import { useSuspenseQuery } from "@apollo/client";
import { GET_CMS_BLOCK } from "@/api/queries/cmsBlock";
import { escapeHTML } from "@/utils/helper";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YoutubeIcon } from "@/resources/images/icons";
import { useSelector } from "react-redux";
import { selectorConfig, selectorStoreConfig } from "@/store/config";
import { useTranslations } from "next-intl";
import { SvgIcon } from "@/components/icons";
import ContactUsBanner from "@/components/ContactUsBanner";
import Newsletter from "@/components/Newsletter";
import { selectorUser } from "@/store/user";

export default function Footer() {
    const t = useTranslations();
    const customer = useSelector(selectorUser);
    const isLoggedIn = !customer.isGuest;

    const storeConfig = useSelector(selectorStoreConfig);
    const config = useSelector(selectorConfig);
    const { data: cmsBlocks } = useSuspenseQuery(GET_CMS_BLOCK, {
        variables: { identifier: "footer_menu" },
    });

    const platformIcons = {
        facebook: FacebookIcon,
        instagram: InstagramIcon,
        linkedin: LinkedInIcon,
        youtube: YoutubeIcon,
    };
    return (
        <footer className="footer mt-8 lg:mt-18">
            <div className="footer content">
                {isLoggedIn ? <ContactUsBanner /> : <Newsletter />}
                <div className="text-gray-700 body-font bg-container pt-16 md:pt-24">
                    <div className="container px-4 md:px-6 py-8 mx-auto">
                        <div className="flex flex-wrap order-first gap-y-8 md:gap-y-16">
                            <div className="flex flex-col gap-4 md:gap-8 pr-20">
                                <div className="order-1 sm:order-2 lg:order-1 w-full pb-2 sm:w-auto sm:pb-0">
                                    <Link
                                        id="footer_logo"
                                        className="flex items-center text-xl font-medium tracking-wide text-gray-800
            no-underline hover:no-underline font-title w-50 h-16"
                                        href={"/"}
                                        aria-label="Go to Home page"
                                    >
                                        <Image
                                            priority
                                            src={`${storeConfig?.base_media_url}logo/${storeConfig?.header_logo_src}`}
                                            alt="Logo"
                                            width={storeConfig?.logo_width ?? "199"}
                                            height={storeConfig?.logo_height ?? "65"}
                                            loading="eager"
                                        />
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-6 order-last">
                                    <span className="font-semibold text-lg text-body">{t("footer.follow_us")}</span>
                                    <div className="flex gap-4">
                                        <div className="flex gap-4">
                                            {config?.general?.social_links?.map((link, index) => {
                                                const platformIcon = platformIcons[link.platform.toLowerCase()];
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url ?? "/"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-link"
                                                        aria-label={link.platform}
                                                    >
                                                        <SvgIcon
                                                            icon={platformIcon}
                                                            height={32}
                                                            width={32}
                                                            className={"w-8 h-8"}
                                                        />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="footer-menu-wrapper grow"
                                dangerouslySetInnerHTML={{
                                    __html: escapeHTML(cmsBlocks?.cmsBlocks?.items[0]?.content),
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="container px-4 md:px-6 py-8 mx-auto">
                        <div className="flex gap-y-6 flex-col-reverse lg:flex-row lg:items-center justify-between text-body/55 text-xs sm:text-sm">
                            <p>
                                <small className="text-xs sm:text-sm text-body/55">
                                    <span>
                                        {" "}
                                        &copy; {dayjs().format("YYYY")} {storeConfig?.copyright}
                                    </span>
                                </small>
                            </p>
                            <div className="flex gap-4">
                                {config?.footer?.pages_list?.map((page, index) => (
                                    <Link
                                        key={index}
                                        href={page.url ?? "/"}
                                        className="transition-colors hover:text-body"
                                    >
                                        {page.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

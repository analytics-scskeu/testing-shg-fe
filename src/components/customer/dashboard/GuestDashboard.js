"use client";

import { WishlistCounter } from "@/components/customer/dashboard/counters";
import { Button } from "@/components/form";
import { RecentWishlist } from "@/components/customer/dashboard/index";
import { useTranslations } from "next-intl";

export default function GuestDashboard() {
    const t = useTranslations();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <WishlistCounter />
                <div className="contact-us flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-3 shadow-long p-6 lg:p-8 bg-white">
                    <div className="flex flex-col gap-2">
                        <span className="font-medium text-lg md:text-2xl">
                            {t("customer.dashboard.guest.contact.title")}
                        </span>
                        <p className="text-xs md:text-sm">{t("customer.dashboard.guest.contact.text")}</p>
                    </div>
                    <div>
                        <Button styling="primary" href="/contact" className="w-max">
                            {t("customer.dashboard.guest.contact.button")}
                        </Button>
                    </div>
                </div>
            </div>
            <RecentWishlist />
        </>
    );
}

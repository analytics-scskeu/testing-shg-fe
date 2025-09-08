"use client";

import {
    CompletedCounter,
    IncompleteCounter,
    MadeCounter,
    WishlistCounter,
} from "@/components/customer/dashboard/counters";
import { Button } from "@/components/form";
import { RecentOrders } from "@/components/customer/dashboard/index";
import { useTranslations } from "next-intl";

export default function CustomerDashboard() {
    const t = useTranslations();

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-6 lg:mb-10">
                <MadeCounter />
                <CompletedCounter />
                <IncompleteCounter />
                <WishlistCounter />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-10">
                <div className="quick-order flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-3 shadow-long p-6 lg:p-8 bg-white">
                    <div className="flex flex-col gap-2">
                        <span className="font-medium text-lg md:text-2xl">
                            {t("customer.dashboard.company.quick_order.title")}
                        </span>
                        <p className="text-sm">{t("customer.dashboard.company.quick_order.text")}</p>
                    </div>
                    <div className="w-full">
                        <Button styling="primary" href="/customer/orders/quick">
                            {t("customer.dashboard.company.quick_order.button")}
                        </Button>
                    </div>
                </div>
                <div className="order-sheet flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-3 shadow-long p-6 lg:p-8 bg-white">
                    <div className="flex flex-col gap-2">
                        <span className="font-medium text-lg md:text-2xl">
                            {t("customer.dashboard.company.upload_order.title")}
                        </span>
                        <p className="text-sm">{t("customer.dashboard.company.upload_order.text")}</p>
                    </div>
                    <div className="w-full">
                        <Button styling="primary" href="/customer/orders/upload">
                            {t("customer.dashboard.company.upload_order.button")}
                        </Button>
                    </div>
                </div>
            </div>
            <RecentOrders />
        </>
    );
}

"use client";

import { useTranslations } from "next-intl";
import { Spinner, SvgIcon } from "@/components/icons";
import { CartIcon } from "@/resources/images/icons";
import { useQuery } from "@apollo/client";
import { GET_SUMMARIES } from "@/api/queries/customer";

export default function MadeCounter() {
    const { data: summaries } = useQuery(GET_SUMMARIES);

    const t = useTranslations();

    return (
        <div className="orders-made flex justify-between items-center shadow-long p-4 lg:p-8 bg-white">
            <div className="flex flex-col gap-2">
                <span className="font-medium text-2xl md:text-[40px] text-body">
                    {summaries?.summaries.total_orders ?? <Spinner className="h-7 md:h-11 w-7 md:w-11" />}
                </span>
                <span className="text-xs md:text-base text-body/80">
                    {t("customer.dashboard.company.counters.made")}
                </span>
            </div>
            <SvgIcon
                icon={CartIcon}
                height={32}
                width={32}
                className={"text-[#2E008B] opacity-25 w-8 h-8 md:w-10 md:h-10"}
            />
        </div>
    );
}

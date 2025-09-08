"use client";

import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { useTranslations } from "next-intl";

export default function Greeting() {
    const customer = useSelector(selectorUser);

    const t = useTranslations();

    return (
        <div className="container text-lg md:text-3xl font-medium mb-6 lg:mb-8 px-4 lg:px-6 mx-auto">
            {t("customer.greeting", { name: customer.data?.firstname })}
        </div>
    );
}

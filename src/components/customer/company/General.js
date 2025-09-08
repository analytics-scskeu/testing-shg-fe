"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@apollo/client";
import { GET_COMPANY } from "@/api/queries/company";
import { Spinner } from "@/components/icons";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { useNotifications } from "@/hooks";

export default function General() {
    const t = useTranslations();

    const { RenderNotifications } = useNotifications();

    const { data: company } = useQuery(GET_COMPANY, {
        variables: {
            companyId: useSelector(selectorUser).data.company_id,
        },
    });

    return (
        <>
            <RenderNotifications />
            <div className="flex flex-col gap-6">
                <h2 className="text-lg md:text-3xl font-medium">{t("customer.company.index.title")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-container p-6">
                        <div className="mb-4 text-lg font-medium">{t("customer.company.index.info")}</div>
                        {company?.getCompany && (
                            <div className="text-sm font-normal grid grid-cols-1 gap-2">
                                <p>
                                    {t("customer.company.index.name")}: {company?.getCompany.company_name} (
                                    {company?.getCompany.legal_name})
                                </p>
                                <p>{t("customer.company.index.number")}: TODO</p>
                                <p>
                                    {t("customer.company.index.contact")}: {company?.getCompany.company_email}
                                </p>
                            </div>
                        )}
                        {!company?.getCompany && (
                            <div className="h-18 w-full grid place-items-center">
                                <Spinner />
                            </div>
                        )}
                    </div>
                    <div className="bg-container p-6">
                        <div className="mb-4 text-lg font-medium">{t("customer.company.index.invoice")}</div>
                        {company?.getCompany && (
                            <div className="text-sm font-normal grid grid-cols-1 gap-2">
                                <p>
                                    {t("customer.company.index.address")}: {company?.getCompany.street[0]},{" "}
                                    {company?.getCompany.postcode}
                                </p>
                                <p>
                                    {t("customer.company.index.city")}: {company?.getCompany.city}
                                </p>
                                <p>
                                    {t("customer.company.index.country")}: {company?.getCompany.country_id}
                                </p>
                            </div>
                        )}
                        {!company?.getCompany && (
                            <div className="h-18 w-full grid place-items-center">
                                <Spinner />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

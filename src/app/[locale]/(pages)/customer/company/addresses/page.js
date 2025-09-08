import { CompanyAddressesTable } from "@/components/customer/company";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/form";

export default async function Company() {
    const t = await getTranslations();

    return (
        <>
            <div className="flex w-full justify-between mb-6">
                <h2 className="text-lg md:text-3xl font-medium">{t("customer.company.addresses.table.title")}</h2>
                <Button href="/customer/company/addresses/create">
                    {t("customer.company.addresses.table.create")}
                </Button>
            </div>
            <CompanyAddressesTable />
        </>
    );
}

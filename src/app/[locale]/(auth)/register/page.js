import RegisterForm from "@/app/[locale]/(auth)/register/RegisterForm";
import { serverClient } from "@/api/apolloClient";
import { GET_ATTRIBUTES_FORM } from "@/api/queries/auth";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export default async function Page() {
    const t = await getTranslations();
    const h = await headers();
    const client = await serverClient(h);
    const { data: fieldsResponse } = await client.query({
        query: GET_ATTRIBUTES_FORM,
        variables: {
            form_code: "customer_account_create",
        },
    });
    return (
        <>
            <h2 className="text-2xl md:text-3xl  font-bold text-shade1 mb-4 mt-15">
                {t("auth.register.create_account")}
            </h2>
            <RegisterForm fields={fieldsResponse.attributesForm} />

            <p className="mt-10 text-md text-shade1">
                {t("auth.register.already_have_an_account") + " "}
                <Link href="/login" className="text-link font-bold underline">
                    {t("auth.sign_in")}
                </Link>
            </p>
        </>
    );
}

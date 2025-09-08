import LoginForm from "@/app/[locale]/(auth)/login/LoginForm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function Login() {
    const t = await getTranslations();
    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-shade1 mb-4">{t("auth.sign_in")}</h2>
            <p className="text-base text-gray-shade1 mb-8">{t("auth.login.text")}</p>

            <LoginForm />

            <p className="mt-4 text-md text-shade1">
                {t("auth.login.not_account_yet") + " "}
                <Link href="/register" className="text-link font-bold underline">
                    {t("auth.login.create_one")}
                </Link>
            </p>
        </>
    );
}

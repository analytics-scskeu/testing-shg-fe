import { getTranslations } from "next-intl/server";
import ForgotForm from "@/app/[locale]/(auth)/forgotpassword/ForgotForm";
import { Link } from "@/i18n/routing";
import Arrow from "@/components/icons/Arrow";

export default async function Login() {
    const t = await getTranslations();

    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-shade1 mb-2">{t("auth.forgot.title")}</h2>
            <p className="text-base text-gray-shade1 mb-8">{t("auth.forgot.text")}</p>
            <ForgotForm />

            <Link href="/login" className="flex text-link font-bold underline">
                <Arrow className={"mt-1"} />
                {t("auth.verify.button_back")}
            </Link>
        </>
    );
}

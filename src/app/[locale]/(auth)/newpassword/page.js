import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Arrow from "@/components/icons/Arrow";
import NewPasswordForm from "@/app/[locale]/(auth)/newpassword/NewPasswordForm";
import { decrypt, getCookie } from "@/utils/session";
import { redirect } from "next/navigation";

export default async function Login() {
    const t = await getTranslations();
    const sessionCookie = await getCookie("session");
    const resetToken = await getCookie("reset_token");
    if (!sessionCookie || !resetToken) {
        redirect("/forgotpassword");
    }
    const decryptedSession = await decrypt(sessionCookie);
    if (decryptedSession.purpose !== "reset") {
        redirect("/forgotpassword");
    }

    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-shade1 mb-4">{t("auth.reset.title")}</h2>
            <p className="text-base text-gray-shade1 mb-8">{t("auth.reset.text")}</p>

            <NewPasswordForm sessionCookie={decryptedSession} resetToken={resetToken} />

            <Link href={"/login"} className="flex text-link font-bold">
                <Arrow className={"mt-1"} />
                {t(`auth.reset.back_text`)}
            </Link>
        </>
    );
}

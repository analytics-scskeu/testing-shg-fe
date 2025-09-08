import VerifyForm from "@/app/[locale]/(auth)/verify/VerifyForm";
import { decrypt, getCookie } from "@/utils/session";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const t = await getTranslations();
    const sessionCookie = await getCookie("session");
    if (!sessionCookie) {
        redirect("/forgotpassword");
    }
    const decryptedSession = await decrypt(sessionCookie);
    if (decryptedSession.purpose !== "reset") {
        redirect("/forgotpassword");
    }

    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-shade1 mb-4">{t("auth.verify.forgot.title")}</h2>
            <p className="text-base text-gray-shade1 mb-8">{t("auth.verify.forgot.text")}</p>
            <VerifyForm sessionCookie={decryptedSession} />
        </>
    );
}

import VerifyForm from "@/app/[locale]/(auth)/verify/VerifyForm";
import { decrypt, getCookie } from "@/utils/session";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const t = await getTranslations("auth.verify.login");
    const sessionCookie = await getCookie("session");
    if (!sessionCookie) {
        redirect("/login");
    }
    const decryptedSession = await decrypt(sessionCookie);
    if (decryptedSession.purpose !== "login") {
        redirect("/login");
    }

    return (
        <>
            <h2 className="text-2xl md:text-3xl font-bold text-shade1 mb-4">{t("title")}</h2>
            <p className="text-base text-gray-shade1 mb-8">{t("text")}</p>
            <VerifyForm sessionCookie={decryptedSession} />
        </>
    );
}

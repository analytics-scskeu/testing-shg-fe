import ContactForm from "@/app/[locale]/(pages)/contact/ContactForm";
import { getTranslations } from "next-intl/server";

export default async function Page() {
    const t = await getTranslations();
    return (
        <div className="max-w-6xl mx-auto py-10 md:px-6">
            <h1 className="text-3xl font-semibold text-center text-primary-shade1 mb-8">{t("contact.contact_us")}</h1>
            <ContactForm />
        </div>
    );
}

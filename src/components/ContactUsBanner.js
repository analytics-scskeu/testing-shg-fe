import { useTranslations } from "next-intl";
import { Button } from "./form";

export default function ContactUsBanner() {
    const t = useTranslations();

    return (
        <div className="container mx-auto flex flex-col justify-items-center items-center">
            <div className="w-90 mx-auto sm:w-full xl:w-316 p-10 -mb-16 z-10 flex flex-col md:flex-row justify-between items-center shadow-xl bg-white">
                <div className="flex flex-col sm:mr-20 md:mr-30 lg:mr-40">
                    <div className="font-medium text-lg sm:text-xl md:text-2xl lg:text-[32px] mb-4">
                        {t("contact.title")}
                    </div>
                    <div>{t("contact.content")}</div>
                </div>

                <Button className="w-full md:w-auto mt-10 md:mt-0 py-4" href={"/contact-us"}>
                    {t("contact.contact_us")}
                </Button>
            </div>
        </div>
    );
}

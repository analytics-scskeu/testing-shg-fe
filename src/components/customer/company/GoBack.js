"use client";

import { Button } from "@/components/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function GoBack({ href, translateKey }) {
    const t = useTranslations();

    return (
        <Button href={href} styling="clean" className="p-0!">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="font-bold text-primary ml-2">{t(translateKey)}</span>
        </Button>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/form";
import { useTranslations } from "next-intl";
import Modal from "@/components/Modal";

export default function Deactivate() {
    const t = useTranslations();

    const [showDialog, setShowDialog] = useState(false);
    return (
        <div>
            <h3 className="text-lg md:text-2xl font-medium mb-4">{t("customer.account.delete.title")}</h3>
            <span className="text-sm md:text-base font-normal">{t("customer.account.delete.text")}</span>
            <div className="w-full mt-6">
                <Button styling="danger" onClick={() => setShowDialog(true)} className="w-full lg:w-auto">
                    {t("customer.account.delete.button")}
                </Button>
            </div>

            <Modal
                show={showDialog}
                onConfirmText={t("general.yes")}
                onConfirm={() => setShowDialog(false)}
                onCancelText={t("general.no")}
                onClose={() => setShowDialog(false)}
            >
                {t("customer.account.delete.dialog.warning")}
            </Modal>
        </div>
    );
}

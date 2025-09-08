"use client";

import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark,
    faExclamationCircle,
    faInfoCircle,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const messageTypes = {
    success: {
        classes: "border-success-shade1",
        iconClass: "text-success-shade1",
        icon: faCircleCheck,
        title: "general.success",
    },
    error: {
        classes: "border-danger-shade1",
        iconClass: "text-danger-shade1",
        icon: faCircleXmark,
        title: "general.error",
    },
    warning: {
        classes: "border-warning-shade1",
        iconClass: "text-warning-shade1",
        icon: faExclamationCircle,
        title: "general.warning",
    },
    info: {
        classes: "border-primary-shade2",
        iconClass: "text-primary-shade2",
        icon: faInfoCircle,
        title: "general.info",
    },
};

export default function Notify({ type = "info", className, text, title, onClose, duration }) {
    if (!messageTypes[type]) {
        type = "info";
    }

    useEffect(() => {
        if (onClose && duration !== null) {
            const timeout = setTimeout(() => {
                onClose();
            }, duration || 5000);
            return () => clearTimeout(timeout);
        }
    }, [onClose, duration]);

    const t = useTranslations();
    const classes = twMerge(`border-l-6 bg-gray-shade3 px-4 py-3`, messageTypes[type].classes, className);

    return (
        <div className={classes}>
            <div className="flex justify-center justify-between items-center gap-4">
                <FontAwesomeIcon icon={messageTypes[type].icon} className={messageTypes[type].iconClass} />
                <div className={"flex flex-col gap-2 grow"}>
                    {title ? (
                        <span className={"font-semibold block"}>{title}</span>
                    ) : (
                        <span className={"font-semibold block"}>{t(messageTypes[type].title)}</span>
                    )}
                    <span className={"font-normal text-sm"}>{text}</span>
                </div>
                {typeof onClose === "function" && (
                    <FontAwesomeIcon
                        onClick={onClose}
                        icon={faXmark}
                        className="text-2xl text-gray-shade1 hover:text-black"
                    />
                )}
            </div>
        </div>
    );
}

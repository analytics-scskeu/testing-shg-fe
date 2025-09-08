"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectorConfig } from "@/store/config";

export default function Announcement() {
    const [isVisible, setIsVisible] = useState(true);
    const config = useSelector(selectorConfig);

    if (!config?.customer_pages.announcement || !isVisible) return null;

    return (
        <div className="container px-4 lg:px-6 mx-auto">
            <div className="px-4 lg:px-6 announcement-block flex justify-between items-center bg-white border-[#2E008B] border-2 shadow-long py-3 lg:py-5 mb-8 mt-6">
                <span className="font-medium text-sm md:text-lg text-[#2E008B]">
                    {config.customer_pages.announcement}
                </span>
                <FontAwesomeIcon
                    icon={faClose}
                    className="h-4 w-4 mr-2 cursor-pointer"
                    onClick={() => setIsVisible(false)}
                />
            </div>
        </div>
    );
}

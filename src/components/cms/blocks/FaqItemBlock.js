"use client";

import DOMPurify from "isomorphic-dompurify";
import { useContext } from "react";
import { FaqContext } from "@/components/cms/blocks/FaqBlock";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default function FaqItemBlock({ index, ...props }) {
    const { openIndex, toggle, parentProps } = useContext(FaqContext);
    const sanitizedHtml = DOMPurify.sanitize(props.answer);

    const isOpen = openIndex === index;

    const questionClasses = twMerge(
        "text-start pr-2",
        parentProps.textAlign === "center" && "mx-auto text-center w-full",
        parentProps.textAlign === "right" && "ml-auto text-end w-full"
    );

    return (
        <div>
            <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-4 font-medium hover:bg-gray-shade3"
            >
                <span className={questionClasses}>{props.question}</span>
                <span className={`transform transition-transform duration-300`}>
                    {isOpen ? (
                        <FontAwesomeIcon
                            className={"border-1 rounded-full border-primary-shade2 text-primary-shade2 px-1 h-2 w-2"}
                            icon={faMinus}
                        />
                    ) : (
                        <FontAwesomeIcon
                            className={"border-1 rounded-full border-primary-shade2 text-primary-shade2 px-1 h-2 w-2"}
                            icon={faPlus}
                        />
                    )}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out px-4 ${isOpen ? "max-h-1000 py-4" : "max-h-0 py-0"}`}
            >
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </div>
        </div>
    );
}

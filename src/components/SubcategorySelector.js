import { useState } from "react";
import { useTranslations } from "next-intl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/form";
import { useDragScroll, useHandleResize } from "@/hooks";

export default function SubcategorySelector({ title = true, subcategories, selected, setSelected, className }) {
    const t = useTranslations();
    const scrollRef = useDragScroll();
    const [showArrows, setShowArrows] = useState(false);

    const checkOverflow = () => {
        const isOverflowing = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        if (scrollRef.current && isOverflowing !== showArrows) {
            setShowArrows(isOverflowing);
        }
    };

    useHandleResize(checkOverflow);

    const scrollList = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            const scrollByValue = direction === "left" ? -scrollAmount : scrollAmount;
            scrollRef.current.scrollBy({ left: scrollByValue, behavior: "smooth" });
        }
    };

    const classes = twMerge(``, className);

    return (
        <div className={classes}>
            <div className="flex justify-between items-center mb-2 md:mb-4">
                <div className="font-medium items-center text-sm md:text-2xl">
                    {title && t("categories.subcategories")}
                </div>
                {showArrows && (
                    <div className="flex z-10 gap-2">
                        <button
                            onClick={() => scrollList("left")}
                            className="p-2 w-6 h-6 flex justify-center items-center"
                            aria-label="Scroll left"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                            onClick={() => scrollList("right")}
                            className="p-2 w-6 h-6 flex justify-center items-center"
                            aria-label="Scroll right"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-start items-center">
                <div
                    ref={scrollRef}
                    className="flex justify-start items-center overflow-hidden no-scrollbar py-2 cursor-grab"
                >
                    <div className="flex flex-nowrap">
                        {subcategories.map((subcategory) => (
                            <Button
                                key={subcategory.id}
                                onClick={() => setSelected(subcategory.id)}
                                styling={selected === subcategory.id ? "primary" : "secondary"}
                                className={`mr-2 md:mr-4 px-4 py-2 md:px-3.5 md:py-4 font-medium whitespace-nowrap ${
                                    selected === subcategory.id ? "text-white" : "text-shade1 border border-shade1/14"
                                }`}
                            >
                                {subcategory.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

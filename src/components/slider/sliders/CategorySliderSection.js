import React from "react";
import CategorySlider from "@/components/slider/sliders/CategorySlider";
import { getTranslations } from "next-intl/server";

const CategorySliderSection = async ({ categories }) => {
    const t = await getTranslations();

    if (!categories || categories.length === 0) return null;

    return (
        <div className="container mx-auto max-md:px-4 max-3xl:px-10 px-3 py-8 max-sm:pb-0 max-md:mt-4">
            <h2 className="text-lg md:text-[32px] font-medium md:text-center mb-4">
                {t("homepage.explore_portfolio")}
            </h2>
            <CategorySlider slides={categories} />
        </div>
    );
};

export default CategorySliderSection;

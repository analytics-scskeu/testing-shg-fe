import React from "react";
import { getTranslations } from "next-intl/server";
import ProductSlider from "./ProductSlider";

const NewReleasesSliderSection = async ({ newReleases }) => {
    const t = await getTranslations();
    if (!newReleases || newReleases.length === 0) return null;

    return (
        <div className="container mx-auto max-md:px-4 max-3xl:px-10 px-3 py-4 sm:py-8">
            <h2 className="text-lg md:text-[32px] font-medium md:text-center mb-4 md:mb-6">
                {t("homepage.new_releases")}
            </h2>
            <ProductSlider slides={newReleases} />
        </div>
    );
};

export default NewReleasesSliderSection;

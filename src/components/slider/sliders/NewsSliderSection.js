import React from "react";
import { getTranslations } from "next-intl/server";
import NewsSlider from "./NewsSlider";

const NewsSliderSection = async ({ recentPosts }) => {
    const t = await getTranslations();

    if (!recentPosts?.posts || recentPosts.posts.length === 0) return null;

    return (
        <div className="container mx-auto max-md:px-4 max-3xl:px-10 px-3 max-md:pt-8 sm:pb-8">
            <h2 className="text-lg md:text-[32px] font-medium md:text-center max-md:mb-4">
                {t("homepage.sumitomo_news")}
            </h2>
            <NewsSlider slides={recentPosts.posts} />
        </div>
    );
};

export default NewsSliderSection;

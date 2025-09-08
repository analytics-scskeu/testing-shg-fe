import { GET_HOMEPAGE_BLOCKS } from "@/api/queries/homepage";

import BannerSection from "@/components/home/Banner";
import CategorySliderSection from "@/components/slider/sliders/CategorySliderSection";
import NewReleasesSliderSection from "@/components/slider/sliders/NewReleasesSliderSection";
import NewsSliderSection from "@/components/slider/sliders/NewsSliderSection";
import TestimonialsSliderSection from "@/components/slider/sliders/TestimonialsSliderSection";
import { serverClient } from "@/api/apolloClient";
import { headers } from "next/headers";

export default async function Home() {
    const h = await headers();
    const client = await serverClient(h);
    const { data } = await client.query({
        query: GET_HOMEPAGE_BLOCKS,
    });

    const sections = JSON.parse(data?.homepage?.sections || "{}");

    return (
        <div>
            {sections.banner?.enabled && <BannerSection banner={sections.banner} />}

            <CategorySliderSection categories={sections.categories} />

            <NewReleasesSliderSection newReleases={sections.new_releases} />

            {sections?.generic_info?.enabled && sections.generic_info.content && (
                <div
                    className="generic-info-block bg-container"
                    dangerouslySetInnerHTML={{ __html: sections.generic_info.content }}
                />
            )}

            <NewsSliderSection recentPosts={sections.recent_posts} />

            {sections?.contact_us?.enabled && sections.contact_us.content && (
                <div
                    className="generic-info-block contactus-block w-full"
                    dangerouslySetInnerHTML={{ __html: sections.contact_us.content }}
                />
            )}

            <TestimonialsSliderSection testimonials={sections.testimonials?.testimonials} />
        </div>
    );
}

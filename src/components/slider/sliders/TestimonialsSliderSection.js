import React from "react";
import bgTestimonial from "@/resources/images/bgTestimonial.png";
import TestimonialsSlider from "./TestimonialsSlider";
import { getTranslations } from "next-intl/server";

const TestimonialsSliderSection = async ({ testimonials }) => {
    const t = await getTranslations();

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <div className="testimonials relative bg-no-repeat bg-bottom-right pb-6 sm:pb-0">
            <div
                className="absolute right-0 bottom-0 md:top-0 overflow-visible w-full md:w-1/2 md:max-w-[60%] -z-1 bg-top-left bg-no-repeat bg-cover max-md:h-1/2"
                style={{ backgroundImage: `url(${bgTestimonial.src})` }}
            />
            <div className="container mx-auto max-md:px-4 max-3xl:px-12 px-3 py-6 sm:py-10 z-10">
                <div className="md:px-6 mb-6 md:max-w-[40%] md:-ml-12 xl:ml-0 z-20">
                    <h2 className="text-lg md:text-[32px] font-medium" data-appearance="default" data-element="main">
                        {t("homepage.testimonials_title")}
                    </h2>
                    <div data-content-type="text" data-appearance="default" data-element="main">
                        <p className="text-sm md:text-base mt-2 md:mg-0">{t("homepage.testimonials_content")}</p>
                    </div>
                </div>
                <TestimonialsSlider slides={testimonials} />
            </div>
        </div>
    );
};

export default TestimonialsSliderSection;

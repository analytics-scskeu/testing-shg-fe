"use client";

import React, { useCallback } from "react";
import DynamicSlider from "@/components/slider/Slider";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import SliderArrowButton from "@/components/slider/SliderArrowButton";

const CategorySlider = ({ slides }) => {
    const settings = {
        dots: false,
        infinite: false,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,
        draggable: true,
        swipe: true,
        touchMove: true,
        nextArrow: <SliderArrowButton />,
        prevArrow: <SliderArrowButton isPrev />,
        slidesToShow: 6,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 2.5, slidesToScroll: 1 } },
        ],
    };
    const renderCategorySlide = useCallback(
        (item) => (
            <Link href={item.url} className="group block p-3 max-md:pt-0">
                <div className="relative h-full transform transition-transform duration-300 group-hover:scale-[1.1] z-0 group-hover:z-10">
                    <div className="min-h-[150px] bg-gray-shade3 text-center flex flex-col h-full transition-colors duration-300 group-hover:bg-[linear-gradient(55.68deg,#DFE8FA_10.69%,#F3F5F9_55.94%,#F8F8F8_104.53%)] overflow-hidden">
                        <div className="overflow-hidden">
                            <Image
                                src={item.image}
                                alt={`Product ${item.name}`}
                                className="w-full h-20 md:h-40 object-contain max-md:!pb-0 p-4 sm:p-6 transition-transform duration-300 group-hover:scale-110"
                                width={300}
                                height={300}
                            />
                        </div>
                        <div className="p-4 mt-auto">
                            <h3 className="text-sm md:text-2xl font-medium md:mt-2 md:min-h-[70px]">{item.name}</h3>
                        </div>
                    </div>
                </div>
            </Link>
        ),
        []
    );

    return <DynamicSlider slides={slides} settings={settings} renderSlide={renderCategorySlide} />;
};

export default CategorySlider;

"use client";

import { Link } from "@/i18n/routing";
import PromoCard from "./PromoCard";
import DynamicSlider from "@/components/slider/Slider";
import ArrowIcon from "@/components/icons/ArrowIcon";
import Image from "next/image";

export default function BannerSectionSlider({ banner }) {
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrow: false,
        initialSlide: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1, dots: true },
                dots: true,
            },
        ],
    };

    function BannerCard({ banner }) {
        return (
            <div className="relative z-10 flex flex-row p-4 group m-4 ml-8 lg:m-0 hover-after-trapezoid min-h-[170px] lg:min-h-[150px]">
                <div
                    className="absolute -left-4 w-[calc(100%+1rem)] h-full z-0 bg-[#2E008B1A] lg:bg-gradient-to-r lg:from-[#FFFFFF1A] lg:to-[#9999991A] lg:backdrop-blur-lg"
                    style={{ maskImage: "linear-gradient(143.1deg, #fff 85%, transparent 15%)" }}
                ></div>
                <div
                    className="absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-br from-[#221E77] via-[#4B2BAB] to-[#3F38DD] lg:bg-gradient-to-b lg:from-[#FFFFFF3D] lg:to-[#9999993D] lg:backdrop-blur-lg lg:group-hover:from-[#7562B7] lg:group-hover:to-[#6953A8]"
                    style={{ maskImage: "linear-gradient(143.1deg, #fff 83%, transparent 20%)" }}
                ></div>
                <div className="text-white font-medium xl:text-lg flex flex-col z-20 pr-25 xl:pr-40">
                    <h1 className="lg:text-4xl xl:text-[3.5rem] font-medium lg:font-bold lg:leading-tight lg:-mr-11 text-white z-20">
                        {banner.title}
                    </h1>
                    <Link
                        href={banner.button_link ?? "/"}
                        className="inline-flex items-center gap-2 text-sm font-medium xl:text-base text-white"
                    >
                        {banner.button_text}
                        <ArrowIcon />
                    </Link>
                    <Link
                        href={banner.additional_button_link ?? "/"}
                        className="inline-flex items-center gap-2 text-sm font-medium xl:text-base"
                    >
                        {banner.additional_button_text}
                        <ArrowIcon />
                    </Link>
                </div>
                <div className="flex z-20 w-[7rem] xl:w-44 h-[8.5rem] xl:h-44 absolute -bottom-5 xl:bottom-0 right-0">
                    <Image
                        src={banner.image}
                        alt={banner.title}
                        className="max-w-full h-auto object-contain md:max-h-64 mt-auto"
                        width="170"
                        height="170"
                        priority
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mobile_banner_section block lg:hidden">
            <DynamicSlider
                settings={sliderSettings}
                slides={[...banner.promo_boxes, { isBanner: true, ...banner.main_banner }]}
                renderSlide={(slide) =>
                    slide.isBanner ? (
                        <BannerCard key="banner" banner={slide} />
                    ) : (
                        <PromoCard key={slide.id} {...slide} />
                    )
                }
            />
        </div>
    );
}

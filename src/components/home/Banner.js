import React from "react";
import PromoCard from "./PromoCard";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import bgHomeBannerMd from "@/resources/images/bgHomeBannerMd.png";
import bgHomeBanner from "@/resources/images/bgHomeBanner.png";
import BannerSectionSlider from "./BannerSectionSlider";

export default function BannerSection({ banner }) {
    return (
        <>
            <div id="desktop_banner_section" className="relative mb-6 bg-container max-lg:hidden">
                <div className="relative flex xl:gap-5 xl:min-h-[690px] pt-5 xl:pt-13 px-6 xl:pb-6">
                    <div className="relative z-[2] grow overflow-hidden">
                        <div className="py-16 bg-white/20 shadow-lg backdrop-blur-lg min-h-[546px] xl:min-h-[690px] h-full">
                            <div className="relative flex flex-row items-center justify-between m-4 lg:m-0 ml-8 lg:ml-auto lg:max-w-3xl xl:max-w-[1040px]">
                                <div
                                    className="lg:hidden -left-4 absolute bg-[#2E008B1A] h-full top-4 w-[calc(100%+1rem)] z-0"
                                    style={{ maskImage: "linear-gradient(143.1deg, #fff 85%, transparent 15%)" }}
                                />
                                <div
                                    className="lg:hidden absolute h-full w-full bg-gradient-to-br from-[#221E77] via-[#4B2BAB] to-[#3F38DD]"
                                    style={{ maskImage: "linear-gradient(143.1deg, #fff 80%, transparent 20%)" }}
                                />
                                <div className="flex flex-col p-4 lg:p-0 pr-0 space-y-3 lg:space-y-6 lg:w-1/2 z-10 text-white lg:text-body">
                                    <h1 className="lg:text-4xl xl:text-[3.5rem] font-medium lg:font-bold lg:leading-tight lg:-mr-11">
                                        {banner.main_banner.title}
                                    </h1>
                                    <div className="flex flex-col lg:flex-row lg:space-x-4">
                                        <Link
                                            href={banner.main_banner.button_link ?? "/"}
                                            className="text-sm font-medium xl:text-base bg-gradient-to-r from-primary-shade1 via-primary-shade2 to-primary-shade3 text-white px-6 xl:px-10 py-3.5 font-semibold transition ease-in-out duration-150 cursor-pointer hover:from-primary-shade1 hover:to-primary-shade1"
                                        >
                                            {banner.main_banner.button_text}
                                        </Link>
                                        <Link
                                            href={banner.main_banner.additional_button_link ?? "/"}
                                            className="text-sm font-medium xl:text-base lg:btn border text-primary-shade1 border-primary-shade1 px-6 xl:px-9 py-3.5 font-semibold transition ease-in-out duration-150 cursor-pointer hover:bg-gradient-to-r hover:text-white hover:from-primary-shade1 hover:to-primary-shade3"
                                        >
                                            {banner.main_banner.additional_button_text}
                                        </Link>
                                    </div>
                                </div>
                                <div className="max-w-[8.5rem] lg:max-w-none w-full lg:w-5/12 mx-auto xl:w-1/2 mt-auto lg:mt-6 xl:mt-0 -mb-4 lg:mb-auto flex justify-center z-10">
                                    <div className="xl:pr-4 ml-auto w-[430px] h-[300px] relative">
                                        <Image
                                            priority
                                            src={banner.main_banner.image}
                                            alt={banner.main_banner.title}
                                            className="float-right"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            style={{
                                                objectFit: "contain",
                                            }}
                                            fill={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Promo Cards */}
                    <div className="relative z-[2] grow">
                        <div className="flex flex-col gap-10 justify-between max-w-[360px] xl:max-w-md pl-8 xl:pl-8 xl:pr-2.5">
                            {banner.promo_boxes.map((item, index) => (
                                <PromoCard key={index} {...item} />
                            ))}
                        </div>
                    </div>

                    {/* Background Images */}
                    <div
                        className="absolute z-0 right-0 -top-[42px] w-[656px] h-[590px] block xl:hidden"
                        style={{ backgroundImage: `url(${bgHomeBannerMd.src})`, backgroundPosition: "0 -80px" }}
                    ></div>
                    <div
                        className="absolute z-0 -top-[40px] right-0 w-[1089px] h-[750px] hidden xl:block"
                        style={{ backgroundImage: `url(${bgHomeBanner.src})`, backgroundPosition: "0 -85px" }}
                    ></div>
                </div>
            </div>
            {/* Mobile slider */}
            <BannerSectionSlider banner={banner} />
        </>
    );
}

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import ArrowIcon from "@/components/icons/ArrowIcon";

const TestimonialCard = ({ item, quoteColor }) => {
    const t = useTranslations();
    return (
        <div className="max-md:mb-3 p-3 w-full">
            <div className="md:mb-8 h-full bg-white p-8 relative shadow-xl shadow-gray-500/25">
                <div className="inline-flex items-center min-h-[60px]">
                    {item.picture && (
                        <Image
                            width="106"
                            height="106"
                            alt="testimonial"
                            src={item.picture}
                            className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center mr-4"
                        />
                    )}
                    <span className="flex-grow flex flex-col">
                        <span className="title-font font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-500 text-sm">{item.role}</span>
                    </span>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={quoteColor}
                    className="block w-7 h-7 text-black-400 mb-4 absolute right-6 top-10 rotate-180"
                    viewBox="0 0 975.036 975.036"
                >
                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                </svg>

                <div className="min-h-[150px]">
                    <p className="text-sm md:text-base font-normal my-6 line-clamp-4">{item.content}</p>
                    {item.link && (
                        <Link
                            href={item.link ?? "/"}
                            className="w-full md:w-auto text-sm xl:text-base text-primary-shade1 font-semibold transition ease-in-out duration-150 cursor-pointer"
                        >
                            {t("general.read_more")}
                            <ArrowIcon className="inline-block ml-2" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;

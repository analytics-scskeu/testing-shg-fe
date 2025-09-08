import React from "react";
import { Link } from "@/i18n/routing";
import ArrowIcon from "@/components/icons/ArrowIcon";
import Image from "next/image";

export default function PromoCard(item) {
    return (
        <Link href={item.link ?? "/"} className="relative z-10 flex flex-row p-4 group m-4 ml-8 lg:m-0 min-h-[170px]">
            <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                    top: "-1px",
                    left: "-1px",
                    width: "calc(100% + 2px)",
                    height: "calc(100% + 2px)",
                    background: "white",
                    WebkitMask: "linear-gradient(143.1deg, #fff 80%, transparent 0) top left",
                    mask: "linear-gradient(143.1deg, #fff 83%, transparent 0) top left",
                    zIndex: 1,
                }}
            ></div>
            <div
                className="absolute -left-4 w-[calc(100%+1rem)] h-full z-0 bg-[#2E008B1A] lg:bg-gradient-to-r lg:from-[#FFFFFF1A] lg:to-[#9999991A] lg:backdrop-blur-lg"
                style={{ maskImage: "linear-gradient(143.1deg, #fff 85%, transparent 15%)" }}
            ></div>
            <div
                className="absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-br from-[#221E77] via-[#4B2BAB] to-[#3F38DD] lg:bg-gradient-to-b lg:from-[#FFFFFF3D] lg:to-[#9999993D] lg:backdrop-blur-lg lg:group-hover:from-[#7562B7] lg:group-hover:to-[#6953A8]"
                style={{ maskImage: "linear-gradient(143.1deg, #fff 83%, transparent 20%)" }}
            ></div>
            <div className="text-white font-medium xl:text-lg flex flex-col gap-3 xl:gap-4 z-20 pr-28 xl:pr-40">
                <p>{item.text}</p>
                <span className="inline-flex items-center gap-2 text-sm xl:text-base">
                    {item.link_text}
                    <ArrowIcon />
                </span>
            </div>
            <div className="flex z-20 w-[8.5rem] xl:w-44 h-[8.5rem] xl:h-44 absolute -bottom-5 xl:bottom-0 right-0">
                <Image
                    src={item.image}
                    alt={item.text}
                    className="max-w-full h-auto object-contain md:max-h-64 mt-auto"
                    width={170}
                    height={170}
                    priority
                    fetchPriority="high"
                />
            </div>
        </Link>
    );
}

import React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import ArrowIcon from "@/components/icons/ArrowIcon";
import ProductGrades from "@/components/product/ProductGrades";

export const ProductHeader = ({ product }) => {
    return (
        <Link href={product.url ?? "/"}>
            <Image
                src={typeof product.image === "object" ? product.image.url : product.image}
                alt={product.name}
                className="w-full h-40 object-contain p-4"
                width="300"
                height="300"
            />
        </Link>
    );
};

export const ProductBody = ({ product }) => {
    return (
        <>
            <ProductGrades gradeClass={product.grade_class} className={"pb-6"} />
            <h2 className="text-body font-medium text-sm md:text-lg">{product.name}</h2>
            <div
                className="text-sm md:text-base leading-relaxed mb-6"
                dangerouslySetInnerHTML={{
                    __html:
                        typeof product.short_description === "object"
                            ? product.short_description.html
                            : product.short_description,
                }}
            />
            <div className="mt-auto flex flex-wrap items-center">
                <Link
                    href={product.url_key ? `/products/details/${product.url_key}` : "/products"}
                    className="w-full md:w-auto justify-center text-sm mr-auto leading-relaxed xl:text-base border text-primary-shade1 border-primary-shade1 px-2 sm:px-6 py-2 sm:py-3.5 font-semibold transition ease-in-out duration-150 cursor-pointer hover:bg-gradient-to-r hover:text-white hover:from-primary-shade1 hover:to-primary-shade3"
                >
                    More details
                    <ArrowIcon className="inline-block ml-2" />
                </Link>
            </div>
        </>
    );
};

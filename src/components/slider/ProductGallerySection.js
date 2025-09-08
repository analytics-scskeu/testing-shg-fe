"use client";

import React, { useCallback } from "react";
import DynamicSlider from "@/components/slider/Slider";
import Image from "next/image";

const ProductGallerySection = ({ images }) => {
    const settings = {
        dots: false,
        infinite: false,
        slidesToScroll: 1,
        arrows: false,
    };

    const renderGallerySlide = useCallback(
        (item) => (
            <div className="relative h-full">
                <div className="bg-gray-shade3 text-center flex flex-col h-full">
                    <Image
                        src={item.url}
                        alt={item.label}
                        className="object-contain w-full h-auto mx-auto min-w-[60%]"
                        width={600}
                        height={600}
                    />
                </div>
            </div>
        ),
        []
    );

    if (!images || images.length === 0) return null;

    return <DynamicSlider slides={images} settings={settings} renderSlide={renderGallerySlide} />;
};

export default ProductGallerySection;

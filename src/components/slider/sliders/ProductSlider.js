"use client";

import React, { useCallback } from "react";
import DynamicSlider from "@/components/slider/Slider";
import SliderArrowButton from "@/components/slider/SliderArrowButton";
import Card from "@/components/card";
import { ProductBody, ProductHeader } from "@/components/card/Product";

const ProductSlider = ({ slides }) => {
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
        slidesToShow: 4,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
    };

    const renderNewReleaseSlide = useCallback(
        (item) => (
            <Card
                label={"New"}
                cardBody={<ProductBody product={item} />}
                cardHeader={<ProductHeader product={item} />}
            />
        ),
        []
    );

    return <DynamicSlider slides={slides} settings={settings} renderSlide={renderNewReleaseSlide} />;
};

export default ProductSlider;

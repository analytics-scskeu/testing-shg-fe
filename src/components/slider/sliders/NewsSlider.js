"use client";

import React, { useCallback } from "react";
import SliderArrowButton from "@/components/slider/SliderArrowButton";
import DynamicSlider from "@/components/slider/Slider";
import NewsCard from "@/components/home/NewsCard";

const NewsSlider = ({ slides }) => {
    const settings = {
        dots: false,
        infinite: false,
        swipeToSlide: true,
        draggable: true,
        swipe: true,
        touchMove: true,
        arrows: true,
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
    const renderNewsSlide = useCallback((item) => <NewsCard item={item} />, []);

    return <DynamicSlider slides={slides} settings={settings} renderSlide={renderNewsSlide} />;
};

export default NewsSlider;

"use client";

import React, { useCallback, useMemo } from "react";
import DynamicSlider from "@/components/slider/Slider";
import TestimonialCard from "@/components/home/TestimonialCard";
import SliderArrowButton from "@/components/slider/SliderArrowButton";

const TestimonialsSlider = ({ slides }) => {
    const settings = {
        dots: false,
        infinite: false,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,
        draggable: true,
        swipe: true,
        touchMove: true,
        nextArrow: <SliderArrowButton extraClassName={"!text-white"} />,
        prevArrow: <SliderArrowButton isPrev />,
        slidesToShow: 3,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1, dots: true, arrows: false } },
            { breakpoint: 480, settings: { slidesToShow: 1, dots: true, arrows: false } },
        ],
    };

    const colors = useMemo(() => ["#2E008B", "#1168B4", "#1C9EAF"], []);

    const slidesWithIndex = useMemo(() => {
        return slides.map((item, index) => ({
            ...item,
            _index: index,
        }));
    }, [slides]);

    const renderTestimonialSlide = useCallback(
        (item) => {
            const quoteColor = colors[item._index % colors.length];
            return <TestimonialCard item={item} quoteColor={quoteColor} />;
        },
        [colors]
    );

    return <DynamicSlider slides={slidesWithIndex} settings={settings} renderSlide={renderTestimonialSlide} />;
};

export default TestimonialsSlider;

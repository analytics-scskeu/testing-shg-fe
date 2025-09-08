"use client";

import React from "react";
import DynamicSlider from "@/components/slider/Slider";
import DOMPurify from "isomorphic-dompurify";
import { useHandleResize } from "@/hooks";
import SliderArrowButton from "@/components/slider/SliderArrowButton";

export default function SliderBlock({ ...props }) {
    const { isDesktop } = useHandleResize();
    const settings = {
        dots: props["data-show-dots"] ? JSON.parse(props["data-show-dots"]) : false,
        infinite: props["data-infinite-loop"] ? JSON.parse(props["data-infinite-loop"]) : false,
        slidesToScroll: 1,
        arrows: props["data-show-arrows"] ? JSON.parse(props["data-show-arrows"]) : false,
        swipeToSlide: true,
        draggable: true,
        swipe: true,
        touchMove: true,
        autoplay: props["data-autoplay"] ? JSON.parse(props["data-autoplay"]) : false,
        nextArrow: <SliderArrowButton arrowInside />,
        prevArrow: <SliderArrowButton arrowInside isPrev />,
        autoplaySpeed: parseInt(props["data-autoplay-speed"]),
        slidesToShow: 1,
    };

    const getBackgroundImageForSlide = (slide) => {
        if (isDesktop) {
            return slide["data-background-images"].desktop_image || slide["data-background-images"].mobile_image;
        } else {
            return slide["data-background-images"].mobile_image || slide["data-background-images"].desktop_image;
        }
    };

    const getClasses = (slide) => {
        const dataAppearance = slide["data-appearance"];
        const classes = ["flex p-8"];

        switch (dataAppearance) {
            case "collage-right":
                classes.push("items-center justify-end");
                break;
            case "collage-left":
                classes.push("items-center justify-start");
                break;
            case "collage-centered":
                classes.push("items-center justify-center");
                break;
            case "poster":
                classes.push("items-center justify-center text-center");
                break;
        }

        return classes.join(" ");
    };

    const renderSlide = (slide) => {
        return (
            <div
                className={getClasses(slide)}
                style={{
                    backgroundImage: `url("${getBackgroundImageForSlide(slide)}")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    minHeight: props.minHeight || "200px",
                }}
            >
                {slide.items?.map((item, index) => {
                    if (!item.value || item["data-element"] !== "content") return null;
                    const sanitizedHtml = DOMPurify.sanitize(item.value);
                    return (
                        <div
                            className={slide["data-appearance"] === "poster" ? "" : "max-w-[40%]"}
                            key={index}
                            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className={""}>
            <DynamicSlider slides={props.slides} settings={settings} renderSlide={renderSlide} />
        </div>
    );
}

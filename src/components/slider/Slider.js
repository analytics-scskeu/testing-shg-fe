"use client";

import Slider from "react-slick";

export default function DynamicSlider({ slides, renderSlide, settings }) {
    return (
        <Slider {...settings}>
            {slides.map((slide, index) => (
                <div key={index}>{renderSlide(slide)}</div>
            ))}
        </Slider>
    );
}

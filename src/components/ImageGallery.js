"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images.length) return null;

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Principal image */}
            <div className="border border-shade1/16 p-2 mb-8 flex items-center justify-center p-10">
                <Image
                    width="400"
                    height="400"
                    src={images[activeIndex].url}
                    alt={images[activeIndex].label}
                    className="w-full h-auto md:min-h-[400px] object-contain"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 justify-start">
                {images.map((img, index) => (
                    <Image
                        width="180"
                        height="130"
                        key={index}
                        src={img.url}
                        alt={img.label}
                        onClick={() => setActiveIndex(index)}
                        className={`w-26 h-auto border cursor-pointer ${
                            index === activeIndex ? "border-shade1" : "border-shade1/16"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

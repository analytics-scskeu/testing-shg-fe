"use client";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/api/queries/product";
import { Spinner } from "@/components/icons";
import React from "react";
import { ProductBody, ProductHeader } from "@/components/card/Product";
import Card from "@/components/card";
import SliderArrowButton from "@/components/slider/SliderArrowButton";
import DynamicSlider from "@/components/slider/Slider";

export default function ProductsBlock({ ...props }) {
    const { data: responseProducts, loading } = useQuery(GET_PRODUCTS, {
        variables: {
            currentPage: 1,
            pageSize: props.products.length + 1,
            filter: {
                sku: {
                    in: props.products,
                },
            },
        },
    });

    const appearance = props["data-appearance"];

    if (appearance === "carousel") {
        if (!responseProducts?.products?.items?.length) return null;

        const settings = {
            dots: props["data-show-dots"] ? JSON.parse(props["data-show-dots"]) : false,
            infinite: props["data-infinite-loop"] ? JSON.parse(props["data-infinite-loop"]) : false,
            slidesToScroll: 1,
            arrows: props["data-show-arrows"] ? JSON.parse(props["data-show-arrows"]) : false,
            swipeToSlide: true,
            draggable: true,
            swipe: true,
            touchMove: true,
            nextArrow: <SliderArrowButton />,
            prevArrow: <SliderArrowButton isPrev />,
            autoplaySpeed: parseInt(props["data-autoplay-speed"]),
            autoplay: props["data-autoplay"] ? JSON.parse(props["data-autoplay"]) : false,
            slidesToShow: 4,
            responsive: [
                { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 3 } },
                { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
                { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
            ],
        };

        return (
            <DynamicSlider
                slides={responseProducts?.products?.items}
                settings={settings}
                renderSlide={(item) => {
                    return (
                        <Card
                            label={"New"}
                            cardBody={<ProductBody product={item} />}
                            cardHeader={<ProductHeader product={item} />}
                        />
                    );
                }}
            />
        );
    }

    const renderProducts = () => {
        if (loading) {
            return (
                <div className="grid place-items-center absolute top-0 left-0 w-full h-full bg-primary-shade1/10 backdrop-blur-xs">
                    <Spinner />
                </div>
            );
        }

        return responseProducts?.products?.items.map((product, index) => {
            return (
                <Card
                    key={index}
                    cardHeader={<ProductHeader product={product} />}
                    cardBody={<ProductBody product={product} />}
                />
            );
        });
    };

    return (
        <div className={"relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mb-2"}>
            {renderProducts()}
        </div>
    );
}

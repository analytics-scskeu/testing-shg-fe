"use client";

import DOMPurify from "isomorphic-dompurify";

import { useHandleResize } from "@/hooks";

export default function BannerBlock({ ...props }) {
    const { isDesktop } = useHandleResize();

    const getBackgroundImage = () => {
        return isDesktop
            ? props.banner_settings["data-background-images"].desktop_image
            : props.banner_settings["data-background-images"].mobile_image;
    };

    const getClasses = () => {
        const dataApperance = props["data-appearance"];
        const classes = ["aspect-[16/9]"];

        switch (dataApperance) {
            case "collage-right":
                classes.push("text-right p-8");
                break;
            case "collage-left":
                classes.push("text-left p-8");
                break;
            case "collage-centered":
                classes.push("flex items-center justify-center p-8");
                break;
            default:
                classes.push("flex items-center text-left p-8");
                break;
        }

        return classes.join(" ");
    };

    return (
        <>
            <div
                className={getClasses()}
                style={{
                    backgroundImage: `url("${getBackgroundImage()}")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    maxHeight: 300,
                    width: "100%",
                }}
            >
                {props.banner_settings.items?.map((item, index) => {
                    const sanitizedHtml = DOMPurify.sanitize(item.value);
                    return <div key={index} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
                })}
            </div>
        </>
    );
}

"use client";

import Image from "next/image";
import { useHandleResize } from "@/hooks";
import { Link } from "@/i18n/routing";

export default function ButtonsBlock({ ...props }) {
    const { isDesktop } = useHandleResize();

    const getContainerClasses = () => {
        const classes = [];
        if (props.image_settings.width) {
            classes.push(`w-[${props.image_settings.width}px]`);
        }

        if (props.image_settings.height) {
            classes.push(`h-[${props.image_settings.height}px]`);
        }

        return classes.join(" ");
    };

    const getHref = () => {
        const linkType = props.image_settings.link_settings;

        if (!linkType) {
            return null;
        }

        switch (linkType) {
            case "product":
                return `/products/details/${props.image_settings.link_settings.sku}`;
            case "category":
                return `/products`;
            default:
                return props.image_settings.link_settings.url_path;
        }
    };

    const getImage = () => {
        return (
            <Image
                fill={true}
                sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                style={{ objectFit: "cover" }}
                src={isDesktop ? props.image_settings.scrset.desktop_image : props.image_settings.scrset.mobile_image}
                alt={props.image_settings.alt}
            />
        );
    };

    return (
        <div className={`relative w-full aspect-[16/9] ${getContainerClasses()}`}>
            {getHref() ? <Link href={getHref()}>{getImage()}</Link> : getImage()}
        </div>
    );
}

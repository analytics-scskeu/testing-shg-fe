import { escapeHTML } from "@/utils/helper";
import Image from "next/image";
import magento_logo from "@/resources/images/magento_image.webp";

export default function SearchResultCard({ item, type }) {
    switch (type) {
        case "product":
            return (
                <div className="flex gap-3 items-center">
                    <Image
                        src={item.small_image.url}
                        alt={item.small_image.label || item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    <div>
                        <span className="text-[10px] w-full">{item.sku}</span>
                        <h6 className="text-sm w-full font-medium">{item.name}</h6>
                        <div
                            className="text-[10px] w-full"
                            dangerouslySetInnerHTML={{
                                __html: escapeHTML(item.short_description.html),
                            }}
                        ></div>
                    </div>
                </div>
            );
        case "news":
            return (
                <div className="flex gap-3 items-center">
                    <Image
                        src={item.featured_img ?? magento_logo}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    <div className="">
                        <div className="flex gap-1">
                            {item?.categories?.map((category, idx) => {
                                const color = category.category_label_color || "#EC6D74";
                                return (
                                    <span
                                        key={idx}
                                        className="post-category text-[8px] py-1 px-2 border"
                                        style={{ borderColor: color, color: color }}
                                    >
                                        {category.title}
                                    </span>
                                );
                            })}
                        </div>
                        <h6 className="text-sm w-full font-medium mt-2">{item.title}</h6>
                    </div>
                </div>
            );
        case "brochure":
            return (
                <div className="flex gap-3 items-center">
                    <Image
                        src={item.small_image.url}
                        alt={item.small_image.label || item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    <div className="">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs">{item.sku}</div>
                    </div>
                </div>
            );
        case "video":
            return (
                <div className="flex gap-3 items-center">
                    <Image
                        src={item.small_image.url}
                        alt={item.small_image.label || item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div
                            className="text-[10px] w-full"
                            dangerouslySetInnerHTML={{
                                __html: escapeHTML(item.short_description.html),
                            }}
                        ></div>
                    </div>
                </div>
            );
        default:
            return null;
    }
}

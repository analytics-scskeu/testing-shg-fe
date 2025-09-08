import React, { useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const NewsCard = ({ item }) => {
    const t = useTranslations();
    const categorySpans = useMemo(() => {
        return item.categories.map((category, idx) => {
            const color = category.category_label_color || "#EC6D74";
            return (
                <span
                    key={idx}
                    className="post-category text-sm p-2 border"
                    style={{ borderColor: color, color: color }}
                >
                    {category.title}
                </span>
            );
        });
    }, [item.categories]);

    return (
        <div>
            <Link
                href={item.post_url}
                className="mx-2 md:mx-3 max-md:mb-8 md:my-10 p-4 sm:p-6 block shadow-lg max-md:shadow-xl shadow-gray-500/25 hover:shadow-lg transition duration-300 outline-2 outline-offset-[-2px] outline-transparent hover:outline-primary-shade3"
                passHref
            >
                <div className="flex flex-wrap gap-2 mb-4">{categorySpans}</div>
                <div className="bg-white">
                    <div>
                        <h3 className="mb-4 break-words text-sm md:text-2xl font-medium h-[80px] md:h-[128px] line-clamp-4 overflow-hidden">
                            {item.title}
                        </h3>
                        <p className="text-[10px] md:text-base font-normal text-body/80">
                            {t("general.published_on")} {item.publish_date}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default NewsCard;

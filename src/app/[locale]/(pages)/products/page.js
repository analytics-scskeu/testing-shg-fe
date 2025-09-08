import { serverClient } from "@/api/apolloClient";
import { GET_CATEGORY_WITH_CHILDREN } from "@/api/queries/category";
import CategoryCard from "@/components/CategoryCard";

import { getTranslations } from "next-intl/server";

import { headers } from "next/headers";

export default async function CategoriesList() {
    const h = await headers();
    const t = await getTranslations();
    const client = await serverClient(h);
    const { data } = await client.query({
        query: GET_CATEGORY_WITH_CHILDREN,
        variables: { categoryId: 3 },
    });

    const categories = data?.category?.children?.map((category) => ({
        id: category.id,
        title: category.name,
        url: category.url_path,
        image: process.env.API_ENDPOINT + category.carousel_image,
    }));

    return (
        <div className="flex flex-col items-center mt-4 sm:mt-14 mx-4 lg:mx-auto">
            <div className="flex flex-col items-start sm:items-center">
                <h1 className="mb-6 sm:mb-10 mx-2 sm:mx-0 text-lg md:text-2xl lg:text-3xl xl:text-[32px] font-medium text-shade1">
                    {t("categories.title")}
                </h1>

                <div className="flex flex-wrap justify-center w-88 sm:w-auto">
                    {categories?.map((category) => {
                        return <CategoryCard key={category.id} category={category} />;
                    })}
                </div>
            </div>
        </div>
    );
}

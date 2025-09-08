import React from "react";

import { CloudArrowDownIcon } from "@/resources/images/icons";
import { Button } from "@/components/form";
import { SvgIcon } from "@/components/icons";
import ImageGallery from "@/components/ImageGallery";
import { getTranslations } from "next-intl/server";

export default async function ProductDataSection({ product, attributes, downloads, gallery }) {
    const t = await getTranslations();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
            <div className="max-md:order-2">
                {/* Drawing */}
                <div>
                    <h3 className="text-lg md:text-2xl font-medium mb-6">{t("product.dimensional_drawing")}</h3>
                    <ImageGallery images={gallery} />
                </div>
                {/* Downloads */}
                <div className="col-span-full mt-14">
                    <h3 className="text-lg md:text-2xl font-medium mb-2">{t("product.product_download")}</h3>
                    <table className="table-auto w-full text-md">
                        <tbody>
                            {downloads.map((item, i) => (
                                <tr key={i} className="border-b border-shade1/16">
                                    <td className="py-4 font-medium"> {item.label}</td>
                                    <td className="py-4 font-medium text-right">
                                        <Button
                                            href={item.url}
                                            className="font-medium hover:underline float-right text-link min-w-auto !py-0 px-0"
                                            styling="clean"
                                            download
                                        >
                                            <SvgIcon icon={CloudArrowDownIcon} className="mr-2"></SvgIcon>Download
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Data Table */}
            <div className="max-md:order-1">
                <h3 className="text-lg md:text-2xl font-medium mb-2">{t("product.product_data")}</h3>
                <table className="table-auto w-full text-md">
                    <tbody>
                        {attributes.map((item, index) => {
                            if (!product[item.code]) {
                                return;
                            }

                            return (
                                <tr key={index} className="border-b border-shade1/16">
                                    <td className="py-4 font-medium">{item.label}</td>
                                    <td className="py-4 font-medium text-right">{product[item.code]}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

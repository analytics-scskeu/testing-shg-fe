import { DeliveryTruckIcon } from "@/resources/images/icons";
import { escapeHTML } from "@/utils/helper";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function ProductTitleTemplate({ product }) {
    return (
        <div className="flex items-center w-60 md:w-70">
            <Link href={`/products/details/${product.url_key}`}>
                <div className="w-16 h-16 md:w-18 md:h-18 relative shrink-0">
                    <Image
                        src={product?.image?.url}
                        alt={product?.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                            objectFit: "contain",
                        }}
                    />
                </div>
            </Link>
            <div className="flex flex-col ml-4">
                <div className="text-[10px] font-normal"> {product?.sku}</div>

                <Link className="my-1 text-sm font-medium" href={`/products/details/${product.url_key}`}>
                    <div className="my-1 text-sm font-medium">{product?.name}</div>
                </Link>
                <div className="text-[10px] font-normal">{escapeHTML(product?.description?.html ?? "")}</div>
                {product?.estimatedDeliveryDate && (
                    <div className="flex mt-3">
                        <DeliveryTruckIcon className="mr-2" alt="Delivery truck" />
                        <div className="text-[10px] font-normal">
                            {"Estimated Delivery: " + product?.estimatedDeliveryDate}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

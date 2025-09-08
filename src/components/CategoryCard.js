import Image from "next/image";
import { Link } from "@/i18n/routing";
import { twMerge } from "tailwind-merge";

export default function CategoryCard({ category, className }) {
    const classes = twMerge(
        `flex flex-col items-center justify-center 
        h-43 sm:h-52 lg:h-66 
        w-40 sm:w-64 lg:w-88 
        m-2 lg:m-4 p-4 bg-white shadow-xl hover:border-2 hover:border-primary-shade3`,
        className
    );
    return (
        <Link href={"/" + (category?.url ?? "")} className={classes}>
            <div
                className="
                    w-29 sm:w-36 lg:w-47.5 
                    h-18 sm:h-24 lg:h-30.25
                mb-5 sm:mb-6 lg:mb-8 relative shrink-0"
            >
                <Image
                    src={category?.image || null}
                    alt={category?.title}
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: "contain",
                    }}
                />
            </div>
            <div
                className="font-medium text-center 
                text-base sm:text-xl lg:text-2xl text-shade1"
            >
                {category?.title}
            </div>
        </Link>
    );
}

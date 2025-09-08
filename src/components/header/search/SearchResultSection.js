import { Link } from "@/i18n/routing";
import SearchResultCard from "./SearchResultCard";

export default function SearchResultSection({ title, items, viewAllLink, type }) {
    if (!items?.length) return null;

    return (
        <div className={`${items ? "last:border-b-0 last:pb-0 last:mb-0 border-b border-gray-shade4 pb-4 mb-4" : ""}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Link href={viewAllLink} className="text-sm font-medium text-link cursor-pointer">
                    View all
                </Link>
            </div>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <SearchResultCard key={index} item={item} type={type} />
                ))}
            </div>
        </div>
    );
}

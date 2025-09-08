import { SortAscIcon, SortDescIcon, SortIcon } from "@/resources/images/icons";
import { twMerge } from "tailwind-merge";

export default function HeaderTemplate({
    label,
    property,
    sortable,
    sortBy,
    setSortBy,
    isCentered = false,
    className,
}) {
    const classes = twMerge(`whitespace-nowrap ${sortable ? "cursor-pointer" : ""}`, className);
    const isCurrentlySorted = sortBy.property === property;

    const handleClick = () => {
        if (!sortable || !property) return;

        const newDirection = isCurrentlySorted && sortBy.direction === "ASC" ? "DESC" : "ASC";
        setSortBy({ property: property, direction: newDirection });
    };

    return (
        <th className={classes} onClick={handleClick}>
            <div className={`flex ${isCentered ? "justify-center" : "justify-start"} items-center`}>
                {label}
                {sortable ? (
                    isCurrentlySorted ? (
                        sortBy.direction === "ASC" ? (
                            <SortAscIcon className="ml-1.5" width={16} height={16} alt="ascending sort" />
                        ) : (
                            <SortDescIcon className="ml-1.5" width={16} height={16} alt="descending sort" />
                        )
                    ) : (
                        <SortIcon className="ml-1.5" width={16} height={16} alt="unselected sort" />
                    )
                ) : null}
            </div>
        </th>
    );
}

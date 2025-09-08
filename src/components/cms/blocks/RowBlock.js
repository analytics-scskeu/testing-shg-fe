import { twMerge } from "tailwind-merge";

export default function RowBlock({ children, ...props }) {
    const classes = twMerge(
        "py-4 mb-4 md:container mx-auto w-full",
        props["data-appearance"] === "contained" && "px-4"
    );

    const containerClasses = twMerge("max-md:px-0 px-6 md:container mx-auto w-full");

    return (
        <div className={containerClasses}>
            <div className={classes}>{children}</div>
        </div>
    );
}

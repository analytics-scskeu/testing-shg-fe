import { twMerge } from "tailwind-merge";

const align = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
};

export default function ButtonsBlock({ children, ...props }) {
    const classes = twMerge("flex flex-wrap items-center gap-2 mb-[0.625rem] mt-4", align[props.textAlign] || "");

    return <div className={classes}>{children}</div>;
}

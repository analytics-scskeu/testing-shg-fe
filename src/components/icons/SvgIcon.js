import { twMerge } from "tailwind-merge";

export default function SvgIcon({ icon, className = "", width = 24, height = 24, ...props }) {
    const Icon = icon;
    const classes = twMerge("w-6 h-6", className);

    return <Icon className={classes} width={width} height={height} {...props} />;
}

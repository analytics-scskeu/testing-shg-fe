import { twMerge } from "tailwind-merge";
import Tabs from "@/components/Tabs";

const getBorders = (borderWidth) => {
    if (!borderWidth) {
        return "";
    }
    switch (borderWidth) {
        case "1px":
            return "border-1";
        case "2px":
            return "border-2";
        case "3px":
            return "border-3";
        case "4px":
            return "border-4";
        default:
            return "border-1";
    }
};

const getMinHeight = (minHeight) => {
    if (!minHeight) {
        return "";
    }
    return `min-h-[${minHeight}px]`;
};

export default function TabsContentBlock({ ...props }) {
    const getClasses = `${getBorders(props.borderWidth)} ${getMinHeight(props.minHeight)}`;
    const classes = twMerge(getClasses);

    return <Tabs classNames={classes} tabs={[]} defaultActiveTab="product" />;
}

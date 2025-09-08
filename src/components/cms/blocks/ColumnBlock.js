export default function ColumnBlock({ children, ...props }) {
    const getClasses = () => {
        const dataAppearance = props["data-appearance"];
        const classes = [""];

        switch (dataAppearance) {
            case "align-center":
                classes.push("flex flex-col justify-center");
                break;
            case "align-bottom":
                classes.push("flex flex-col justify-end");
                break;
            case "align-top":
                classes.push("flex flex-col justify-start");
                break;
            case "full-height":
                classes.push("h-full");
                break;
        }

        return classes.join(" ");
    };

    return <div className={getClasses()}>{children}</div>;
}

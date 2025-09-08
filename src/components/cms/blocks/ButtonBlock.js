import { Button } from "@/components/form";

const types = {
    "pagebuilder-button-primary": "primary",
    "pagebuilder-button-secondary": "secondary",
    "pagebuilder-button-link": "clean",
};

export default function ButtonsBlock({ ...props }) {
    const getType = (type) => {
        return types[type] || "primary";
    };

    const getHref = () => {
        const linkType = props.link_settings.link_type;
        switch (linkType) {
            case "product":
                return `/products/details/${props.link_settings.slug}`;
            case "category":
                return `/products`;
            default:
                return props.link_settings.url_path;
        }
    };

    return (
        <Button styling={getType(props.link_settings.class)} href={getHref()} className={"min-w-0"}>
            {props.link_settings.link_text}
        </Button>
    );
}

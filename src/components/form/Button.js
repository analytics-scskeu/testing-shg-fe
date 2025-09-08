import { twMerge } from "@/utils/customTailwindMerge";
import { Link } from "@/i18n/routing";

export default function Button({
    type,
    styling = "primary",
    className,
    children,
    href,
    onClick,
    disabled = false,
    ...props
}) {
    const styles = {
        primary: `bg-gradient-to-br from-primary-shade1 via-primary-shade2 to-primary-shade3 text-white
            hover:from-primary-shade1 hover:to-primary-shade1
            disabled:from-secondary-shade1 disabled:via-secondary-shade2 disabled:to-secondary-shade3`,
        secondary: `bg-gradient-to-br from-white to-white px-6b max-md:!py-2.5 py-4b border border-primary-shade2 text-primary-shade1
            hover:from-primary-shade1 hover:via-primary-shade2 hover:to-primary-shade3 hover:text-white`,
        clean: `bg-none text-primary-shade1 shadow-none
            hover:text-primary-shade2 hover:shadow-none`,
        danger: `bg-none text-danger px-6b max-md:!py-2.5 py-4b border border-danger
            hover:bg-danger hover:text-white`,
    };

    const classes = twMerge(
        `text-base inline-flex items-center px-6 py-2.5 md:py-4 font-semibold flex justify-center items-center
        shadow-md hover:shadow-lg transition ease-in-out duration-150 cursor-pointer min-w-[170px] disabled:cursor-not-allowed`,
        styles[styling],
        className
    );

    if (href) {
        return (
            <Link href={href} className={classes} onClick={onClick} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    );
}

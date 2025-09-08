import { usePathname } from "@/i18n/routing";
import { Button } from "@/components/form";

export default function NavigationLink({ path, text }) {
    return (
        <>
            {usePathname() !== path && (
                <Button
                    href={path}
                    styling="secondary"
                    className="text-[10px] md:text-base max-md:text-[10px] text-body border-body/15 shadow-none hover:text-white hover:shadow-lg min-w-auto px-4 py-2 md:py-2 max-md:!py-2 w-max"
                >
                    <span>{text}</span>
                </Button>
            )}
            {usePathname() === path && (
                <span className="flex text-[10px] md:text-base text-body font-semibold border border-[#e8ecf4] bg-[#e8ecf4] min-w-auto px-4 py-2 w-max cursor-default">
                    {text}
                </span>
            )}
        </>
    );
}

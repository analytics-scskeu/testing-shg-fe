import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
    locales: ["en", "fr", "de", "it", "pl"],
    defaultLocale: "en",
});

export const config = {
    matcher: ["/", "/(en|fr|de|it|pl)/:path*"],
};

export const { Link, redirect, usePathname, useRouter, getPathname, permanentRedirect } = createNavigation(routing);

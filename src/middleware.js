import { NextResponse } from "next/server";
import { getCookie, getUserPermissions, getUserSession } from "@/utils/session";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { serverClient } from "@/api/apolloClient";
import { availableSubdomainLanguages, getSubdomain } from "@/utils/helper";

const intlMiddleware = createIntlMiddleware(routing);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
const protectedRoutes = ["/customer/"];
const permissionRoutes = [
    {
        route: "/customer/company/index",
        permission: "company",
    },
    {
        route: "/customer/company/user",
        permission: "users",
    },
    {
        route: "/customer/orders",
        permission: "view_price",
    },
    // {
    //     route: "/customer/company/user",
    //     permission: "roles",
    // },
    {
        route: "/customer/orders",
        permission: "orders",
    },
];

export async function middleware(request) {
    const intlResponse = intlMiddleware(request);

    /** Split path into language and the rest of the segments */
    const [, locale, ...segments] = request.nextUrl.pathname.split("/");

    /** Get Pathname without a language to check if you need authentication */
    const cleanPathname = "/" + segments.join("/");

    /** Check if the current route requires authentication */
    const isProtected = protectedRoutes.some((route) =>
        route === "/" ? ["", "/"].includes(cleanPathname) : cleanPathname.startsWith(route)
    );

    /** Check if we have a User for protected routes*/
    if (isProtected) {
        const token = await getCookie("auth_token");

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const client = await serverClient(request.headers);
        const user = await getUserSession(client);

        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        /** Check if the current route requires permissions */
        const needsPermissions = permissionRoutes.find((route) =>
            route.route === "/" ? ["", "/"].includes(cleanPathname) : cleanPathname.startsWith(route.route)
        );

        if (needsPermissions) {
            const permissions = await getUserPermissions(client, user);

            if (!permissions.includes(needsPermissions.permission)) {
                return NextResponse.redirect(new URL("/403", request.url));
            }
        }
    }

    /** Add language before to check if it is a valid language for the current subdomain */
    if (!locale || !routing.locales.includes(locale)) {
        return intlResponse;
    }

    /** Check if the current language is a valid one for this subdomain */
    const subdomain = getSubdomain(request.headers.get("x-forwarded-host") || request.headers.get("host"));
    const storeLanguages = availableSubdomainLanguages[subdomain] || ["en"];
    if (!storeLanguages.includes(locale)) {
        return NextResponse.rewrite(new URL("/404", request.url));
    }

    intlResponse.headers.set("x-locale", locale);

    return intlResponse;
}

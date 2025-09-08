import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/resources/styles/app.scss";
import RootProviders from "@/app/providers";
import { serverClient } from "@/api/apolloClient";
import { GET_AVAILABLE_STORES, GET_CONFIG_DATA, GET_STORE_CONFIG } from "@/api/queries/store";
import { getUserPermissions, getUserSession } from "@/utils/session";
import { GET_IS_GUEST_CUSTOMER } from "@/api/queries/customer";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { getLocale, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";

export const metadata = {
    title: "Sumitomo",
    description: "Sumitomo tool",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }) {
    const h = await headers();
    const client = await serverClient(h);
    const userSession = await getUserSession(client);

    const { data: responseAvailableStores } = await client.query({
        query: GET_AVAILABLE_STORES,
    });
    const { data: responseStoreConfig } = await client.query({
        query: GET_STORE_CONFIG,
    });
    const { data: responseConfigData } = await client.query({
        query: GET_CONFIG_DATA,
    });

    const initialState = {
        availableStores: responseAvailableStores.storeSelector,
        storeConfig: responseStoreConfig.storeConfig,
        config: JSON.parse(responseConfigData.RowebConfiguration.json),
        user: userSession,
        isGuest: true,
        permissions: [],
    };

    if (userSession) {
        const { data: responseIsGuest } = await client.query({
            query: GET_IS_GUEST_CUSTOMER,
        });

        initialState.isGuest = responseIsGuest.isGuestCustomer;

        initialState.permissions = await getUserPermissions(client, userSession);
    }

    const locale = await getLocale();
    setRequestLocale(locale);

    return (
        <html lang={locale}>
            <body id="html-body" className={`antialiased`}>
                <NextIntlClientProvider locale={locale}>
                    <RootProviders initialState={initialState}>{children}</RootProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

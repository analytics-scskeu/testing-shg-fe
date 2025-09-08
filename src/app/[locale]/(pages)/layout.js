import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import { headers } from "next/headers";
import { serverClient } from "@/api/apolloClient";
import { GET_MENU_DATA } from "@/api/queries/general";

export default async function RootLayout({ children }) {
    const h = await headers();
    const client = await serverClient(h);
    const { data: menu_response } = await client.query({
        query: GET_MENU_DATA,
    });

    const menu_items = JSON.parse(menu_response?.menuData?.menu_items || "{}");
    return (
        <div className="flex min-h-screen">
            <div className={`flex flex-col flex-grow min-h-screen`}>
                <Header menu_items={menu_items} />

                <main className={`flex-grow`}>{children}</main>

                <Footer />
            </div>
        </div>
    );
}

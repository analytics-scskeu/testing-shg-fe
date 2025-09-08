"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectorAvailableStores, setAvailableStores } from "@/store/config";
import { usePathname, useRouter } from "@/i18n/routing";
import { Dropdown } from "@/components/form";
import { useSearchParams } from "next/navigation";
import { availableSubdomainLanguages, getSubdomain, subDomainStore } from "@/utils/helper";

export default function LocalSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const availableStores = useSelector(selectorAvailableStores);
    const selectedWebsite = availableStores.items.find((website) => website.selected === true);
    const selectedStore = selectedWebsite.stores.find((store) => store.selected === true);

    if (!selectedWebsite || !selectedStore) {
        return null;
    }

    const onChangeWebsite = (website) => {
        const mainStore = website.stores[0];
        if (!mainStore) {
            return;
        }

        const newSubdomain = subDomainStore(website.code);

        const currentUrl = window.location;
        const domainSplit = currentUrl.hostname.split(".");
        const oldSubdomain = getSubdomain(currentUrl.hostname);

        if (oldSubdomain && newSubdomain) {
            domainSplit[0] = newSubdomain;
        } else if (oldSubdomain && !newSubdomain) {
            domainSplit.shift();
        } else if (!oldSubdomain && newSubdomain) {
            domainSplit.unshift(newSubdomain);
        }

        const storeLanguages = availableSubdomainLanguages[newSubdomain] || ["en"];
        window.location.href = `${currentUrl.protocol}//${domainSplit.join(".")}/${storeLanguages[0]}`;
    };

    const webSiteOptions = () => {
        return availableStores.items
            .filter((website) => !website.selected)
            .map((website) => {
                return {
                    label: website.display_name,
                    onClick: () => {
                        onChangeWebsite(website);
                    },
                };
            });
    };

    const languageOptions = (website) => {
        return website.stores
            .filter((store) => store.lang_code !== selectedStore.lang_code)
            .map((store) => {
                return {
                    label: (
                        <>
                            {store.image && (
                                <Image
                                    className="w-3 md:w-5 h-3 md:h-5 mr-2 inline"
                                    src={store.image}
                                    alt={store.code}
                                    width={20}
                                    height={20}
                                />
                            )}
                            {store.display_name}
                        </>
                    ),
                    onClick: () => {
                        const query = searchParams.toString();
                        const newPath = query ? `${pathname}?${query}` : pathname;

                        try {
                            router.push(newPath, { locale: store.lang_code });
                            router.refresh();

                            dispatch(
                                setAvailableStores({
                                    ...availableStores,
                                    items: availableStores.items.map((item) => ({
                                        ...item,
                                        stores: item.stores.map((itemStore) => ({
                                            ...itemStore,
                                            selected: store.lang_code === itemStore.lang_code,
                                        })),
                                    })),
                                })
                            );
                        } catch (error) {
                            console.error("Navigation error:", error);
                            window.location.href = `/${store.lang_code}${pathname}${query ? `?${query}` : ""}`;
                        }
                    },
                };
            });
    };

    const combinedSwitcherOptions = () => {
        return availableStores.items
            .filter((website) => !website.selected || website.stores.length > 1)
            .map((website) => {
                return {
                    label: website.display_name,
                    onClick: () => {
                        onChangeWebsite(website);
                    },
                    disabled: website.selected,
                    children: website.selected && languageOptions(website),
                };
            });
    };

    return (
        <>
            <div className={"hidden lg:flex lg:inline-flex ml-4"}>
                <Dropdown
                    className={"no-padding hover:bg-white text-sm"}
                    optionClasses={"font-medium"}
                    options={webSiteOptions()}
                    arrow={true}
                    text={selectedWebsite.display_name}
                ></Dropdown>
                {selectedWebsite.stores.length > 1 && (
                    <Dropdown
                        className={"no-padding hover:bg-white text-sm ml-4"}
                        options={languageOptions(selectedWebsite)}
                        arrow={true}
                        text={
                            <div>
                                <Image
                                    src={selectedStore.image}
                                    alt={selectedStore.lang_code}
                                    width={15}
                                    height={15}
                                    className="w-5 h-5 mr-1 inline"
                                />
                                {selectedStore.lang_code.toUpperCase()}
                            </div>
                        }
                    ></Dropdown>
                )}
            </div>
            <div className={"flex lg:hidden inline-flex ml-4"}>
                <Dropdown
                    className={"no-padding hover:bg-white text-sm"}
                    optionClasses={"font-medium"}
                    options={combinedSwitcherOptions()}
                    arrow={true}
                    text={
                        <div>
                            <Image
                                src={selectedStore.image}
                                alt={selectedStore.lang_code}
                                width={20}
                                height={20}
                                className="w-3 h:3 mr-1 inline"
                            />
                            {selectedWebsite.display_name}/{selectedStore.lang_code.toUpperCase()}
                        </div>
                    }
                />
            </div>
        </>
    );
}

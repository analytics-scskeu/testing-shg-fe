import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Button, Input } from "@/components/form";
import { useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_WISHLIST, DELETE_WISHLIST, GET_WISHLISTS } from "@/api/queries/wishlist";
import { Spinner } from "@/components/icons";

export default function WishlistSelector({ selected, setSelected }) {
    const t = useTranslations();

    const { data: wishlists, loading: loadingWishlists } = useQuery(GET_WISHLISTS);
    const [createWishlist, { loading: creatingWishlist }] = useMutation(CREATE_WISHLIST, {
        update(cache, { data }) {
            const newWishlist = data.createWishlist.wishlist;

            cache.updateQuery(
                {
                    query: GET_WISHLISTS,
                },
                (data) => {
                    if (!data?.customerWishlists?.items) return data;

                    return {
                        ...data,
                        customerWishlists: {
                            ...data.customerWishlists,
                            items: [newWishlist, ...data.customerWishlists.items],
                        },
                    };
                }
            );
            setCreateWishlistOpen(false);
        },
    });
    const [updateWishlist, { loading: updatingWishlist }] = useMutation(CREATE_WISHLIST, {
        update(cache, { data }) {
            const updatedWishlist = data.createWishlist.wishlist;

            cache.updateQuery(
                {
                    query: GET_WISHLISTS,
                },
                (data) => {
                    if (!data?.customerWishlists?.items) return data;

                    return {
                        ...data,
                        customerWishlists: {
                            ...data.customerWishlists,
                            items: data.customerWishlists.items.map((list) =>
                                list.wishlist_id === updatedWishlist.wishlist_id
                                    ? { ...list, name: updatedWishlist.name }
                                    : list
                            ),
                        },
                    };
                }
            );
        },
    });
    const [deleteWishlist, { loading: deletingWishlist }] = useMutation(DELETE_WISHLIST, {
        update(cache, { data }) {
            const deletedWishlist = data.deleteWishlist.wishlist_id;
            if (selected === deletedWishlist) {
                wishlists.customerWishlists.items.some((list) => {
                    if (list.wishlist_id === deletedWishlist) return false;
                    setSelected(list.wishlist_id);
                    return true;
                });
            }

            cache.updateQuery(
                {
                    query: GET_WISHLISTS,
                },
                (data) => {
                    if (!data?.customerWishlists?.items) return data;

                    return {
                        ...data,
                        customerWishlists: {
                            ...data.customerWishlists,
                            items: data.customerWishlists.items.filter((list) => list.wishlist_id !== deletedWishlist),
                        },
                    };
                }
            );
        },
    });

    const [updateWishlistOpen, setUpdateWishlistOpen] = useState(false);
    const [createWishlistOpen, setCreateWishlistOpen] = useState(false);

    useEffect(() => {
        if (wishlists?.customerWishlists.total_count) {
            setSelected(wishlists.customerWishlists.items[0].wishlist_id);
        }
    }, [wishlists, setSelected]);

    const handleWishlistSelect = (value) => {
        setSelected(value);
    };

    const handleWishlistCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const listName = formData.get("listName");
        await createWishlist({
            variables: {
                input: {
                    name: listName,
                },
            },
        });
    };

    const handleWishlistUpdate = async (value, name) => {
        await updateWishlist({
            variables: {
                input: {
                    name: value,
                    wishlist_id: parseInt(name.replace(/\D/g, "")),
                },
            },
        });
    };

    const handleWishlistDelete = async (wishlistId) => {
        await deleteWishlist({
            variables: {
                input: {
                    wishlist_id: wishlistId,
                },
            },
        });
    };

    return (
        <div className="wishlist-listing-sidebar flex flex-col shadow-md min-w-xs grow">
            <h4 className="sidebar-title text-2xl font-medium px-8 pt-8">
                <span className="block pb-6 mb-4 border-b border-gray-200">{t("customer.lists.selector.title")}</span>
            </h4>
            <section className="wishlist-list-grid">
                <div>
                    <ul className="flex justify-start flex-wrap flex-col max-h-96 overflow-y-auto relative">
                        {wishlists?.customerWishlists.items.map((list) => {
                            return (
                                <li key={list.wishlist_id} className="w-full">
                                    <article>
                                        <section
                                            className={`wishlist-title pr-8 pl-8 flex items-center relative justify-between ${
                                                selected === list.wishlist_id &&
                                                "bg-gray-50 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-primary-shade1"
                                            }`}
                                        >
                                            <div
                                                className={`w-full flex items-center relative justify-between border-b border-gray-200 ${
                                                    selected === list.wishlist_id && "border-none"
                                                }`}
                                            >
                                                <div className="relative flex grow items-center">
                                                    {updateWishlistOpen === list.wishlist_id && (
                                                        <Input
                                                            onChange={handleWishlistUpdate}
                                                            value={list.name}
                                                            name={"wishlistNameUpdate[" + list.wishlist_id + "]"}
                                                            className="my-2.5"
                                                            inputClassName="py-1"
                                                        />
                                                    )}
                                                    {updateWishlistOpen !== list.wishlist_id && (
                                                        <p
                                                            className="wishlist-title md:text-sm text-lg font-semibold cursor-pointer w-full py-4"
                                                            onClick={() => handleWishlistSelect(list.wishlist_id)}
                                                        >
                                                            {list.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {updateWishlistOpen === list.wishlist_id && (
                                                        <div
                                                            className="cursor-pointer p-1 text-indigo-600 hover:text-indigo-800 transition"
                                                            onClick={() => setUpdateWishlistOpen(false)}
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </div>
                                                    )}
                                                    {updateWishlistOpen !== list.wishlist_id && (
                                                        <>
                                                            <div
                                                                className="cursor-pointer p-1 text-indigo-600 hover:text-indigo-800 transition"
                                                                onClick={() => setUpdateWishlistOpen(list.wishlist_id)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencil} />
                                                            </div>
                                                            <div
                                                                className="cursor-pointer p-1 text-red-400 hover:text-red-600 transition"
                                                                onClick={() => handleWishlistDelete(list.wishlist_id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    </article>
                                </li>
                            );
                        })}
                        {(loadingWishlists || creatingWishlist || updatingWishlist || deletingWishlist) && (
                            <div
                                className={`grid place-items-center absolute top-0 w-full h-full py-5 backdrop-blur-xs min-h-12 ${wishlists?.customerWishlists.items && "bg-primary-shade1/10"}`}
                            >
                                <Spinner />
                            </div>
                        )}
                    </ul>
                </div>
            </section>
            <div className="create-list-btn-wrapper px-8 py-10 flex flex-col">
                <Button styling="secondary" className="mb-4" onClick={() => setCreateWishlistOpen(!createWishlistOpen)}>
                    <FontAwesomeIcon icon={faPlus} width={16} height={16} className="mr-2" />
                    {t("customer.lists.selector.new")}
                </Button>
                {createWishlistOpen && (
                    <form className="pb-5 flex flex-wrap" onSubmit={handleWishlistCreate}>
                        <Input
                            className="text-sm border-gray-300 px-3 py-2 shadow-none h-full w-full mt-0"
                            type="text"
                            name="listName"
                            placeholder={t("customer.lists.selector.name")}
                            required
                        />
                        <Button type="submit">{t("customer.lists.selector.add")}</Button>
                    </form>
                )}
            </div>
        </div>
    );
}

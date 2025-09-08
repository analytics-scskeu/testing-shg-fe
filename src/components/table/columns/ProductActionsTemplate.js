import { CartIcon, CompareIcon, HeartIcon, TrashIcon } from "@/resources/images/icons/index";
import { Button } from "@/components/form";
import QuantityModal from "@/components/QuantityModal";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function ProductActionsTemplate({
    product,
    quantity,
    setQuantity,
    addToComparedProducts,
    addToWishlist,
    removeFromList,
    addToCart,
    canAddToCart,
    isLoggedIn,
}) {
    const t = useTranslations();
    const router = useRouter();

    const [showQuantityModal, setShowQuantityModal] = useState(false);

    const handleAddToCartClick = () => {
        const currentWindowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        const isSmallToMediumScreen = currentWindowWidth < 1024;

        if (isSmallToMediumScreen) {
            setShowQuantityModal(true);
        } else {
            addToCart(product, quantity);
        }
        setQuantity(1);
    };

    return (
        <div className="flex items-center justify-center">
            {addToComparedProducts && (
                <CompareIcon
                    className="mx-2 cursor-pointer"
                    onClick={() => addToComparedProducts(product)}
                    alt="Compare products"
                    width={24}
                    height={24}
                />
            )}

            {addToWishlist && (
                <HeartIcon
                    className="mx-2 cursor-pointer"
                    onClick={() => (isLoggedIn ? addToWishlist(product) : router.push("/login"))}
                    alt="Add to wishlist"
                    width={24}
                    height={24}
                />
            )}

            {removeFromList && (
                <TrashIcon
                    className="mx-2 cursor-pointer"
                    onClick={() => (isLoggedIn ? removeFromList(product) : router.push("/login"))}
                    alt="Remove from list"
                    width={24}
                    height={24}
                />
            )}

            {addToCart && (
                <Button
                    styling="primary"
                    className="px-2 mx-2 xl:px-6 xl:py-2.5 md:py-2 sm:p-2 md:p-2 lg:p-2 min-w-auto whitespace-nowrap"
                    onClick={isLoggedIn ? handleAddToCartClick : () => router.push("/login")}
                    disabled={isLoggedIn && !canAddToCart}
                >
                    <div className="flex items-center justify-center">
                        <CartIcon className="xl:mr-2" width={24} height={24} alt="Add to cart" />
                        <div className="hidden xl:inline">{t("product.add_to_cart")}</div>
                    </div>
                </Button>
            )}

            <QuantityModal
                show={showQuantityModal}
                onClose={() => setShowQuantityModal(false)}
                onAddToCart={(quantity) => addToCart(product, quantity)}
                initialQuantity={quantity || 1}
            />
        </div>
    );
}

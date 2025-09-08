import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CartIcon, CloseIcon } from "@/resources/images/icons";
import { Button, QuantitySelector } from "./form";
import { useTranslations } from "next-intl";

export default function QuantityModal({ show, onClose, onAddToCart, initialQuantity = 1 }) {
    const t = useTranslations();
    const [quantity, setQuantity] = useState(initialQuantity);

    useEffect(() => {
        if (show) {
            setQuantity(initialQuantity);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [show, initialQuantity]);

    if (!show) {
        return null;
    }

    const handleAddToCartClick = () => {
        if (quantity > 0) {
            onAddToCart(quantity);
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/55 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-66 h-61 max-w-sm mx-auto p-6 relative">
                <CloseIcon className="absolute top-3 right-3" onClick={onClose} alt="Close" />

                <h2 className="text-base font-medium text-shade1 mb-6 text-left">{t("quantity.title")}</h2>

                <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    className="w-full h-10 mb-6"
                    inputClassName="text-sm md:text-sm font-medium"
                    buttonClassName="w-10 text-base font-semibold"
                />

                <div className="flex flex-col">
                    <Button styling="primary" className="w-full h-10" onClick={handleAddToCartClick}>
                        <CartIcon className="mr-2" width={24} height={24} alt="Add to cart" />
                        <span className="text-sm">{t("quantity.add_to_cart")}</span>
                    </Button>

                    <Button styling="clean" className="w-full pt-6 pb-0 md:pt-6 md:pb-0" onClick={onClose}>
                        <span className="text-sm font-bold">{t("quantity.cancel")}</span>
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

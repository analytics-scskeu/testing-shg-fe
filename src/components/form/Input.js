"use client";

import { twMerge } from "tailwind-merge";
import { EyeIcon, EyeOffIcon, MagnifyingGlassIcon } from "@/resources/images/icons";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { tParserValidation } from "@/utils/helper";

export default function Input({
    type = "text",
    className = "",
    name,
    value,
    required = false,
    error,
    placeholder = "",
    onlyNumbers = false,
    label = "",
    labelClassName,
    inputClassName,
    relativeContainerClassName,
    onFocus,
    onChange: handleOnChange = () => {},
    id = "",
    customIcon,
    control = null,
    autoComplete,
    disabled = false,
    blockDigits = false,
}) {
    const [stateType, setStateType] = useState(type);
    const t = useTranslations();

    const classes = twMerge(
        `block w-full font-medium p-4 border border-gray-shade2 shadow-none text-shade1
        focus:outline-none focus:ring-secondary-shade3 focus:border-secondary-shade1 focus:ring-2 text-sm md:text-base`,
        disabled && "bg-gray-shade2 cursor-not-allowed",
        stateType === "password" && "text-2xl md:text-2xl tracking-[.2em] py-3",
        stateType === "search" && "pl-10 pr-3",
        error && "border-danger-shade2 focus:ring-danger-shade2 focus:border-danger-shade2",
        inputClassName
    );

    const labelClasses = twMerge(`block font-medium text-gray-shade1 text-sm md:text-base`, labelClassName);
    const inputContainerClasses = twMerge(`relative mt-2`, className);
    const relativeContainerClasses = twMerge(`relative  ${(error && "withError") || ""}`, relativeContainerClassName);

    const showPassword = () => {
        if (stateType === "password") {
            setStateType("text");
        } else {
            setStateType("password");
        }
    };

    const onKeyDown = (e) => {
        if (onlyNumbers) {
            const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
            const isNumberKey = /^[0-9]$/.test(e.key);
            const isAllowedKey = allowedKeys.includes(e.key);

            if (!isNumberKey && !isAllowedKey) {
                e.preventDefault();
            }
        }
    };

    const renderInput = ({ onChange, ...props }) => {
        return (
            <input
                type={stateType}
                {...(id && { id })}
                name={name}
                required={required}
                className={classes}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onKeyDown={onKeyDown}
                disabled={disabled}
                onFocus={props.onFocus}
                onBeforeInput={(e) => {
                    if (blockDigits?.length) {
                        const selectionStart = e.target.selectionStart;
                        if (selectionStart < blockDigits.length) {
                            e.preventDefault();
                        }
                    }
                }}
                onChange={(e) => {
                    let newValue = e.target.value;
                    if (blockDigits?.length && !newValue.startsWith(blockDigits)) {
                        if (newValue.length < blockDigits.length) {
                            newValue = blockDigits;
                        } else {
                            let correctedValue = newValue;
                            for (let i = 0; i < blockDigits.length; i++) {
                                if (newValue[i] !== blockDigits[i]) {
                                    correctedValue = blockDigits.slice(0, i + 1) + newValue.slice(i);
                                    break;
                                }
                            }
                            newValue = correctedValue;
                        }
                        e.target.value = newValue;
                    }
                    onChange && onChange(e);
                    handleOnChange && handleOnChange(e.target.value, name, e);
                }}
                {...props}
            />
        );
    };

    return (
        <div className={relativeContainerClasses}>
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-danger-shade2"> *</span>}
                </label>
            )}
            <div className={inputContainerClasses}>
                {(control && (
                    <Controller name={name} control={control} render={({ field }) => renderInput({ ...field })} />
                )) ||
                    renderInput({ value: value, onFocus })}
                {customIcon}
                {type === "password" && (
                    <div className={"absolute py-3 px-4 right-0 top-2 cursor-pointer"} onClick={showPassword}>
                        {(stateType === "password" && <EyeIcon className={"w-5 h-5"} />) || (
                            <EyeOffIcon className={"w-5 h-5"} />
                        )}
                    </div>
                )}
                {type === "search" && (
                    <div className={"absolute left-3 top-1/2 -translate-y-1/2 -mt-[2px] cursor-pointer"}>
                        <MagnifyingGlassIcon className={"w-5 h-5"} />
                    </div>
                )}
            </div>
            {error && <p className={"text-sm text-danger-shade2"}>{tParserValidation(t, error)}</p>}
        </div>
    );
}

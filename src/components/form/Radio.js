"use client";

import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";
import { tParserValidation } from "@/utils/helper";
import { useTranslations } from "next-intl";

export default function Radio({
    name,
    required,
    className,
    error,
    value,
    onChange: handleOnChange = () => {},
    label,
    control,
    labelClassName,
    containerClassName,
    checked,
}) {
    const t = useTranslations();
    const classes = twMerge(
        `relative appearance-none rounded-xs border-2 h-4 md:h-5 w-4 md:w-5 text-primary-shade2 border-gray-shade2 accent-primary-shade2
        checked:bg-primary-shade2 checked:hover:bg-primary-shade1 checked:border-primary-shade2 checked:hover:border-primary-shade1
        after:content-['✔'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:text-xs checked:after:opacity-100 after:opacity-0`,
        error && "border-danger-shade2 accent-danger-shade2",
        className
    );

    const labelClasses = twMerge(`ml-2 text-gray-shade1 text-sm md:text-base`, labelClassName);

    const containerClasses = twMerge(`relative`, containerClassName, error && "withError");

    const renderInput = ({ onChange, value: fieldValue, ...props } = {}) => {
        return (
            <input
                onChange={(e) => {
                    onChange && onChange(value);
                    handleOnChange && handleOnChange(value, name, e);
                }}
                type="radio"
                className={classes}
                value={value}
                name={name}
                checked={typeof fieldValue !== "undefined" ? value === fieldValue : checked}
                {...props}
            />
        );
    };

    return (
        <div className={containerClasses}>
            <label className="flex items-center">
                {(control && <Controller name={name} control={control} render={({ field }) => renderInput(field)} />) ||
                    renderInput()}
                {label || required ? (
                    <span className={labelClasses}>
                        {label}
                        {required && <span className="text-danger-shade2">*</span>}
                    </span>
                ) : (
                    <></>
                )}
            </label>
            {error && <p className={"text-sm text-danger-shade2"}>{tParserValidation(t, error)}</p>}
        </div>
    );
}

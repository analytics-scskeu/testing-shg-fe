"use client";

import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { tParserValidation } from "@/utils/helper";

export default function Input({
    className = "",
    name,
    value,
    required = false,
    error,
    placeholder = "",
    label = "",
    labelClassName,
    fieldClassName,
    onChange,
    id = "",
    control = null,
    disabled = false,
}) {
    const t = useTranslations();

    const classes = twMerge(
        `block w-full font-medium p-4 border border-gray-shade2 shadow-none text-shade1
        focus:outline-none focus:ring-secondary-shade3 focus:border-secondary-shade1 focus:ring-2 text-sm md:text-base`,
        disabled && "bg-gray-shade2 cursor-not-allowed",
        fieldClassName,
        error && "border-danger-shade2 focus:ring-danger-shade2 focus:border-danger-shade2"
    );

    const labelClasses = twMerge(`block font-medium text-gray-shade1 text-sm md:text-base`, labelClassName);
    const containerClasses = twMerge(`relative mt-2`, className);

    const renderTextarea = (props) => {
        return (
            <textarea
                {...(id && { id })}
                name={name}
                required={required}
                className={classes}
                placeholder={placeholder}
                disabled={disabled}
                rows={3}
                {...props}
            />
        );
    };

    return (
        <div className={`relative ${(error && "withError") || ""}`}>
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-danger-shade2"> *</span>}
                </label>
            )}
            <div className={containerClasses}>
                {(control && (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) =>
                            renderTextarea({
                                ...field,
                                onChange: (e) => {
                                    field.onChange(e);
                                    onChange && onChange(e.target.value, name, e);
                                },
                            })
                        }
                    />
                )) ||
                    renderTextarea({
                        onChange: (e) => onChange && onChange(e.target.value, name, e),
                        value: value,
                    })}
            </div>
            {error && <p className={"text-sm text-danger-shade2"}>{tParserValidation(t, error)}</p>}
        </div>
    );
}

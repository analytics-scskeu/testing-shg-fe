"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "@/hooks";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { tParserValidation } from "@/utils/helper";
import { useTranslations } from "next-intl";

const SelectBody = ({
    name,
    value,
    className,
    label = "",
    labelClassName,
    required = false,
    options = [],
    onChange = () => {},
    disabled = false,
    emptyOption = false,
    emptyOptionText = "",
    showClear = false,
    placeholder = "",
    triggerOnChange,
    error,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const t = useTranslations();

    const selectRef = useClickOutside(() => {
        setMenuOpen(false);
    });

    const selectedLabel = value ? options.find((option) => option.value === value)?.label : "";
    const displayPlaceholder = placeholder && !selectedLabel;

    const classes = twMerge(
        `flex justify-between items-center border border-gray-shade2
        appearance-none shadow-none text-sm md:text-base text-shade1 mt-2 h-13.5 md:h-14.5 font-medium`,
        displayPlaceholder && "text-shade1/50",
        disabled
            ? "bg-gray-100 cursor-not-allowed opacity-70 focus:outline-none"
            : "cursor-pointer focus:outline-none focus:ring-secondary-shade3 focus:border-secondary-shade1 focus:ring-2",
        className,
        error && "border-danger-shade2 focus:ring-danger-shade2 focus:border-danger-shade2"
    );

    const labelClasses = twMerge(`block font-medium text-gray-shade1 text-sm md:text-base`, labelClassName);

    const handleOptionClick = (optionValue) => {
        onChange(optionValue, name);
        triggerOnChange && triggerOnChange(optionValue, name);
        setMenuOpen(false);
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        onChange(null, name);
        triggerOnChange && triggerOnChange(null, name);
        setMenuOpen(false);
    };

    return (
        <div ref={selectRef} className="relative">
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-danger-shade2"> *</span>}
                </label>
            )}
            <div
                onClick={() => !disabled && setMenuOpen((prev) => !prev)}
                className={classes}
                tabIndex={disabled ? -1 : 0}
            >
                <div className="px-4 py-3 flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                    {displayPlaceholder ? placeholder : selectedLabel}
                </div>

                <div className="flex items-center px-4 py-3">
                    {showClear && value && !disabled && (
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="h-3 w-3 pr-4 cursor-pointer text-shade1/50 hover:text-shade1/75"
                            onClick={handleClearAll}
                            aria-label="Clear selection"
                        />
                    )}

                    <FontAwesomeIcon
                        icon={menuOpen ? faChevronUp : faChevronDown}
                        className={`h-3 w-3 ${disabled ? "text-shade1/40" : "text-shade1/78"}`}
                    />
                </div>
            </div>
            {error && <p className={"text-sm text-danger-shade2"}>{tParserValidation(t, error)}</p>}

            <div
                className={`absolute bg-white top-full w-full z-20 shadow-lg border border-shade1/16 border-t-0 rounded-b-md
                    transition-all duration-300 ease-in-out transform
                    ${menuOpen && !disabled ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-2 pointer-events-none"}
                    max-h-60 overflow-y-auto ${disabled ? "pointer-events-none" : ""}`}
            >
                {emptyOption && (
                    <div
                        className={`px-4 py-2 text-shade1 ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer"}`}
                        onClick={() => {
                            if (!disabled) {
                                handleOptionClick(null);
                            }
                        }}
                    >
                        {emptyOptionText}
                    </div>
                )}

                {options.length > 0 ? (
                    options.map((option, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 text-shade1 ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer"}`}
                            onClick={() => {
                                if (!disabled) {
                                    handleOptionClick(option.value);
                                }
                            }}
                        >
                            {option.label}
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-2 text-shade1 italic">No options available</div>
                )}
            </div>
        </div>
    );
};

const Select = ({
    name,
    value,
    className,
    label = "",
    required = false,
    options = [],
    onChange = (_name, _value) => {},
    disabled = false,
    emptyOption = false,
    emptyOptionText = "",
    showClear = false,
    placeholder = "",
    labelClassName,
    control,
    error,
}) => {
    const renderSelectBody = (props) => {
        return (
            <SelectBody
                name={name}
                className={className}
                label={label}
                required={required}
                options={options}
                disabled={disabled}
                emptyOption={emptyOption}
                emptyOptionText={emptyOptionText}
                showClear={showClear}
                placeholder={placeholder}
                error={error}
                labelClassName={labelClassName}
                {...props}
            />
        );
    };

    return control ? (
        <Controller
            name={name}
            control={control}
            render={({ field }) =>
                renderSelectBody({
                    value: field.value,
                    onChange: field.onChange,
                    triggerOnChange: onChange,
                })
            }
        />
    ) : (
        renderSelectBody({
            value: value,
            onChange: onChange,
        })
    );
};

export default Select;

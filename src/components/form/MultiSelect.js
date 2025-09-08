"use client";

import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useClickOutside } from "@/hooks";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { tParserValidation } from "@/utils/helper";
import { useTranslations } from "next-intl";

const MultiSelectBody = ({
    name,
    value = [],
    className,
    label = "",
    labelClassName,
    relativeContainerClassName,
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
    maxVisibleTags = 2,
    searchable = false,
    maxSelections = Infinity,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const t = useTranslations();

    const selectRef = useClickOutside(() => {
        setMenuOpen(false);
        setSearchTerm("");
    });

    const inputRef = useRef(null);

    const selectedValues = Array.isArray(value) ? value : [];

    const selectedLabels = options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label);

    const visibleSelectedLabels = selectedLabels.slice(0, maxVisibleTags);
    const hiddenCount = selectedLabels.length - visibleSelectedLabels.length;

    const displayPlaceholder = placeholder && selectedLabels.length === 0;

    const filteredOptions =
        searchable && searchTerm
            ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
            : options;

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
    const relativeContainerClasses = twMerge(`relative  ${(error && "withError") || ""} `, relativeContainerClassName);

    const handleOptionClick = (optionValue) => {
        let newSelection;
        if (selectedValues.includes(optionValue)) {
            newSelection = selectedValues.filter((val) => val !== optionValue);
        } else {
            if (selectedValues.length < maxSelections) {
                newSelection = [...selectedValues, optionValue];
            } else {
                return;
            }
        }
        onChange(newSelection, name);
        triggerOnChange && triggerOnChange(newSelection, name);
    };

    const handleEmptyOptionClick = () => {
        onChange([], name);
        triggerOnChange && triggerOnChange([], name);
        setMenuOpen(false);
        setSearchTerm("");
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        onChange([], name);
        triggerOnChange && triggerOnChange([], name);
        setMenuOpen(false);
        setSearchTerm("");
    };

    const handleMenuToggle = () => {
        if (!disabled) {
            setMenuOpen((prev) => !prev);
            if (!menuOpen && searchable) {
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 0);
            } else {
                setSearchTerm("");
            }
        }
    };

    return (
        <div ref={selectRef} className={relativeContainerClasses}>
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-danger-shade2"> *</span>}
                </label>
            )}
            <div onClick={handleMenuToggle} className={classes} tabIndex={disabled ? -1 : 0}>
                <div className="px-4 py-3 flex-grow flex flex-nowrap overflow-hidden gap-2 items-center">
                    {displayPlaceholder
                        ? placeholder
                        : visibleSelectedLabels.map((label, index) => (
                              <span
                                  key={index}
                                  className="flex-shrink-0 bg-primary-shade3/10 text-primary-shade1 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                              >
                                  {label}
                                  <FontAwesomeIcon
                                      icon={faXmark}
                                      className="h-2.5 w-2.5 cursor-pointer text-primary-shade1 hover:text-primary-shade2"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleOptionClick(options.find((opt) => opt.label === label)?.value);
                                      }}
                                  />
                              </span>
                          ))}
                    {hiddenCount > 0 && (
                        <span className="flex-shrink-0 text-shade1/70 text-xs px-2 py-1 bg-gray-100 rounded-full">
                            +{hiddenCount} {t("multiselect.more")}
                        </span>
                    )}
                </div>

                <div className="flex items-center px-4 py-3">
                    {showClear && selectedValues.length > 0 && !disabled && (
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="h-3 w-3 pr-4 cursor-pointer text-shade1/50 hover:text-shade1/75"
                            onClick={handleClearAll}
                            aria-label="Clear all selections"
                        />
                    )}

                    <FontAwesomeIcon
                        icon={menuOpen ? faChevronUp : faChevronDown}
                        className={`h-3 w-3 ${disabled ? "text-shade1/40" : "text-shade1/78"}`}
                    />
                </div>
            </div>
            {error && <p className={"text-sm text-danger-shade2"}>{tParserValidation(t, error)}</p>}

            {searchable && (
                <div
                    className={`absolute bg-white w-full z-20 shadow-lg border border-shade1/16 rounded-b-md
                    transition-all duration-300 ease-in-out transform
                    ${menuOpen && !disabled ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-2 pointer-events-none"}`}
                >
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search options..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-shade3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}

            <div
                className={`absolute bg-white w-full z-20 shadow-lg border border-shade1/16 ${searchable ? "rounded-b-md" : "rounded-b-md border-t-0"}
                    transition-all duration-300 ease-in-out transform
                    ${menuOpen && !disabled ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-2 pointer-events-none"}
                    max-h-60 overflow-y-auto ${disabled ? "pointer-events-none" : ""}`}
                style={{ top: searchable && menuOpen ? "calc(100% + 56px)" : "100%" }}
            >
                {emptyOption && (
                    <div
                        className={`px-4 py-2 text-shade1 ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer"}`}
                        onClick={() => {
                            if (!disabled) {
                                handleEmptyOptionClick();
                            }
                        }}
                    >
                        {emptyOptionText}
                    </div>
                )}
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                        <div
                            key={option.value}
                            className={twMerge(
                                `px-4 py-2 text-shade1`,
                                disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer",
                                selectedValues.includes(option.value) && "bg-gray-200 font-semibold",
                                !selectedValues.includes(option.value) &&
                                    selectedValues.length >= maxSelections &&
                                    "opacity-50 cursor-not-allowed"
                            )}
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
                    <div className="px-4 py-2 text-shade1 italic">{t("multiselect.noOptions")}</div>
                )}
            </div>
        </div>
    );
};

const MultiSelect = ({
    name,
    value,
    className,
    relativeContainerClassName,
    label = "",
    required = false,
    options = [],
    onChange = (_name, _value) => {},
    disabled = false,
    emptyOption = false,
    emptyOptionText = "",
    showClear = false,
    placeholder = "",
    control,
    error,
    maxVisibleTags = 2,
    searchable = false,
    maxSelections = Infinity,
}) => {
    const renderMultiSelectBody = (props) => {
        return (
            <MultiSelectBody
                name={name}
                className={className}
                relativeContainerClassName={relativeContainerClassName}
                label={label}
                required={required}
                options={options}
                disabled={disabled}
                emptyOption={emptyOption}
                emptyOptionText={emptyOptionText}
                showClear={showClear}
                placeholder={placeholder}
                error={error}
                maxVisibleTags={maxVisibleTags}
                searchable={searchable}
                maxSelections={maxSelections}
                {...props}
            />
        );
    };

    return control ? (
        <Controller
            name={name}
            control={control}
            render={({ field }) =>
                renderMultiSelectBody({
                    value: field.value,
                    onChange: field.onChange,
                    triggerOnChange: onChange,
                })
            }
        />
    ) : (
        renderMultiSelectBody({
            value: value,
            onChange: onChange,
        })
    );
};

export default MultiSelect;

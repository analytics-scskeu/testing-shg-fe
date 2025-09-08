"use client";

import DatePicker, { CalendarContainer } from "react-datepicker";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { forwardRef, useRef } from "react";
import { SvgIcon } from "@/components/icons";
import { CalendarIcon } from "@/resources/images/icons";

const CustomContainer = ({ className, children }) => {
    return (
        <div className={"p-6 bg-white shadow-2xl"}>
            <CalendarContainer className={className}>{children}</CalendarContainer>
        </div>
    );
};

const CustomInput = forwardRef((props, ref) => {
    return (
        <>
            <span className={"absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"}>
                <SvgIcon icon={CalendarIcon} className={"text-primary-shade1"} />
            </span>
            <input
                {...props}
                ref={ref}
                value={props.value ? dayjs(props.value).format(props.displayformat) : ""}
                readOnly={true}
            />
        </>
    );
});
CustomInput.displayName = "CustomInput";

const DatePickerComponent = ({
    name,
    value,
    className,
    label = "",
    labelClassName,
    inputClassName,
    required = false,
    onChange = () => {},
    disabled = false,
    placeholder = "",
    valueFormat = "YYYY-MM-DD",
    displayFormat = "DD/MM/YYYY",
    error,
}) => {
    const classes = twMerge(
        `block w-full font-medium p-4 pr-10 border border-gray-shade2 shadow-none text-shade1
        focus:outline-none focus:ring-secondary-shade3 focus:border-secondary-shade1 focus:ring-2 text-sm md:text-base`,
        disabled && "bg-gray-shade2 cursor-not-allowed",
        inputClassName,
        error && "border-danger-shade2 focus:ring-danger-shade2 focus:border-danger-shade2"
    );
    const labelClasses = twMerge(`block font-medium text-gray-shade1 text-sm md:text-base`, labelClassName);
    const containerClasses = twMerge(`relative mt-2`, className);

    const inputRef = useRef(null);

    return (
        <div className={`relative ${(error && "withError") || ""}`}>
            {label && (
                <label className={labelClasses}>
                    {label}
                    {required && <span className="text-danger-shade2"> *</span>}
                </label>
            )}
            <div className={containerClasses}>
                <DatePicker
                    name={name}
                    required={required}
                    selected={value !== "" ? value : null}
                    placeholderText={placeholder}
                    className={classes}
                    isClearable
                    onChange={(value) => {
                        onChange(value ? dayjs(value).format(valueFormat) : null);
                    }}
                    customInput={<CustomInput ref={inputRef} displayformat={displayFormat} />}
                    calendarContainer={CustomContainer}
                />
            </div>
        </div>
    );
};

export default DatePickerComponent;

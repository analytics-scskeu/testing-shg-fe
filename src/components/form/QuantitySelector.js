"use client";

import Input from "@/components/form/Input";
import { twMerge } from "tailwind-merge";

export default function QuantitySelector({
    value = 1,
    min = 1,
    max = 99,
    onChange,
    disabled = false,
    className,
    inputClassName,
    buttonClassName,
    name,
    ...props
}) {
    const classes = twMerge(
        `flex items-center justify-around text-sm md:text-base border border-body/15 shadow-sm min-h`,
        className
    );
    const inputClasses = twMerge(
        `p-0 text-center border-none bg-transparent focus:!border-none shadow-none  ${disabled ? "cursor-not-allowed opacity-50" : ""}`,
        inputClassName
    );
    const buttonClasses = twMerge(`w-6 text-2xl text-center font-medium cursor-pointer select-none`, buttonClassName);

    const handleOnChange = (newValue) => {
        if (newValue >= min && newValue <= max) {
            onChange && onChange(newValue, name);
        }
    };

    return (
        <div className={classes}>
            <button
                className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleOnChange(value - 1)}
                disabled={disabled}
            >
                <div className={buttonClasses}>-</div>
            </button>
            <Input
                name={name}
                disabled={true}
                type="number"
                onlyNumbers={true}
                value={value}
                className="mt-0"
                inputClassName={inputClasses}
                {...props}
            />
            <button
                className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleOnChange(value + 1)}
                disabled={disabled}
            >
                <div className={buttonClasses}>+</div>
            </button>
        </div>
    );
}

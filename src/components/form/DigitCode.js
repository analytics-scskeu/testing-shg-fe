"use client";

import { twMerge } from "tailwind-merge";
import { useRef } from "react";

export default function DigitCode({ digits, className = "", onChange, onPaste }) {
    const inputRefs = useRef([]);

    const handleChange = (value, index) => {
        if (value.length > 1 || isNaN(value)) {
            return;
        }
        onChange && onChange(value, index);

        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        if (!onPaste) {
            return;
        }

        const pasteData = event.clipboardData.getData("text");

        const digitsArray = pasteData.match(/\d/g);

        const newDigits = [...digits];
        for (let i = 0; i < digitsArray.length && i < digits.length; i++) {
            newDigits[i] = digitsArray[i];
        }
        onPaste(newDigits);

        const lastIndex = Math.min(digitsArray.length, digits.length) - 1;
        if (inputRefs.current[lastIndex + 1]) {
            inputRefs.current[lastIndex + 1].focus();
        }
    };

    const classes = twMerge(
        `w-[65px] md:w-[72px] h-[48px] text-4xl shadow-none border-b-1 border-b-gray-shade1 font-mono text-center
        focus:outline-none focus:ring-0 focus:border-b-secondary-shade1`,
        className
    );

    return digits.map((digit, index) => (
        <div key={index} className="flex flex-col items-center w-[72px]">
            <input
                ref={(el) => (inputRefs.current[index] = el)}
                className={classes}
                value={digit}
                maxLength={1}
                inputMode={"numeric"}
                pattern="[0-9]"
                name={`digit-${index}`}
                onChange={(event) => {
                    handleChange(event.target.value, index);
                }}
                onPaste={handlePaste}
            />
        </div>
    ));
}

import React, { useMemo } from "react";
import { MATERIAL_GRADE } from "@/utils/constants";
import { twMerge } from "tailwind-merge";

const GRADE_MAP = {
    18: "P",
    19: "M",
    20: "K",
    21: "N",
    22: "S",
    23: "H",
};

const ProductGrades = ({ gradeClass, showLetter = true, className }) => {
    const classes = twMerge(`flex gap-2 font-semibold text-xs pb-6`, className);

    const normalizedGradeClass = useMemo(() => {
        if (typeof gradeClass === "string") {
            return gradeClass
                .split(",")
                .map((code) => {
                    const label = GRADE_MAP[parseInt(code.trim())];
                    return label ? { label } : null;
                })
                .filter(Boolean);
        }

        return Array.isArray(gradeClass) ? gradeClass : [];
    }, [gradeClass]);

    const renderGrades = useMemo(() => {
        return Object.keys(MATERIAL_GRADE).map((gradeKey) => {
            const isActive = normalizedGradeClass.some((g) => g.label === gradeKey);

            if (!showLetter && !isActive) {
                return null;
            }

            const gradeInfo = MATERIAL_GRADE[gradeKey];
            const bgColor = isActive ? gradeInfo.color : "transparent";
            const textColor = isActive ? "white" : "#666";
            const borderColor = isActive ? gradeInfo.color : "#ccc";

            return (
                <span
                    key={gradeKey}
                    style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        border: `1px solid ${borderColor}`,
                    }}
                    className="flex items-center justify-center w-4 md:w-5 h-4 md:h-5 text-[10px] font-bold"
                    title={gradeInfo.name}
                >
                    {gradeKey}
                </span>
            );
        });
    }, [normalizedGradeClass, showLetter]);

    if (renderGrades.length === 0) {
        return null;
    }

    return <div className={classes}>{renderGrades}</div>;
};

export default ProductGrades;

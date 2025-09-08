import { extendTailwindMerge } from "tailwind-merge";

const defaultPaddings = [
    "0",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "20",
    "24",
    "28",
    "32",
    "36",
    "40",
    "44",
    "48",
    "52",
    "56",
    "60",
    "64",
    "72",
    "80",
    "96",
    "px",
];

const customPaddings = ["1b", "2b", "3b", "4b", "5b", "6b"];

export const twMerge = extendTailwindMerge({
    override: {
        classGroups: {
            // All-sides padding (p-*)
            padding: [{ p: defaultPaddings }, { p: customPaddings }],
            // Horizontal padding (px-*)
            "padding-x": [{ px: defaultPaddings }, { px: customPaddings }],
            // Vertical padding (py-*)
            "padding-y": [{ py: defaultPaddings }, { py: customPaddings }],
            // Padding start (ps-*)
            "padding-s": [{ ps: defaultPaddings }, { ps: customPaddings }],
            // Padding end (pe-*)
            "padding-e": [{ pe: defaultPaddings }, { pe: customPaddings }],
            // Padding top (pt-*)
            "padding-t": [{ pt: defaultPaddings }, { pt: customPaddings }],
            // Padding right (pr-*)
            "padding-r": [{ pr: defaultPaddings }, { pr: customPaddings }],
            // Padding bottom (pb-*)
            "padding-b": [{ pb: defaultPaddings }, { pb: customPaddings }],
            // Padding left (pl-*)
            "padding-l": [{ pl: defaultPaddings }, { pl: customPaddings }],
        },
    },
});

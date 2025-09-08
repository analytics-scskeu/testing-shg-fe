import { twMerge } from "tailwind-merge";

export default function Arrow({ className }) {
    const classes = twMerge(`w-4 h-4 inline-block mr-1`, className);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className={classes}
            width="24"
            height="24"
            role="img"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" fill="currentColor" />
            <title>arrow-left</title>
        </svg>
    );
}

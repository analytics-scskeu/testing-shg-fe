import { twMerge } from "tailwind-merge";

export default function Spinner({ className, ...props }) {
    const classes = twMerge("animate-spin h-10 w-10 text-primary", className);

    return (
        <svg className={classes} viewBox="0 0 24 24" fill="none" {...props}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}

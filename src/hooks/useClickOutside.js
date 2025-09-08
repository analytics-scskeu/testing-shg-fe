"use client";

import { useEffect, useRef } from "react";

function useClickOutside(handler) {
    const ref = useRef(null);

    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [handler]); // Re-run effect if handler changes

    return ref;
}

export default useClickOutside;

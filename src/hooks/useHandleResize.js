"use client";

import { useEffect, useState } from "react";

// Check scroll position on mount and resize
function useHandleResize(handler) {
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const onResize = () => {
            handler && handler();
            const currentIsDesktop = window.innerWidth >= 1024;
            if (isDesktop !== currentIsDesktop) {
                setIsDesktop(currentIsDesktop);
            }
        };

        onResize();
        const handleResize = () => {
            onResize();
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [handler, isDesktop]);

    return {
        isDesktop: isDesktop,
    };
}

export default useHandleResize;

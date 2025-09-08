"use client";

import { useEffect, useRef, useState } from "react";

function useDragScroll() {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ scrollLeft: 0, scrollTop: 0, clientX: 0, clientY: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseDown = (e) => {
            if (e.button !== 0) return;

            setIsDragging(true);
            startPos.current = {
                scrollLeft: element.scrollLeft,
                scrollTop: element.scrollTop,
                clientX: e.clientX,
                clientY: e.clientY,
            };

            element.style.cursor = "grabbing";
            element.style.userSelect = "none";
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startPos.current.clientX;
            const dy = e.clientY - startPos.current.clientY;

            element.scrollTop = startPos.current.scrollTop - dy;
            element.scrollLeft = startPos.current.scrollLeft - dx;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            element.style.cursor = "grab";
            element.style.userSelect = "auto";
        };

        const handleTouchStart = (e) => {
            if (e.touches.length === 0) return;

            setIsDragging(true);
            const touch = e.touches[0];
            startPos.current = {
                scrollLeft: element.scrollLeft,
                scrollTop: element.scrollTop,
                clientX: touch.clientX,
                clientY: touch.clientY,
            };
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            if (e.touches.length === 0) return;

            const touch = e.touches[0];
            const dx = touch.clientX - startPos.current.clientX;
            const dy = touch.clientY - startPos.current.clientY;

            element.scrollTop = startPos.current.scrollTop - dy;
            element.scrollLeft = startPos.current.scrollLeft - dx;

            e.preventDefault();
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        element.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        element.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("touchcancel", handleTouchEnd);

        return () => {
            element.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);

            element.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("touchcancel", handleTouchEnd);
        };
    }, [isDragging]);

    return ref;
}

export default useDragScroll;

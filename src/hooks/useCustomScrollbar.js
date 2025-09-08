import { useEffect, useRef, useCallback, useState } from "react";

export const useCustomScrollbar = (options = {}) => {
    const {
        containerRef: externalContainerRef,
        dependencies,
        enabled = true,
        thumbColor = "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
        trackColor = "rgba(0,0,0,0.1)",
        height = 12,
        topOffset = null,
        bottomOffset = 10,
        sideOffset = 10,
    } = options;

    const scrollbarRef = useRef(null);
    const thumbRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

    const updateThumb = useCallback(() => {
        if (!externalContainerRef?.current || !scrollbarRef.current || !thumbRef.current) return;

        const container = externalContainerRef.current;
        const scrollbar = scrollbarRef.current;
        const thumb = thumbRef.current;

        const containerWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;
        const scrollLeft = container.scrollLeft;

        const needsScroll = scrollWidth > containerWidth;
        setIsScrollable(needsScroll);

        if (!needsScroll) return;

        const thumbWidth = (containerWidth / scrollWidth) * scrollbar.clientWidth;
        const maxScrollLeft = scrollWidth - containerWidth;
        const scrollPercentage = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
        const thumbPosition = scrollPercentage * (scrollbar.clientWidth - thumbWidth);

        thumb.style.width = `${Math.max(thumbWidth, 30)}px`;
        thumb.style.left = `${isNaN(thumbPosition) ? 0 : thumbPosition}px`;
    }, [externalContainerRef]);

    const handleDrag = useCallback(
        (clientX) => {
            if (!isDragging || !externalContainerRef?.current || !scrollbarRef.current || !thumbRef.current) return;

            const container = externalContainerRef.current;
            const scrollbar = scrollbarRef.current;
            const thumb = thumbRef.current;

            const deltaX = clientX - dragStart.x;
            const scrollbarWidth = scrollbar.clientWidth;
            const thumbWidth = thumb.clientWidth;
            const scrollWidth = container.scrollWidth;
            const containerWidth = container.clientWidth;
            const maxScrollLeft = scrollWidth - containerWidth;

            const scrollRatio = deltaX / (scrollbarWidth - thumbWidth);
            const newScrollLeft = dragStart.scrollLeft + scrollRatio * maxScrollLeft;

            container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
        },
        [isDragging, dragStart, externalContainerRef]
    );

    const handleMouseDown = useCallback(
        (e) => {
            if (!externalContainerRef?.current) return;

            setIsDragging(true);
            setDragStart({
                x: e.clientX,
                scrollLeft: externalContainerRef.current.scrollLeft,
            });
            e.preventDefault();
        },
        [externalContainerRef]
    );

    const handleMouseMove = useCallback(
        (e) => {
            handleDrag(e.clientX);
        },
        [handleDrag]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchStart = useCallback(
        (e) => {
            if (!externalContainerRef?.current) return;

            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX,
                scrollLeft: externalContainerRef.current.scrollLeft,
            });
            e.preventDefault();
        },
        [externalContainerRef]
    );

    const handleTouchMove = useCallback(
        (e) => {
            handleDrag(e.touches[0].clientX);
            e.preventDefault();
        },
        [handleDrag]
    );

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleScrollbarClick = useCallback(
        (e) => {
            if (!externalContainerRef?.current || !scrollbarRef.current || !thumbRef.current) return;
            if (e.target !== scrollbarRef.current) return;

            const container = externalContainerRef.current;
            const scrollbar = scrollbarRef.current;
            const thumb = thumbRef.current;

            const rect = scrollbar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const scrollbarWidth = scrollbar.clientWidth;
            const thumbWidth = thumb.clientWidth;
            const scrollWidth = container.scrollWidth;
            const containerWidth = container.clientWidth;
            const maxScrollLeft = scrollWidth - containerWidth;

            const targetPosition = (clickX - thumbWidth / 2) / (scrollbarWidth - thumbWidth);
            const targetScrollLeft = targetPosition * maxScrollLeft;

            container.scrollTo({
                left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
                behavior: "smooth",
            });
        },
        [externalContainerRef]
    );

    const handleWheel = useCallback(
        (e) => {
            if (!externalContainerRef?.current) return;

            if (e.deltaY !== 0) {
                e.preventDefault();
                const scrollAmount = e.deltaY * 2;
                externalContainerRef.current.scrollLeft += scrollAmount;
            }

            if (e.deltaX !== 0) {
                e.preventDefault();
                externalContainerRef.current.scrollLeft += e.deltaX;
            }
        },
        [externalContainerRef]
    );
    useEffect(() => {
        updateThumb();
    }, [updateThumb]);

    useEffect(() => {
        if (!enabled || !externalContainerRef?.current) return;

        const container = externalContainerRef.current;
        const scrollbar = scrollbarRef.current;
        const thumb = thumbRef.current;

        if (!container || !scrollbar || !thumb) return;

        const handleScroll = () => {
            requestAnimationFrame(updateThumb);
        };

        const handleResize = () => {
            updateThumb();
        };

        container.addEventListener("scroll", handleScroll);
        container.addEventListener("wheel", handleWheel, { passive: false });

        thumb.addEventListener("mousedown", handleMouseDown);
        thumb.addEventListener("touchstart", handleTouchStart, { passive: false });

        scrollbar.addEventListener("click", handleScrollbarClick);

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleTouchMove, { passive: false });
            document.addEventListener("touchend", handleTouchEnd);
            document.body.style.userSelect = "none";
        }

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        window.addEventListener("resize", handleResize);

        updateThumb();

        return () => {
            container.removeEventListener("scroll", handleScroll);
            container.removeEventListener("wheel", handleWheel);
            thumb.removeEventListener("mousedown", handleMouseDown);
            thumb.removeEventListener("touchstart", handleTouchStart);
            scrollbar.removeEventListener("click", handleScrollbarClick);

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
            document.body.style.userSelect = "";

            resizeObserver.disconnect();
            window.removeEventListener("resize", handleResize);
        };
    }, [
        dependencies,
        enabled,
        isDragging,
        externalContainerRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleScrollbarClick,
        handleWheel,
        updateThumb,
    ]);

    const scrollbarStyles = {
        position: "absolute",
        top: `${topOffset != null ? topOffset + "px" : ""}`,
        bottom: `${topOffset == null ? bottomOffset + "px" : ""}`,
        left: `${sideOffset}px`,
        right: `${sideOffset}px`,
        height: `${height}px`,
        backgroundColor: trackColor,
        borderRadius: `${height / 2}px`,
        cursor: "pointer",
        zIndex: 20,
        backdropFilter: "blur(5px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        opacity: isScrollable ? 1 : 0,
        pointerEvents: isScrollable ? "auto" : "none",
    };

    const thumbStyles = {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        background: thumbColor,
        borderRadius: `${height / 2}px`,
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "all 0.2s ease",
        minWidth: "30px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transform: isDragging ? "scaleY(1.1)" : "scaleY(1)",
    };

    return {
        scrollbarRef,
        thumbRef,
        isScrollable,
        isDragging,
        scrollbarStyles,
        thumbStyles,
        updateThumb,
    };
};

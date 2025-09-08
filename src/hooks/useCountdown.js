"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default function useCountdown({ time, onExpire }) {
    const [targetTime, setTargetTime] = useState(dayjs(time));
    const [remainingMs, setRemainingMs] = useState(targetTime.diff(dayjs()));

    useEffect(() => {
        if (remainingMs <= 0) return;

        const interval = setInterval(() => {
            const newRemaining = targetTime.diff(dayjs());
            setRemainingMs(newRemaining);

            if (newRemaining <= 0) {
                clearInterval(interval);
                if (typeof onExpire === "function") {
                    onExpire();
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [onExpire, remainingMs, targetTime]);

    const formatTime = () => {
        const dur = dayjs.duration(remainingMs);
        const h = dur.hours();
        const m = dur.minutes();
        const s = dur.seconds();

        return h > 0
            ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const setNewTargetTime = (newTime) => {
        setTargetTime(dayjs(newTime));
        setRemainingMs(dayjs(newTime).diff(dayjs()));
    };

    return {
        remainingMs,
        remainingTime: formatTime(),
        isExpired: remainingMs <= 0,
        reset: setNewTargetTime,
    };
}

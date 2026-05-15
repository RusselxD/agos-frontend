import { useEffect, useState } from "react";
import { getTimeAgo } from "../../../../../lib/utils/formatter";
import { useWeather } from "../../../../../context/WeatherContext";

export default function LastUpdatedInfo({ timestamp }: { timestamp: string }) {
    const { warning } = useWeather();

    const [timeAgo, setTimeAgo] = useState<string>(getTimeAgo(timestamp));

    useEffect(() => {
        setTimeAgo(getTimeAgo(timestamp));
        // Update every 60 seconds
        const intervalId = setInterval(() => {
            setTimeAgo(getTimeAgo(timestamp));
        }, 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [timestamp]);

    return (
        <div
            className={`flex flex-col justify-center gap-0.5 rounded-xl p-2.5 md:p-3 border transition-all duration-300 ${warning ? "bg-amber-100/50 dark:bg-amber-900/20 border-amber-300/50 dark:border-amber-700/30 backdrop-blur-sm" : "bg-white/40 dark:bg-white/[0.02] border-gray-200/50 dark:border-white/10 backdrop-blur-sm shadow-sm hover:dark:border-white/20"}`}
        >
            <p className="text-[0.7rem] md:text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">Last Updated</p>
            <p className="text-sm md:text-base font-semibold">{timeAgo}</p>
        </div>
    );
}

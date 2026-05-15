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
            className={`rounded-lg p-2 md:p-2.5 border ${warning ? "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50" : "bg-slate-100 dark:bg-slate-800/80 border-gray-300 dark:border-slate-700"}`}
        >
            <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">Last Updated</p>
            <p className="text-xs md:text-sm">{timeAgo}</p>
        </div>
    );
}

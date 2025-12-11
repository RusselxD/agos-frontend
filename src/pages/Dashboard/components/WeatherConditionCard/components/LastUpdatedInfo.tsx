import React, { useEffect, useState } from "react";
import type { WeatherProps } from "../WeatherConditionCard";
import getTimeAgo from "../../../../../lib/utils/getTimeAgo";

export default function LastUpdatedInfo({ weather }: WeatherProps): React.JSX.Element {
    const [timeAgo, setTimeAgo] = useState<string>(
        getTimeAgo(weather.timestamp)
    );

    useEffect(() => {
        setTimeAgo(getTimeAgo(weather.timestamp));

        // Update every 60 seconds
        const intervalId = setInterval(() => {
            setTimeAgo(getTimeAgo(weather.timestamp));
        }, 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [weather.timestamp]);

    return (
        <div className="bg-gray-100 rounded-lg p-2.5">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm">{timeAgo}</p>
        </div>
    );
};
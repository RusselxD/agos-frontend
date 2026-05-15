import React, { useEffect, useState } from "react";
import { getWeatherIcon } from "../../../lib/utils/weather";
import type { WeatherComprehensiveResponse } from "../../../types/weather";
import { Droplets, Gauge, Wind } from "lucide-react";
import { getTimeAgo } from "../../../lib/utils/formatter";

function QuickStat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (
        <div className="flex min-w-0 items-center gap-2 text-sm">
            <Icon className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
            <span className="min-w-0 flex-1 truncate text-gray-500 dark:text-slate-400">{label}</span>
            <span className="shrink-0 font-medium text-gray-700 dark:text-slate-200">{value}</span>
        </div>
    );
}

interface MainDisplayProps {
    weatherData: WeatherComprehensiveResponse;
    locationName: string;
}

export default function MainDisplay({
    weatherData,
    locationName,
}: MainDisplayProps) {
    const WeatherIcon = getWeatherIcon(weatherData.weather_code);

    // const [timeAgo, setTimeAgo] = useState("");

    const [timeAgo, setTimeAgo] = useState<string>(
        getTimeAgo(weatherData.timestamp),
    );

    useEffect(() => {
        setTimeAgo(getTimeAgo(weatherData.timestamp));
        // Update every 60 seconds
        const intervalId = setInterval(() => {
            setTimeAgo(getTimeAgo(weatherData.timestamp));
        }, 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [weatherData]);

    return (
        <div className="custom-shadow overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-4 sm:p-6 border border-gray-100 dark:border-slate-700">
            <div className="mb-5 flex items-start justify-between sm:mb-6">
                <div className="min-w-0">
                    <p className="truncate text-sm text-gray-500 dark:text-slate-400">{locationName}</p>
                    <p className="truncate text-xs text-gray-400 dark:text-slate-500">Updated {timeAgo}</p>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <WeatherIcon className="h-20 w-20 shrink-0 text-primary sm:h-24 sm:w-24" />
                <div className="min-w-0">
                    <p className="text-5xl font-light leading-none text-gray-800 dark:text-slate-100 sm:text-6xl">
                        {Math.round(weatherData.temperature_c)}°
                    </p>
                    <p className="mt-1 truncate text-xl font-medium text-gray-700 dark:text-slate-200 sm:text-2xl">
                        {weatherData.condition}
                    </p>
                    <p className="mt-1 truncate text-sm text-gray-500 dark:text-slate-400">
                        {weatherData.temperature_description} ·{" "}
                        {weatherData.cloudiness}
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 dark:border-slate-700 pt-5 sm:mt-6 sm:grid-cols-3 sm:gap-4 sm:pt-6">
                <QuickStat
                    icon={Droplets}
                    label="Precipitation"
                    value={`${weatherData.precipitation_mm.toFixed(1)} mm`}
                />
                <QuickStat
                    icon={Gauge}
                    label="Humidity"
                    value={`${weatherData.humidity_percent}%`}
                />
                <QuickStat
                    icon={Wind}
                    label="Wind"
                    value={`${weatherData.wind_speed_kmh} km/h`}
                />
            </div>
        </div>
    );
}

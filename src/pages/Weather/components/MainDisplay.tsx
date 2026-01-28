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
        <div className="flex items-center gap-2 text-sm">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-700">{value}</span>
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

    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
        if (!weatherData) return;
        const id = setInterval(
            () => setTimeAgo(getTimeAgo(weatherData.timestamp)),
            60_000,
        );
        return () => clearInterval(id);
    }, [weatherData]);

    return (
        <div className="bg-white rounded-xl custom-shadow p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">{locationName}</p>
                    <p className="text-xs text-gray-400">Updated {timeAgo}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <WeatherIcon className="w-24 h-24 text-primary" />
                <div>
                    <p className="text-6xl font-light text-gray-800">
                        {Math.round(weatherData.temperature_c)}°
                    </p>
                    <p className="text-2xl font-medium text-gray-700 mt-1">
                        {weatherData.condition}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {weatherData.temperature_description} ·{" "}
                        {weatherData.cloudiness}
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
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

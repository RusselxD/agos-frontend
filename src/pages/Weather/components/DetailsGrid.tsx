import React from "react";
import type { WeatherComprehensiveResponse } from "../../../types/weather";
import {
    Cloud,
    Droplets,
    Gauge,
    Navigation,
    Thermometer,
    Wind,
} from "lucide-react";

function DetailCard({
    icon: Icon,
    title,
    value,
    subtitle,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    subtitle: string;
}) {
    return (
        <div className="bg-white rounded-xl p-4 custom-shadow min-w-0">
            <div className="flex items-center gap-2 mb-2 min-w-0">
                <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="truncate text-sm text-gray-500">{title}</span>
            </div>
            <p className="break-words text-xl font-semibold text-gray-800">{value}</p>
            <p className="truncate text-sm text-gray-500">{subtitle}</p>
        </div>
    );
}

interface DetailsGridProps {
    weatherData: WeatherComprehensiveResponse;
}

export default function DetailsGrid({ weatherData }: DetailsGridProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <DetailCard
                icon={Thermometer}
                title="Temperature"
                value={`${weatherData.temperature_c.toFixed(1)}°C`}
                subtitle={weatherData.temperature_description}
            />
            <DetailCard
                icon={Droplets}
                title="Precipitation"
                value={`${weatherData.precipitation_mm.toFixed(1)} mm`}
                subtitle={weatherData.precipitation_description}
            />
            <DetailCard
                icon={Gauge}
                title="Humidity"
                value={`${weatherData.humidity_percent}%`}
                subtitle={weatherData.humidity_level}
            />
            <DetailCard
                icon={Wind}
                title="Wind Speed"
                value={`${weatherData.wind_speed_kmh} km/h`}
                subtitle={weatherData.wind_category}
            />
            <DetailCard
                icon={Navigation}
                title="Wind Direction"
                value={weatherData.wind_direction_label}
                subtitle={`${weatherData.wind_direction_degrees}°`}
            />
            <DetailCard
                icon={Cloud}
                title="Cloud Cover"
                value={`${weatherData.cloud_cover_percent}%`}
                subtitle={weatherData.cloudiness}
            />
        </div>
    );
}

import React from "react";
import type { WeatherComprehensiveResponse } from "../../../types/weather";
import { AlertTriangle, Smile } from "lucide-react";
import { getComfortType, getStormRiskType } from "../../../lib/utils/weather";

function StatusCard({
    icon: Icon,
    title,
    value,
    type,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    type: "good" | "moderate" | "bad";
}) {
    const colors = {
        good: "bg-emerald-50 text-emerald-700 border-emerald-200",
        moderate: "bg-amber-50 text-amber-700 border-amber-200",
        bad: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <div className={`custom-shadow rounded-xl p-4 border ${colors[type]}`}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium opacity-80">{title}</span>
            </div>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}

interface StatusRowProps {
    weatherData: WeatherComprehensiveResponse;
}

export default function StatusRow({ weatherData }: StatusRowProps) {

    console.log(weatherData)

    return (
        <div className="grid grid-cols-2 gap-3">
            <StatusCard
                icon={Smile}
                title="Comfort Level"
                value={weatherData.comfort_level}
                type={getComfortType(weatherData.comfort_level)}
            />
            <StatusCard
                icon={AlertTriangle}
                title="Storm Risk"
                value={weatherData.storm_risk_level}
                type={getStormRiskType(weatherData.storm_risk_level)}
            />
        </div>
    );
}

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
        good: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
        moderate: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
        bad: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50",
    };

    return (
        <div className={`custom-shadow min-w-0 rounded-xl border p-4 ${colors[type]}`}>
            <div className="mb-1 flex min-w-0 items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate text-sm font-medium opacity-80">
                    {title}
                </span>
            </div>
            <p className="break-words text-lg font-semibold">{value}</p>
        </div>
    );
}

interface StatusRowProps {
    weatherData: WeatherComprehensiveResponse;
}

export default function StatusRow({ weatherData }: StatusRowProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

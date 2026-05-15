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
        good: "bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30",
        moderate: "bg-amber-500/10 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30",
        bad: "bg-red-500/10 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 dark:border-red-500/30",
    };

    return (
        <div className={`backdrop-blur-md shadow-lg min-w-0 rounded-2xl border p-5 transition-all duration-300 ${colors[type]}`}>
            <div className="mb-2 flex min-w-0 items-center gap-2.5">
                <Icon className="h-5 w-5 shrink-0" />
                <span className="min-w-0 truncate text-xs font-bold uppercase tracking-widest opacity-70">
                    {title}
                </span>
            </div>
            <p className="break-words text-xl font-bold tracking-tight">{value}</p>
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

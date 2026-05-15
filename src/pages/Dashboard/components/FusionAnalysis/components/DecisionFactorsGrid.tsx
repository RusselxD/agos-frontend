import { useEffect, useState, type ReactNode } from "react";
import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { useWaterLevel } from "../../../../../context/WaterLevelContext";
import type { SensorConfig } from "../../../../../types/sensor";
import {
    capitalizeFirstLetter,
    getTimeAgo,
} from "../../../../../lib/utils/formatter";

const getWaterLevelTrendIcon = (trend: string): LucideIcon => {
    switch (trend) {
        case "rising":
            return TrendingUp;
        case "falling":
            return TrendingDown;
        case "stable":
            return Minus;
        default:
            return Minus;
    }
};

const getBlockageColors = (status: string) => {
    switch (status.toLowerCase()) {
        case "blocked":
            return "border-red-500 dark:border-red-800";
        case "partial":
            return "border-yellow-500 dark:border-yellow-700";
        case "clear":
            return "border-green-500 dark:border-emerald-800";
        default:
            return "border-gray-500 dark:border-slate-700";
    }
};

const getWeatherColors = (precipitation: number | undefined): string => {
    if (precipitation === undefined || precipitation === null) {
        return "border-gray-500 dark:border-slate-700";
    }

    if (precipitation === 0) {
        return "border-green-500 dark:border-emerald-800";
    } else if (precipitation <= 2.5) {
        return "border-blue-400 dark:border-blue-800";
    } else if (precipitation <= 10) {
        return "border-yellow-500 dark:border-yellow-700";
    } else if (precipitation <= 50) {
        return "border-orange-500 dark:border-orange-800";
    } else {
        return "border-red-500 dark:border-red-800";
    }
};

const getWaterLevelColors = (
    waterLevelCm: number,
    sensorConfig: SensorConfig | null
): string => {
    if (!sensorConfig || waterLevelCm === 0) {
        return "border-gray-500 dark:border-slate-700";
    }

    if (waterLevelCm < sensorConfig.warning_threshold) {
        return "border-green-500 dark:border-emerald-800";
    } else if (waterLevelCm < sensorConfig.critical_threshold) {
        return "border-yellow-500 dark:border-yellow-700";
    } else {
        return "border-red-500 dark:border-red-800";
    }
};

interface StatCardProps {
    title: string;
    value: string | ReactNode;
    desc?: string;
    timestamp?: string;
    className?: string;
}

const LastUpdatedInfo = ({ timestamp }: { timestamp?: string }) => {
    if (!timestamp) return null;

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
        <p className="absolute font-medium top-1.5 right-1.5 md:top-2 md:right-2 text-[0.65rem] md:text-xs text-gray-500 dark:text-slate-400">{`${
            timeAgo || "N/A"
        }`}</p>
    );
};

const StatCard = ({
    title,
    value,
    desc,
    timestamp,
    className,
}: StatCardProps) => {
    return (
        <div
            className={`border-l-4 border relative p-3 md:p-4 h-fit rounded-md ${className} dark:border-slate-700 dark:bg-slate-800/50`}
        >
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400">{title}</p>
            <div className="font-semibold text-lg md:text-xl">{value}</div>
            {desc && <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400">{desc}</p>}

            <LastUpdatedInfo timestamp={timestamp} />
        </div>
    );
};

export default function DecisionFactorsGrid() {
    const { fusionAnalysis } = useFusionAnalysis();

    const WaterLevelTrendIcon = getWaterLevelTrendIcon(
        fusionAnalysis?.water_level_status?.trend || ""
    );

    const { sensorConfig } = useWaterLevel();

    const blockageStatus = fusionAnalysis?.blockage_status?.status || "N/A";
    const precipitation = fusionAnalysis?.weather_status?.precipitation_mm;
    const waterLevelCm = fusionAnalysis?.water_level_status?.water_level_cm || 0;

    const changeRate = fusionAnalysis?.water_level_status?.change_rate;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:w-1/3">
            <StatCard
                title="Visual Status"
                value={capitalizeFirstLetter(blockageStatus)}
                className={getBlockageColors(blockageStatus)}
                timestamp={fusionAnalysis?.blockage_status?.timestamp}
            />
            <StatCard
                title="Water Level"
                value={
                    <div className="flex items-center gap-2">
                        <p>{`${waterLevelCm || 0} cm` || "N/A"}</p>
                        <WaterLevelTrendIcon size={19} />
                    </div>
                }
                className={getWaterLevelColors(waterLevelCm, sensorConfig)}
                desc={
                    changeRate !== undefined
                        ? `${changeRate} cm/min`
                        : undefined
                }
                timestamp={fusionAnalysis?.water_level_status?.timestamp}
            />
            <StatCard
                title="Weather"
                value={
                    fusionAnalysis?.weather_status?.weather_condition || "N/A"
                }
                desc={
                    precipitation !== undefined
                        ? `${precipitation.toFixed(1)} mm/h`
                        : undefined
                }
                timestamp={fusionAnalysis?.weather_status?.timestamp}
                className={getWeatherColors(precipitation)}
            />
        </div>
    );
}

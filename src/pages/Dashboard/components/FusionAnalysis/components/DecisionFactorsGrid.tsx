import type { ReactNode } from "react";
import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { useWaterLevel } from "../../../../../context/WaterLevelContext";
import type { SensorConfig } from "../../../../../types/sensor";

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
            return "border-red-500";
        case "partial":
            return "border-yellow-500";
        case "clear":
            return "border-green-500";
        default:
            return "border-gray-500";
    }
};

const getWeatherColors = (precipitation: number): string => {
    if (precipitation === 0) {
        return "border-green-500";
    } else if (precipitation <= 2.5) {
        return "border-blue-400";
    } else if (precipitation <= 10) {
        return "border-yellow-500";
    } else if (precipitation <= 50) {
        return "border-orange-500";
    } else {
        return "border-red-500";
    }
};

const getWaterLevelColors = (
    waterLevelCm: number | null,
    sensorConfig: SensorConfig | null
): string => {
    if (!sensorConfig || waterLevelCm === null) {
        return "border-gray-500";
    }

    if (waterLevelCm < sensorConfig.warning_threshold) {
        return "border-green-500";
    } else if (waterLevelCm < sensorConfig.critical_threshold) {
        return "border-yellow-500";
    } else {
        return "border-red-500";
    }
};

interface StatCardProps {
    title: string;
    value: string | ReactNode;
    desc?: string;
    className?: string;
}

const StatCard = ({ title, value, desc, className }: StatCardProps) => {
    return (
        <div className={`border-l-4 border p-4 h-fit rounded-md ${className}`}>
            <p className="text-sm text-gray-600">{title}</p>
            <div className="font-semibold text-xl">{value}</div>
            {desc && <p className="text-sm text-gray-600">{desc}</p>}
        </div>
    );
};

export default function DecisionFactorsGrid() {
    const { analysisData } = useFusionAnalysis();

    const WaterLevelTrendIcon = getWaterLevelTrendIcon(
        analysisData?.decisionFactors.water_level_trend || ""
    );

    const { sensorConfig } = useWaterLevel();

    const blockageStatus =
        analysisData?.decisionFactors.visual_analysis || "N/A";
    const precipitation =
        analysisData?.decisionFactors.weather_precipitation || 0;
    const waterLevelCm = analysisData?.decisionFactors.water_level_cm || null;

    return (
        <div className="flex flex-col gap-2 w-1/3">
            <StatCard
                title="Visual Status"
                value={blockageStatus}
                className={getBlockageColors(blockageStatus)}
            />
            <StatCard
                title="Water Level"
                value={
                    <div className="flex items-center gap-2">
                        <p>{`${waterLevelCm} cm` || "N/A"}</p>
                        <WaterLevelTrendIcon size={19} />
                    </div>
                }
                className={getWaterLevelColors(waterLevelCm, sensorConfig)}
                desc={
                    `${analysisData?.decisionFactors.water_change_rate} cm/min` ||
                    "N/A"
                }
            />
            <StatCard
                title="Weather"
                value={analysisData?.decisionFactors.weather_condition || "N/A"}
                desc={`${precipitation.toFixed(1)} mm/h` || "N/A"}
                className={getWeatherColors(precipitation)}
            />
        </div>
    );
}

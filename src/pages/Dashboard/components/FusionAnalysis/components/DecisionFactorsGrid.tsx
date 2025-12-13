import React from "react";
import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

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

interface StatCardProps {
    title: string;
    value: string | React.ReactNode;
    desc?: string;
}

const StatCard = ({ title, value, desc }: StatCardProps): React.JSX.Element => {
    return (
        <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600">{title}</p>
            <div className="font-semibold text-xl">{value}</div>
            {desc && <p className="text-sm text-gray-600">{desc}</p>}
        </div>
    );
};

export default function DecisionFactorsGrid(): React.JSX.Element {
    const { analysisData } = useFusionAnalysis();

    const WaterLevelTrendIcon = getWaterLevelTrendIcon(
        analysisData?.decisionFactors.water_level_trend || ""
    );

    return (
        <div className="grid grid-cols-3 gap-3">
            <StatCard
                title="Visual Status"
                value={analysisData?.decisionFactors.visual_analysis || "N/A"}
            />
            <StatCard
                title="Water Level"
                value={
                    <div className="flex items-center gap-2">
                        <p>
                            {`${analysisData?.decisionFactors.water_level_cm} cm` ||
                                "N/A"}
                        </p>
                        <WaterLevelTrendIcon size={19} />
                    </div>
                }
                desc={
                    `${analysisData?.decisionFactors.water_change_rate} cm/min` ||
                    "N/A"
                }
            />
            <StatCard
                title="Weather"
                value={analysisData?.decisionFactors.weather_condition || "N/A"}
                desc={
                    `${analysisData?.decisionFactors.weather_precipitation} mm/h` ||
                    "N/A"
                }
            />
        </div>
    );
}

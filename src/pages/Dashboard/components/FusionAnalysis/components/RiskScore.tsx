import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";

const getData = () => {
    const { alertThresholds, analysisData } = useFusionAnalysis();

    const normalThreshold = alertThresholds?.tier_1_max || 44;
    const warningThresholdMin = alertThresholds?.tier_2_min || 45;
    const warningThresholdMax = alertThresholds?.tier_2_max || 74;

    const combined_risk_score =
        analysisData?.fusionData.combined_risk_score || 0;

    const getBarColor = (score: number): string => {
        if (score <= normalThreshold) return "bg-emerald-500";
        if (score >= warningThresholdMin && score <= warningThresholdMax)
            return "bg-yellow-500";
        return "bg-red-500";
    };

    const getTextColor = (score: number): string => {
        if (score <= normalThreshold) return "text-emerald-600";
        if (score >= warningThresholdMin && score <= warningThresholdMax)
            return "text-yellow-600";
        return "text-red-600";
    };

    return { combined_risk_score, getBarColor, getTextColor };
};

const HeadLabels = () => {
    const { combined_risk_score, getTextColor } = getData();

    return (
        <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800">Combined Risk Score</p>
            <p
                className={`font-bold text-2xl ${getTextColor(
                    combined_risk_score
                )}`}
            >
                {combined_risk_score}
            </p>
        </div>
    );
};

const ProgressBarSegment = () => {
    const { combined_risk_score, getBarColor } = getData();

    return (
        <div className="relative bg-gray-300 rounded-full w-full h-5">
            <div
                className={`absolute transition-[width] duration-500 ease-in-out top-0 left-0 rounded-full h-5 ${getBarColor(
                    combined_risk_score
                )}`}
                style={{ width: `${combined_risk_score}%` }}
            ></div>
        </div>
    );
};

const Labels = () => {
    const { alertThresholds } = useFusionAnalysis();

    return (
        <div className="flex items-center justify-between text-sm mt-1 font-semibold">
            <p className="text-gray-800">0</p>
            <p className="text-emerald-600">{`Safe (0-${alertThresholds?.tier_1_max})`}</p>
            <p className="text-yellow-600">{`Warning (${alertThresholds?.tier_2_min}-${alertThresholds?.tier_2_max})`}</p>
            <p className="text-red-600">{`Critical (${alertThresholds?.tier_3_min}+)`}</p>
            <p className="text-gray-800">100</p>
        </div>
    );
};

export default function RiskScore() {
    return (
        <div className="rounded-lg p-4 bg-gray-100 flex flex-col gap-1">
            <HeadLabels />
            <ProgressBarSegment />
            <Labels />
        </div>
    );
}

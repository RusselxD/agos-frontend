import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { CircleCheck } from "lucide-react";

const getIconColor = (alert_tier: number): string => {
    switch (alert_tier) {
        case 1:
            return "text-emerald-700";
        case 2:
            return "text-yellow-600";
        case 3:
            return "text-red-500";
        default:
            return "text-gray-500";
    }
};

export default function TriggeredConditions() {
    const { analysisData } = useFusionAnalysis();

    const conditions = analysisData?.triggeredConditions || [];
    const alert_tier = analysisData?.fusionData.alert_tier || 0;

    return (
        <div>
            <p className="font-medium text-sm text-gray-500 mb-1">
                Triggered Conditions:
            </p>
            <ul className="space-y-1">
                {conditions.map((condition, i) => {
                    return (
                        <li key={i} className="flex items-center gap-1">
                            <CircleCheck
                                size={18}
                                className={getIconColor(alert_tier)}
                            />
                            <span className="text-gray-900">{condition}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

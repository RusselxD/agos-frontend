import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { CircleCheck } from "lucide-react";

const getIconColor = (alert_name: string): string => {
    switch (alert_name.toLowerCase()) {
        case "normal":
            return "text-emerald-700";
        case "warning":
            return "text-yellow-600";
        case "critical":
            return "text-red-500";
        default:
            return "text-gray-500";
    }
};

export default function TriggeredConditions() {
    const { fusionAnalysis } = useFusionAnalysis();

    const conditions = fusionAnalysis?.fusion_data.triggered_conditions || [];
    const alertName = fusionAnalysis?.fusion_data.alert_name || "normal";

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
                                className={getIconColor(alertName)}
                            />
                            <span className="text-gray-900">{condition}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

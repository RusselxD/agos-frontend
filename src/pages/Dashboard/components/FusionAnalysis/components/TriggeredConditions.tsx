import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { CircleCheck } from "lucide-react";

const getIconColor = (alert_name: string): string => {
    switch (alert_name.toLowerCase()) {
        case "normal":
            return "text-emerald-700 dark:text-emerald-500";
        case "warning":
            return "text-yellow-600 dark:text-yellow-500";
        case "critical":
            return "text-red-500 dark:text-red-400";
        default:
            return "text-gray-500 dark:text-slate-500";
    }
};

export default function TriggeredConditions() {
    const { fusionAnalysis } = useFusionAnalysis();

    const conditions = fusionAnalysis?.fusion_data?.triggered_conditions || [];
    const alert_name = fusionAnalysis?.fusion_data?.alert_name || "normal";

    if (conditions.length === 0) {
        return null;
    }

    return (
        <div className="rounded-xl bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-white/5 p-3 md:p-4">
            <p className="font-medium text-xs md:text-sm uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                Triggered Conditions:
            </p>
            <ul className="space-y-1">
                {conditions.map((condition: string, i: number) => {
                    return (
                        <li key={i} className="flex items-center gap-1">
                            <CircleCheck
                                className={`w-4 h-4 md:w-[18px] md:h-[18px] shrink-0 ${getIconColor(alert_name)}`}
                            />
                            <span className="text-sm md:text-base text-gray-900 dark:text-slate-300">{condition}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

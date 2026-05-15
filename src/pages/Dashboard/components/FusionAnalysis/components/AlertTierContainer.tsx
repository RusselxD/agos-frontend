import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    type LucideIcon,
} from "lucide-react";
import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";

interface TierConfig {
    [key: string]: TierDetails;
}

interface TierDetails {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: LucideIcon;
}

const tierConfig: TierConfig = {
    normal: {
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        borderColor: "border-emerald-300 dark:border-emerald-700/50",
        icon: CheckCircle,
    },
    warning: {
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-400 dark:border-yellow-700/50",
        icon: AlertTriangle,
    },
    critical: {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-400 dark:border-red-800/50",
        icon: AlertCircle,
    },
    unavailable: {
        color: "text-gray-600 dark:text-slate-400",
        bgColor: "bg-gray-50 dark:bg-slate-800/50",
        borderColor: "border-gray-300 dark:border-slate-700",
        icon: AlertCircle,
    },
    "n/a": {
        color: "text-gray-600 dark:text-slate-400",
        bgColor: "bg-gray-50 dark:bg-slate-800/50",
        borderColor: "border-gray-300 dark:border-slate-700",
        icon: CheckCircle,
    },
};

const getTierConfig = (tier: string) => {
    tier = tier?.toLowerCase();
    return tierConfig[tier] || tierConfig["n/a"];
};

export default function AlertTierContainer() {
    const { fusionAnalysis } = useFusionAnalysis();

    const alert_name = fusionAnalysis?.fusion_data?.alert_name || "N/A";

    const tierDetails = getTierConfig(alert_name);

    return (
        <div
            className={`px-3 py-3 md:px-4 md:py-4 flex rounded-lg transition-colors duration-300 ease-in-out border-2 items-center ${tierDetails.borderColor} ${tierDetails.bgColor} ${tierDetails.color}`}
        >
            <tierDetails.icon className="w-8 h-8 md:w-11 md:h-11 flex-shrink-0" />
            <div className="ml-3 md:ml-4">
                <p className="transition-colors duration-300 ease-in-out text-gray-500 dark:text-slate-400 font-medium text-sm md:text-base">
                    Alert Tier
                </p>
                <p className="transition-colors duration-300 ease-in-out font-semibold text-xl md:text-2xl">{`${alert_name}`}</p>
            </div>
        </div>
    );
}

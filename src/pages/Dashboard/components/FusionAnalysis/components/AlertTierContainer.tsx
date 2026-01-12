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
    "normal": {
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-300",
        icon: CheckCircle,
    },
    "warning": {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-400",
        icon: AlertTriangle,
    },
    "critical": {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-400",
        icon: AlertCircle,
    },
    "n/a": {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-300",
        icon: CheckCircle,
    }
};

const getTierConfig = (tier: string) => {
    tier = tier?.toLowerCase();
    return tierConfig[tier];
};

export default function AlertTierContainer() {
    const { fusionAnalysis } = useFusionAnalysis();

    const  alert_name = fusionAnalysis?.fusion_data.alert_name || "N/A";

    const tierDetails = getTierConfig(alert_name);

    return (
        <div
            className={`px-4 py-4 flex rounded-lg transition-colors duration-300 ease-in-out border-2 items-center ${tierDetails.borderColor} ${tierDetails.bgColor} ${tierDetails.color}`}
        >
            <tierDetails.icon size={45} />
            <div className="ml-4">
                <p className="transition-colors duration-300 ease-in-out text-gray-500 font-medium">
                    Alert Tier
                </p>
                <p className="transition-colors duration-300 ease-in-out font-semibold text-2xl">{`${alert_name}`}</p>
            </div>
        </div>
    );
}

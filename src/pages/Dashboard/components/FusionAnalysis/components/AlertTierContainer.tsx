import React from "react";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    type LucideIcon,
} from "lucide-react";
import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";

interface TierConfig {
    [key: number]: TierDetails;
}

interface TierDetails {
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: LucideIcon;
}

const tierConfig: TierConfig = {
    1: {
        name: "Monitoring",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-300",
        icon: CheckCircle,
    },
    2: {
        name: "Warning",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-400",
        icon: AlertTriangle,
    },
    3: {
        name: "Critical",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-400",
        icon: AlertCircle,
    },
};

const getTierConfig = (tier: number) => {
    return tierConfig[tier] ?? tierConfig[1];
};

export default function AlertTierContainer(): React.JSX.Element {
    const { analysisData } = useFusionAnalysis();

    const { alert_tier, alert_name } = analysisData?.fusionData || {};

    const tierDetails = getTierConfig(alert_tier || 1);

    return (
        <div
            className={`px-4 py-4 flex rounded-lg transition-colors duration-300 ease-in-out border-2 items-center ${tierDetails.borderColor} ${tierDetails.bgColor} ${tierDetails.color}`}
        >
            <tierDetails.icon size={45} />
            <div className="ml-4">
                <p className="transition-colors duration-300 ease-in-out text-gray-500 font-medium">
                    Alert Tier
                </p>
                <p className="transition-colors duration-300 ease-in-out font-semibold text-2xl">{`Tier ${alert_tier}: ${alert_name}`}</p>
            </div>
        </div>
    );
}

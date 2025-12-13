import { Activity } from "lucide-react";
import React from "react";
import { useFusionAnalysis } from "../../../../context/FusionAnalysisContext";
import getTimeAgo from "../../../../lib/utils/getTimeAgo";
import AlertTierContainer from "./components/AlertTierContainer";
import RiskScore from "./components/RiskScore";
import DecisionFactorsGrid from "./components/DecisionFactorsGrid";
import TriggeredConditions from "./components/TriggeredConditions";

const Header = (): React.JSX.Element => {
    const { timestamp } = useFusionAnalysis().analysisData?.fusionData ?? {
        timestamp: "",
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Activity size={18} className="text-blue-700" />
                <span className="font-semibold text-gray-500">
                    FUSION ANALYSIS
                </span>
            </div>
            <span className="text-sm text-gray-500">
                Updated {getTimeAgo(timestamp)}
            </span>
        </div>
    );
};

export default function FusionAnalysis(): React.JSX.Element {
    return (
        <div className="w-full bg-white custom-shadow border border-gray-300 rounded-md p-5 space-y-3">
            <Header />
            <AlertTierContainer />
            <RiskScore />
            <DecisionFactorsGrid />
            <TriggeredConditions />
        </div>
    );
}

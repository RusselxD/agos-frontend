import { useFusionAnalysis } from "../../../../context/FusionAnalysisContext";
import { getTimeAgo } from "../../../../lib/utils/formatter";
import AlertTierContainer from "./components/AlertTierContainer";
import RiskScore from "./components/RiskScore";
import DecisionFactorsGrid from "./components/DecisionFactorsGrid";
import TriggeredConditions from "./components/TriggeredConditions";
import Container from "../../../../components/ui/Container";

const UpdatedTimestamp = () => {
    const { timestamp } = useFusionAnalysis().analysisData?.fusionData ?? {
        timestamp: "",
    };

    return (
        <div className="text-sm text-gray-500 absolute top-0 right-5">
            {`Updated ${getTimeAgo(timestamp)}`}
        </div>
    );
};

export default function FusionAnalysis() {
    return (
        <Container headerTitle="FUSION ANALYSIS" className="space-y-5 relative">
            <UpdatedTimestamp />
            <AlertTierContainer />
            <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-5">
                    <RiskScore />
                    <TriggeredConditions />
                </div>
                <DecisionFactorsGrid />
            </div>
        </Container>
    );
}

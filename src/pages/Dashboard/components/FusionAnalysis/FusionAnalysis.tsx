import AlertTierContainer from "./components/AlertTierContainer";
import RiskScore from "./components/RiskScore";
import DecisionFactorsGrid from "./components/DecisionFactorsGrid";
import TriggeredConditions from "./components/TriggeredConditions";
import AnomalyBanner from "./components/AnomalyBanner";
import Container from "../../../../components/ui/Container";

export default function FusionAnalysis() {
    return (
        <Container headerTitle="FUSION ANALYSIS" className="space-y-5 relative">
            <AnomalyBanner />
            <AlertTierContainer />
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-5">
                    <RiskScore />
                    <TriggeredConditions />
                </div>
                <DecisionFactorsGrid />
            </div>
        </Container>
    );
}

import { CardHeaderText, ErrorCard } from "../ui/Card";
import Card from "../ui/Card";
import type { Status } from "../../../../types/blockage";
import ProgressBar from "./components/ProgressBar";
import StatusText from "./components/StatusText";
import { useWaterwayContext } from "../../../../context/BlockageContext";
import BlockageStatusCardSkeleton from "./components/BlockageStatusCardSkeleton";
import { useFusionAnalysis } from "../../../../context/FusionAnalysisContext";
import { AnomalyType } from "../../../../types/fusionAnalysis";

export const barColors = ["bg-clear", "bg-partial", "bg-blocked"];

export const getLevelCount = (status: Status | null): number => {
    switch (status) {
        case "Clear":
            return 0;
        case "Partial":
            return 1;
        case "Blocked":
            return 2;
        default:
            return 0;
    }
};

export default function BlockageStatusCard() {
    const { isFetching, error, warning: contextWarning } = useWaterwayContext();
    const { fusionAnalysis } = useFusionAnalysis();

    const isBlindCamera = fusionAnalysis?.fusion_data?.anomalies?.includes(AnomalyType.BLIND_CAMERA);
    const anomalyWarning = isBlindCamera ? "⚠️ Suspected Camera Blindness/Obscured Lens" : null;

    if (isFetching) {
        return <BlockageStatusCardSkeleton />;
    }

    if (error) {
        return <ErrorCard message={error} />;
    }

    return (
        <Card warning={anomalyWarning || contextWarning}>
            <CardHeaderText label="BLOCKAGE STATUS" />
            <StatusText />
            <ProgressBar />
        </Card>
    );
}

import Card, { ErrorCard } from "../ui/Card";
import { CardHeaderText } from "../ui/Card";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import { useWaterLevel } from "../../../../context/WaterLevelContext";
import WaterLevelStatusCardSkeleton from "./components/WaterLevelStatusCardSkeleton";
import { useFusionAnalysis } from "../../../../context/FusionAnalysisContext";
import { AnomalyType } from "../../../../types/fusionAnalysis";

export default function WaterLevelStatusCard({ className }: { className?: string }) {
    const { isFetching, isFetchingConfig, error, warning: contextWarning } = useWaterLevel();
    const { fusionAnalysis } = useFusionAnalysis();

    const anomalies = fusionAnalysis?.fusion_data?.anomalies || [];

    const getAnomalyWarning = () => {
        if (anomalies.includes(AnomalyType.OBSTRUCTED_SENSOR)) return "⚠️ Suspected Sensor Obstruction";
        if (anomalies.includes(AnomalyType.STALE_SENSOR)) return "⚠️ Stale/Frozen Sensor Reading";
        if (anomalies.includes(AnomalyType.GHOST_FLOOD)) return "⚠️ Rapid Water Rise Detected (Potential Anomaly)";
        return null;
    };

    const anomalyWarning = getAnomalyWarning();

    if (isFetchingConfig || isFetching) {
        return <WaterLevelStatusCardSkeleton className={className} />;
    }

    if (error) {
        return <ErrorCard message={error} />;
    }

    return (
        <Card className={`!justify-start bg-white dark:bg-slate-800 ${className || ""}`} warning={anomalyWarning || contextWarning}>
            <CardHeaderText label="WATER LEVEL STATUS" />
            <div className="flex h-full justify-between">
                <MainDisplay />
                <MetricCards />
            </div>
        </Card>
    );
}

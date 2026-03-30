import Card, { ErrorCard } from "../ui/Card";
import { CardHeaderText } from "../ui/Card";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import { useWaterLevel } from "../../../../context/WaterLevelContext";
import WaterLevelStatusCardSkeleton from "./components/WaterLevelStatusCardSkeleton";

export default function WaterLevelStatusCard({ className }: { className?: string }) {
    const { isFetching, isFetchingConfig, error, warning } = useWaterLevel();

    if (isFetchingConfig || isFetching) {
        return <WaterLevelStatusCardSkeleton className={className} />;
    }

    if (error) {
        return <ErrorCard message={error} />;
    }

    return (
        <Card className={`!justify-start bg-white ${className || ""}`} warning={warning}>
            <CardHeaderText label="WATER LEVEL STATUS" />
            <div className="flex h-full justify-between">
                <MainDisplay />
                <MetricCards />
            </div>
        </Card>
    );
}

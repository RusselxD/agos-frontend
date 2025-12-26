import Card from "../ui/Card";
import { CardHeaderText } from "../ui/Card";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import { useWaterLevel } from "../../../../context/WaterLevelContext";
import WaterLevelStatusCardSkeleton from "./components/WaterLevelStatusCardSkeleton";

export default function WaterLevelStatusCard() {
    const { isFetching, isFetchingConfig, error } = useWaterLevel();

    if (isFetchingConfig || isFetching) {
        return <WaterLevelStatusCardSkeleton />;
    }

    if (error) {
        return (
            <Card className="!justify-start bg-white">
                <CardHeaderText label="WATER LEVEL STATUS" />
                <p>{error}</p>
            </Card>
        );
    }

    return (
        <Card className="!justify-start bg-white">
            <CardHeaderText label="WATER LEVEL STATUS" />
            <div className="flex h-full justify-between">
                <MainDisplay />
                <MetricCards />
            </div>
        </Card>
    );
}

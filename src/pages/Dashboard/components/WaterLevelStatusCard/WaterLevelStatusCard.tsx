import React from "react";
import Card from "../ui/Card";
import CardHeaderText from "../ui/CardHeaderText";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import { useWaterLevel } from "../../../../context/WaterLevelContext";
import WaterLevelStatusCardSkeleton from "./components/WaterLevelStatusCardSkeleton";

export default function WaterLevelStatusCard(): React.JSX.Element {
    const { isFetchingData, isFetchingConfig, error } = useWaterLevel();

    if (isFetchingConfig || isFetchingData) {
        return <WaterLevelStatusCardSkeleton />;
    }

    if (error) {
        return <div>Error</div>;
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

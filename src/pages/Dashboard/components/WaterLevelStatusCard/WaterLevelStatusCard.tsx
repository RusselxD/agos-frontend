import React from "react";
import Card from "../ui/Card";
import CardHeaderText from "../ui/CardHeaderText";
import LoadingCard from "../ui/LoadingCard";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";
import { useWaterLevel } from "../../../../context/WaterLevelContext";

export default function WaterLevelStatusCard(): React.JSX.Element {
    const {
        sensorData,
        sensorConfig,
        isFetchingData,
        isFetchingConfig,
        error,
    } = useWaterLevel();

    if (isFetchingConfig || isFetchingData) {
        return (
            <LoadingCard
                className="!mb-14"
                label="WATER LEVEL STATUS"
                desc="Loading sensor data..."
            />
        );
    }

    return (
        <Card className="!justify-start bg-white">
            <CardHeaderText label="WATER LEVEL STATUS" />
            <div className="flex h-full justify-between">
                <MainDisplay
                    sensorConfig={sensorConfig}
                    sensorData={sensorData}
                />
                <MetricCards sensorData={sensorData} />
            </div>
        </Card>
    );
}

import React, { useState, useEffect, useRef } from "react";
import Card from "../ui/Card";
import CardHeaderText from "../ui/CardHeaderText";
import type { Thresholds, SensorData } from "../../../../lib/types/sensor";
import { sampleSensorAPI } from "../../../../lib/api/sensor";
import LoadingCard from "../ui/LoadingCard";
import MainDisplay from "./components/MainDisplay";
import MetricCards from "./components/MetricCards";

export default function WaterLevelStatusCard(): React.JSX.Element {
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [sensorConfig, setSensorConfig] = useState<Thresholds | null>(null);

    const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
    const [isFetchingConfig, setIsFetchingConfig] = useState<boolean>(true);

    const isFirstFetch = useRef(true);

    // Fetch config on mount
    useEffect(() => {
        const fetchSensorConfig = async () => {
            try {
                setIsFetchingConfig(true);
                const config = await sampleSensorAPI.getSensorConfig();
                setSensorConfig(config);
            } catch (error) {
            } finally {
                setIsFetchingConfig(false);
            }
        };
        fetchSensorConfig();
    }, []);

    // Fetch latest sensor data periodically
    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                if (isFirstFetch.current) {
                    setIsFetchingData(true);
                }

                const data = await sampleSensorAPI.getLatestSensorData();

                if (data) {
                    setSensorData(data);
                    isFirstFetch.current = false;
                }
            } catch (error) {
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchSensorData();

        const intervalId = setInterval(fetchSensorData, 6 * 1000); // every 60 seconds
        return () => clearInterval(intervalId);
    }, []);

    if (isFetchingConfig || isFetchingData) {
        return (
            <LoadingCard
                className="mb-14"
                label="WATER LEVEL STATUS"
                desc="Loading sensor data..."
            />
        );
    }

    return (
        <Card className="!justify-start bg-white">
            <CardHeaderText label="WATER LEVEL STATUS" />
            <div className="flex h-full justify-between">
                <MainDisplay sensorConfig={sensorConfig} sensorData={sensorData} />
                <MetricCards sensorData={sensorData} />
            </div>
        </Card>
    );
}

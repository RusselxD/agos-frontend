import React from "react";
import Card from "../ui/Card";
import CardHeaderText from "../ui/CardHeaderText";
import type { WeatherData } from "../../../../lib/types/weather";
import LoadingCard from "../ui/LoadingCard";
import WeatherCondition from "./components/WeatherCondition";
import PrecipitationInfo from "./components/PrecipitationInfo";
import LastUpdatedInfo from "./components/LastUpdatedInfo";
import { useWeather } from "../../../../context/WeatherContext";

export type WeatherProps = {
    weather: WeatherData;
};

export default function WeatherConditionCard(): React.JSX.Element {
    const { weatherData, isFetching } = useWeather();

    if (isFetching || !weatherData) {
        return (
            <LoadingCard
                label="WEATHER CONDITION"
                desc="Loading weather data..."
            />
        );
    }

    return (
        <Card>
            <CardHeaderText label="WEATHER CONDITION" />
            <WeatherCondition weather={weatherData!} />
            <div className="grid grid-cols-2 gap-2">
                <PrecipitationInfo weather={weatherData!} />
                <LastUpdatedInfo weather={weatherData!} />
            </div>
        </Card>
    );
}

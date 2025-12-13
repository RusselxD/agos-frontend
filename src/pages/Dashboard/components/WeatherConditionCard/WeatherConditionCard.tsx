import React from "react";
import Card from "../ui/Card";
import CardHeaderText from "../ui/CardHeaderText";
import type { WeatherData } from "../../../../lib/types/weather";
import WeatherCondition from "./components/WeatherCondition";
import PrecipitationInfo from "./components/PrecipitationInfo";
import LastUpdatedInfo from "./components/LastUpdatedInfo";
import { useWeather } from "../../../../context/WeatherContext";
import WeatherConditionCardSkeleton from "./components/WeatherConditionCardSkeleton";

export type WeatherProps = {
    weather: WeatherData;
};

export default function WeatherConditionCard(): React.JSX.Element {
    const { weatherData, isFetching } = useWeather();

    if (isFetching || !weatherData) {
        return (
            <WeatherConditionCardSkeleton/>
        );
    }

    return (
        <Card>
            <CardHeaderText label="WEATHER CONDITION" />
            <WeatherCondition weather={weatherData!} />
            <div className="grid grid-cols-2 gap-2">
                <PrecipitationInfo precipitation={weatherData!.precipitation} />
                <LastUpdatedInfo timestamp={weatherData!.timestamp} />
            </div>
        </Card>
    );
}

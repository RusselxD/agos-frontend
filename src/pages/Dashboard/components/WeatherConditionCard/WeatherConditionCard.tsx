import Card, { ErrorCard } from "../ui/Card";
import { CardHeaderText } from "../ui/Card";
import type { WeatherData } from "../../../../types/weather";
import WeatherCondition from "./components/WeatherCondition";
import PrecipitationInfo from "./components/PrecipitationInfo";
import LastUpdatedInfo from "./components/LastUpdatedInfo";
import { useWeather } from "../../../../context/WeatherContext";
import WeatherConditionCardSkeleton from "./components/WeatherConditionCardSkeleton";

export type WeatherProps = {
    weather: WeatherData;
};

export default function WeatherConditionCard() {
    const { weatherData, isFetching, error, warning } = useWeather();

    if (isFetching) {
        return <WeatherConditionCardSkeleton />;
    }

    if (error) {
        return <ErrorCard message={error} />;
    }

    return (
        <Card warning={warning}>
            <CardHeaderText label="WEATHER CONDITION" />
            <WeatherCondition weather={weatherData!} />
            <div className="grid grid-cols-2 gap-2">
                <PrecipitationInfo
                    precipitation_mm={weatherData!.precipitation_mm}
                />
                <LastUpdatedInfo timestamp={weatherData!.timestamp} />
            </div>
        </Card>
    );
}

import React, { useEffect, useRef, useState } from "react";
import Card from "../ui/Card";
import CardHeaderText from "../ui/CardHeaderText";
import type { WeatherData } from "../../../../lib/types/weather";
import { getCurrentLocation } from "../../../../lib/utils/getCurrentLocation";
import { fetchWeatherData } from "../../../../lib/api/weather";
import LoadingCard from "../ui/LoadingCard";
import WeatherCondition from "./components/WeatherCondition";
import PrecipitationInfo from "./components/PrecipitationInfo";
import LastUpdatedInfo from "./components/LastUpdatedInfo";

export type WeatherProps = {
    weather: WeatherData;
};

export default function WeatherConditionCard(): React.JSX.Element {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const isFirstFetch = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isFirstFetch.current) {
                    setIsFetching(true);
                }

                let latitude = 14.69;
                let longitude = 121.97;
                try {
                    const location = await getCurrentLocation();
                    latitude = location.latitude;
                    longitude = location.longitude;
                } catch (error) {}

                const weatherData: WeatherData = await fetchWeatherData({
                    latitude: latitude || 14.69,
                    longitude: longitude || 121.97,
                });

                // Update state if there is new data
                if (weatherData) {
                    setWeather(weatherData);
                    isFirstFetch.current = false;
                }
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up interval to fetch every 5 minutes
        const intervalId = setInterval(fetchData, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (isFetching || !weather) {
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
            <WeatherCondition weather={weather!} />
            <div className="grid grid-cols-2 gap-2">
                <PrecipitationInfo weather={weather!} />
                <LastUpdatedInfo weather={weather!} />
            </div>
        </Card>
    );
}

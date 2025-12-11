import React, { useEffect, useRef, useState } from "react";
import Card from "./ui/Card";
import CardHeaderText from "./ui/CardHeaderText";
import type { WeatherData } from "../../../lib/types/weather";
import { getCurrentLocation } from "../../../lib/utils/getCurrentLocation";
import { fetchWeatherData } from "../../../lib/api/weather";
import getTimeAgo from "../../../lib/utils/getTimeAgo";
import LoadingCard from "./ui/LoadingCard";

type WeatherProps = {
    weather: WeatherData;
};

const WeatherCondition = ({ weather }: WeatherProps): React.JSX.Element => {
    return (
        <div className="flex gap-2 items-center">
            <weather.icon size={40} className={weather.color} />
            <div>
                <h2 className={`font-semibold text-2xl ${weather.color}`}>
                    {weather.condition}
                </h2>
                <p className="text-sm text-gray-600">{weather.description}</p>
            </div>
        </div>
    );
};

const PrecipitationInfo = ({ weather }: WeatherProps): React.JSX.Element => {
    return (
        <div className="bg-gray-100 rounded-lg p-2.5">
            <p className="text-sm text-gray-500">Precipitation</p>
            <p className="text-sm ">
                <span>{weather.precipitation}</span>
                <span> mm</span>
            </p>
        </div>
    );
};

const LastUpdatedInfo = ({ weather }: WeatherProps): React.JSX.Element => {
    const [timeAgo, setTimeAgo] = useState<string>(
        getTimeAgo(weather.timestamp)
    );

    useEffect(() => {
        setTimeAgo(getTimeAgo(weather.timestamp));

        // Update every 60 seconds
        const intervalId = setInterval(() => {
            setTimeAgo(getTimeAgo(weather.timestamp));
        }, 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [weather.timestamp]);

    return (
        <div className="bg-gray-100 rounded-lg p-2.5">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm">{timeAgo}</p>
        </div>
    );
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

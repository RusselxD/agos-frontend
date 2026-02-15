import { useEffect, useState } from "react";
import { weatherAPI } from "../../lib/api/weather";
import type { WeatherComprehensiveResponse } from "../../types/weather";
import WeatherSkeleton from "./components/WeatherSkeleton";
import MainDisplay from "./components/MainDisplay";
import DetailsGrid from "./components/DetailsGrid";
import StatusRow from "./components/StatusRow";
import { useCoreHook } from "../../context/CoreContext";

export default function Weather() {
    const { locationDetails } = useCoreHook();
    const [weatherData, setWeatherData] =
        useState<WeatherComprehensiveResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Weather - AGOS";
        return () => {
            document.title = "AGOS";
        };
    }, []);

    useEffect(() => {
        if (!locationDetails.location_id) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await weatherAPI.getWeatherComprehensive(
                    locationDetails.location_id,
                );
                setWeatherData(res);
            } catch (error) {
                setError("Failed to load weather data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [locationDetails.location_id]);

    if (isLoading) {
        return <WeatherSkeleton />;
    }

    if (error || !weatherData) {
        return (
            <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">{error ?? "No data available."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <MainDisplay
                weatherData={weatherData}
                locationName={locationDetails.location_name}
            />

            <DetailsGrid weatherData={weatherData} />

            <StatusRow weatherData={weatherData} />
        </div>
    );
}

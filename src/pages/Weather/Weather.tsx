import { useEffect, useState } from "react";
import { weatherAPI } from "../../lib/api/weather";
import type { WeatherComprehensiveResponse } from "../../types/weather";
import { useCoreHook } from "../../context/CoreContext";
import WeatherSkeleton from "./components/WeatherSkeleton";
import MainDisplay from "./components/MainDisplay";
import DetailsGrid from "./components/DetailsGrid";
import StatusRow from "./components/StatusRow";

export default function Weather() {
    const [weatherData, setWeatherData] =
        useState<WeatherComprehensiveResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { locationDetails } = useCoreHook();

    useEffect(() => {
        document.title = "Weather - AGOS";
        return () => {
            document.title = "AGOS";
        };
    }, []);

    useEffect(() => {
        const locationId = locationDetails?.location_id;
        if (locationId == null) {
            setIsLoading(false);
            setError("No location selected.");
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res =
                    await weatherAPI.getWeatherComprehensive(locationId);
                setWeatherData(res);
            } catch {
                setError("Failed to load weather data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [locationDetails?.location_id]);

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

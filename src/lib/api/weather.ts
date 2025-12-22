import type { WeatherApiResponse, WeatherData } from "../../types/weather";
import { getWeatherInfo } from "../utils/getWeatherInfo";
import apiClient from "./axiosConfig";

export const fetchWeatherData = async ({
    sensor_id  = 1,
}: {
    sensor_id: number;
}): Promise<WeatherData> => {
    try {
        const res = await apiClient.get("/weather-condition", {
            params: {
                sensor_id: sensor_id,
            },
        });
        const weatherData: WeatherApiResponse = res.data;

        const precipitation = weatherData.precipitation;
        const weatherCode = weatherData.weather_code;

        // Get icon and description from weather code
        const weatherInfo = getWeatherInfo(weatherCode);

        // Categorize severity based on precipitation amount
        let color: string;
        let severityDescription: string;

        if (precipitation === 0) {
            color = "text-green-500";
            severityDescription = "No rainfall detected";
        } else if (precipitation <= 2.5) {
            color = "text-blue-400";
            severityDescription = "Light precipitation";
        } else if (precipitation <= 10) {
            color = "text-yellow-500";
            severityDescription = "Moderate rainfall intensity";
        } else if (precipitation <= 50) {
            color = "text-orange-500";
            severityDescription = "Heavy rainfall detected";
        } else {
            color = "text-red-500";
            severityDescription = "Extreme rainfall conditions";
        }

        return {
            condition: weatherInfo.description,
            precipitation,
            description: severityDescription,
            timestamp: new Date().toISOString(),
            icon: weatherInfo.icon,
            color,
        };
    } catch (error) {
        throw error;
    }
};

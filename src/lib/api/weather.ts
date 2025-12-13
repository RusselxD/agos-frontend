import type { WeatherData } from "../types/weather";
import { getWeatherInfo } from "../utils/getWeatherInfo";

export const fetchWeatherData = async ({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}): Promise<WeatherData> => {
    const url =
        "https://api.open-meteo.com/v1/forecast?" +
        `latitude=${latitude}&longitude=${longitude}&` +
        "current=precipitation,weather_code";

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
    }

    const data = await res.json();

    const precipitation = data.current.precipitation || 0;
    const weatherCode = data.current.weather_code;

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
};

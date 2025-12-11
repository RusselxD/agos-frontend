import {
    Cloud,
    CloudRain,
    CloudDrizzle,
    CloudSnow,
    CloudLightning,
    Sun,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { WeatherData } from "../types/weather";

// Helper function to get weather icon and condition name from weather code
const getWeatherInfo = (
    weatherCode: number
): { icon: LucideIcon; description: string } => {
    // Clear sky
    if (weatherCode === 0) return { icon: Sun, description: "Sunny" };
    if (weatherCode === 1) return { icon: Sun, description: "Mainly Clear" };

    // Cloudy
    if (weatherCode >= 2 && weatherCode <= 3)
        return { icon: Cloud, description: "Cloudy" };

    // Fog
    if (weatherCode >= 45 && weatherCode <= 48)
        return { icon: Cloud, description: "Foggy" };

    // Drizzle
    if (weatherCode >= 51 && weatherCode <= 57)
        return { icon: CloudDrizzle, description: "Drizzle" };

    // Rain
    if (weatherCode >= 61 && weatherCode <= 67)
        return { icon: CloudRain, description: "Rain" };

    // Snow
    if (weatherCode >= 71 && weatherCode <= 77)
        return { icon: CloudSnow, description: "Snow" };

    // Showers
    if (weatherCode >= 80 && weatherCode <= 82)
        return { icon: CloudRain, description: "Showers" };

    // Snow showers
    if (weatherCode >= 85 && weatherCode <= 86)
        return { icon: CloudSnow, description: "Snow Showers" };

    // Thunderstorm
    if (weatherCode >= 95 && weatherCode <= 99)
        return { icon: CloudLightning, description: "Thunderstorm" };

    // Default fallback
    return { icon: Cloud, description: "Unknown" };
};

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
        timestamp: new Date(),
        icon: weatherInfo.icon,
        color,
    };
};

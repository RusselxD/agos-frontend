import {
    Cloud,
    CloudRain,
    CloudDrizzle,
    CloudSnow,
    CloudLightning,
    Sun,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// Helper function to get weather icon and condition name from weather code
export const getWeatherInfo = (
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

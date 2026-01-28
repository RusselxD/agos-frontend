import type { LucideIcon } from "lucide-react";
import {
    Cloud,
    CloudRain,
    CloudDrizzle,
    CloudSnow,
    CloudLightning,
    Sun,
} from "lucide-react";

export const getWeatherIcon = (weatherCode: number): LucideIcon => {
    if (weatherCode === 0 || weatherCode === 1) return Sun;

    if (weatherCode >= 2 && weatherCode <= 48) return Cloud; // cloudy or foggy

    if (weatherCode >= 51 && weatherCode <= 57) return CloudDrizzle;

    if (weatherCode >= 61 && weatherCode <= 67) return CloudRain;

    if (weatherCode >= 71 && weatherCode <= 77) return CloudSnow;

    if (weatherCode >= 80 && weatherCode <= 82) return CloudRain;

    if (weatherCode >= 85 && weatherCode <= 86) return CloudSnow;

    if (weatherCode >= 95 && weatherCode <= 99) return CloudLightning;

    return Cloud;
};

export const getWeatherColor = (precipitation: number): string => {
    if (precipitation === 0) {
        return "text-green-500";
    } else if (precipitation <= 2.5) {
        return "text-blue-400";
    } else if (precipitation <= 10) {
        return "text-yellow-500";
    } else if (precipitation <= 50) {
        return "text-orange-500";
    } else {
        return "text-red-500";
    }
};

export type WeatherTierStyle = {
    border: string;
    bg: string;
    text: string;
};

export const getWeatherTierStyle = (
    precipitation: number,
): WeatherTierStyle => {
    if (precipitation === 0) {
        return {
            border: "border-emerald-400",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
        };
    }
    if (precipitation <= 2.5) {
        return {
            border: "border-blue-400",
            bg: "bg-blue-50",
            text: "text-blue-700",
        };
    }
    if (precipitation <= 10) {
        return {
            border: "border-yellow-400",
            bg: "bg-yellow-50",
            text: "text-yellow-700",
        };
    }
    if (precipitation <= 50) {
        return {
            border: "border-orange-400",
            bg: "bg-orange-50",
            text: "text-orange-700",
        };
    }
    return {
        border: "border-red-400",
        bg: "bg-red-50",
        text: "text-red-700",
    };
};

export function getComfortType(level: string): "good" | "moderate" | "bad" {
    const l = level.toLowerCase();
    if (l.includes("comfortable") || l === "cool") return "good";
    if (
        l.includes("uncomfortable") ||
        l.includes("oppressive") ||
        l.includes("heat stress")
    )
        return "bad";
    return "moderate";
}

export function getStormRiskType(level: string): "good" | "moderate" | "bad" {
    const l = level.toLowerCase();
    if (l === "none" || l === "low") return "good";
    if (l === "likely") return "bad";
    return "moderate";
}

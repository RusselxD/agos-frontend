import type { LucideIcon } from "lucide-react";
import type { SummaryResponse } from "./readingResponse";

export interface WeatherApiResponse {
    precipitation_mm: number;
    weather_code: number;
    condition: string; // e.g., "Sunny", "Rainy"
    description: string; // e.g., "Clear sky with lots of sunshine"
    timestamp: string;
}

export interface WeatherData extends WeatherApiResponse {
    icon: LucideIcon; // Proper type for Lucide icon component
    color: string; // For styling
}

export interface WeatherConditionSummaryResponse extends SummaryResponse {
    weather_condition: WeatherApiResponse;
}

export interface WeatherComprehensiveResponse {
    timestamp: string;

    precipitation_mm: number;
    weather_code: number;
    temperature_c: number;
    humidity_percent: number;
    wind_speed_kmh: number;
    wind_direction_degrees: number;
    cloud_cover_percent: number;

    condition: string;
    precipitation_description: string;
    temperature_description: string;
    humidity_level: string;
    wind_category: string;
    wind_direction_label: string;
    cloudiness: string;
    comfort_level: string;
    storm_risk_level: string;
}

import type { LucideIcon } from "lucide-react";

export interface WeatherData {
    condition: string; // e.g., "Sunny", "Rainy"
    precipitation: number;
    description: string; // e.g., "Clear sky with lots of sunshine"
    timestamp: string;
    icon: LucideIcon; // Proper type for Lucide icon component
    color: string; // For styling
}
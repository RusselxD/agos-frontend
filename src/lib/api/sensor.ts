import type { SensorData, SensorThresholds } from "../types/sensor";

export const sampleSensorAPI = {
    getSensorConfig: async (): Promise<SensorThresholds> => {
        return {
            warning_cm: 50,
            critical_cm: 80,
        } as SensorThresholds;
    },

    getLatestSensorData: async (): Promise<SensorData> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const sampleDatasets: SensorData[] = [
        // NORMAL - Low water, stable
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 25.0,
                change_rate_cm_per_min: 0.1,
                trend: "stable",
            },
            alert: {
                level: "normal",
                distance_to_warning_cm: 25.0, // 50 - 25
                distance_to_critical_cm: 55.0, // 80 - 25
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 31.25, // (25/80) * 100
            },
        },
        // NORMAL - Mid-range, rising slowly
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 35.0,
                change_rate_cm_per_min: 0.5,
                trend: "rising",
            },
            alert: {
                level: "normal",
                distance_to_warning_cm: 15.0, // 50 - 35
                distance_to_critical_cm: 45.0, // 80 - 35
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 43.75, // (35/80) * 100
            },
        },
        // NORMAL - Falling from higher level
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 42.0,
                change_rate_cm_per_min: -0.8,
                trend: "falling",
            },
            alert: {
                level: "normal",
                distance_to_warning_cm: 8.0, // 50 - 42
                distance_to_critical_cm: 38.0, // 80 - 42
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 52.5, // (42/80) * 100
            },
        },
        // NORMAL - Very close to warning
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 48.0,
                change_rate_cm_per_min: 0.3,
                trend: "rising",
            },
            alert: {
                level: "normal",
                distance_to_warning_cm: 2.0, // 50 - 48
                distance_to_critical_cm: 32.0, // 80 - 48
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 60.0, // (48/80) * 100
            },
        },
        // WARNING - Just entered warning zone
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 52.0,
                change_rate_cm_per_min: 0.6,
                trend: "rising",
            },
            alert: {
                level: "warning",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 28.0, // 80 - 52
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 65.0, // (52/80) * 100
            },
        },
        // WARNING - Mid warning zone, rising
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 63.0,
                change_rate_cm_per_min: 1.2,
                trend: "rising",
            },
            alert: {
                level: "warning",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 17.0, // 80 - 63
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 78.75, // (63/80) * 100
            },
        },
        // WARNING - High warning, approaching critical
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 74.0,
                change_rate_cm_per_min: 1.8,
                trend: "rising",
            },
            alert: {
                level: "warning",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 6.0, // 80 - 74
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 92.5, // (74/80) * 100
            },
        },
        // WARNING - Stable in warning zone
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 58.0,
                change_rate_cm_per_min: 0.2,
                trend: "stable",
            },
            alert: {
                level: "warning",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 22.0, // 80 - 58
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 72.5, // (58/80) * 100
            },
        },
        // WARNING - Falling but still in warning
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 67.0,
                change_rate_cm_per_min: -0.7,
                trend: "falling",
            },
            alert: {
                level: "warning",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 13.0, // 80 - 67
                distance_from_critical_cm: 0.0,
                percentage_of_critical: 83.75, // (67/80) * 100
            },
        },
        // CRITICAL - Just hit critical threshold
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 80.0,
                change_rate_cm_per_min: 1.5,
                trend: "rising",
            },
            alert: {
                level: "critical",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 0.0,
                distance_from_critical_cm: 0.0, // 80 - 80
                percentage_of_critical: 100.0, // (80/80) * 100
            },
        },
        // CRITICAL - Slightly above critical
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 85.0,
                change_rate_cm_per_min: 2.0,
                trend: "rising",
            },
            alert: {
                level: "critical",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 0.0,
                distance_from_critical_cm: 5.0, // 85 - 80
                percentage_of_critical: 106.25, // (85/80) * 100
            },
        },
        // CRITICAL - Moderate overflow
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 92.0,
                change_rate_cm_per_min: 2.5,
                trend: "rising",
            },
            alert: {
                level: "critical",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 0.0,
                distance_from_critical_cm: 12.0, // 92 - 80
                percentage_of_critical: 115.0, // (92/80) * 100
            },
        },
        // CRITICAL - Severe overflow
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 105.0,
                change_rate_cm_per_min: 3.2,
                trend: "rising",
            },
            alert: {
                level: "critical",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 0.0,
                distance_from_critical_cm: 25.0, // 105 - 80
                percentage_of_critical: 131.25, // (105/80) * 100
            },
        },
        // CRITICAL - Extreme overflow
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 118.0,
                change_rate_cm_per_min: 4.0,
                trend: "rising",
            },
            alert: {
                level: "critical",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 0.0,
                distance_from_critical_cm: 38.0, // 118 - 80
                percentage_of_critical: 147.5, // (118/80) * 100
            },
        },
        // CRITICAL - Falling but still critical
        {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 88.0,
                change_rate_cm_per_min: -1.2,
                trend: "falling",
            },
            alert: {
                level: "critical",
                distance_to_warning_cm: 0.0,
                distance_to_critical_cm: 0.0,
                distance_from_critical_cm: 8.0, // 88 - 80
                percentage_of_critical: 110.0, // (88/80) * 100
            },
        },
    ];

    // Return random dataset
    const randomIndex = Math.floor(Math.random() * sampleDatasets.length);
    return sampleDatasets[randomIndex];
},
};

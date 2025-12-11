import type { SensorData, Thresholds } from "../types/sensor";

export const sampleSensorAPI = {
    
    getSensorConfig: async (): Promise<Thresholds> => {
        return {
            warning_cm: 50,
            critical_cm: 80,
        } as Thresholds;
    },

    getLatestSensorData: async (): Promise<SensorData> => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const samplePayload: SensorData = {
            timestamp: new Date().toISOString(),
            waterLevel: {
                current_cm: 65.0,
                change_rate_cm_per_min: 0.5,
                trend: "rising" as const,
            },
            alert: {
                level: "warning" as const,
                distance_to_warning_cm: 15.0,
                distance_to_critical_cm: 43.8,
                percentage_of_critical: 81.3,
            },
        };
        return samplePayload;
    },
};

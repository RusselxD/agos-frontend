import apiClient from "./axiosConfig";

import type {
    SensorConfig,
    SensorDeviceStatus,
    SensorReadingResponse,
} from "../../types/sensor";

export const sensorAPI = {
    getSensorConfig: async (): Promise<SensorConfig> => {
        const res = await apiClient.get<SensorConfig>(
            "system-settings/sensor_config/value"
        );
        return res.data as SensorConfig;
    },

    getLatestSensorReadings: async (
        page: number,
        page_size: number
    ): Promise<SensorReadingResponse> => {
        const res = await apiClient.get("/sensor-readings/paginated", {
            params: {
                page: page,
                page_size: page_size,
            },
        });

        console.log(res);
        return res.data as SensorReadingResponse;
    },

    getSensorStatus: async (id: number = 1): Promise<SensorDeviceStatus> => {
        const res = await apiClient.get(`sensor-devices/${id}/status`);
        return res.data as SensorDeviceStatus;
    },
};

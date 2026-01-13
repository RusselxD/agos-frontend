import apiClient from "./axiosConfig";

import type {
    SensorConfig,
    SensorDeviceStatus,
    SensorReadingForExportResponse,
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
        page_size: number,
        sensor_device_id: number
    ): Promise<SensorReadingResponse> => {
        const res = await apiClient.get("/sensor-readings/paginated", {
            params: {
                page: page,
                page_size: page_size,
                sensor_device_id: sensor_device_id,
            },
        });

        console.log(res);
        return res.data as SensorReadingResponse;
    },

    getSensorStatus: async (id: number = 1): Promise<SensorDeviceStatus> => {
        const res = await apiClient.get(`sensor-devices/${id}/status`);
        return res.data as SensorDeviceStatus;
    },

    getAvailableDays: async (sensor_device_id: number): Promise<string[]> => {
        const res = await apiClient.get("/sensor-readings/available-days", {
            params: {
                sensor_device_id: sensor_device_id,
            },
        });
        return res.data as string[];
    },

    getSensorReadingsForExport: async (
        start_datetime: string,
        end_datetime: string,
        sensor_device_id: number
    ): Promise<SensorReadingForExportResponse> => {
        const res = await apiClient.get("/sensor-readings/for-export", {
            params: {
                start_datetime: start_datetime,
                end_datetime: end_datetime,
                sensor_device_id: sensor_device_id,
            },
        });
        return res.data as SensorReadingForExportResponse;
    },
};

import type { SensorData } from "./sensor";

export interface SensorReadingSummaryResponse{
    status: string;
    message: string;
    sensor_reading: SensorData;
}

export interface BlockageSummaryResponse{
    status: string;
    message: string;
    blockage_status: string;
}
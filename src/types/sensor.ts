export interface SensorData {
    timestamp: string;
    waterLevel: WaterLevel;
    alert: Alert;
}

interface WaterLevel {
    current_cm: number;
    change_rate_cm_per_min: number;
    trend: "rising" | "falling" | "stable";
}

interface Alert {
    level: "normal" | "warning" | "critical";
    distance_to_warning_cm: number;
    distance_to_critical_cm: number;
    distance_from_critical_cm: number;
    percentage_of_critical: number; // current_cm / critical_cm * 100 (can overflow 100%)
}

export interface SensorConfig {
    installation_height: number;
    warning_threshold: number;
    critical_threshold: number;
}

export interface SensorReading {
    id: number;
    timestamp: string;
    water_level_cm: number;
    status: "stable" | "rising" | "falling";
    change_rate: number;
}

export interface SensorDeviceStatus {
    device_name: string;
    location: string;
    connection: string;
    last_updated: string | null;
    signal: string | null;
}

export interface SensorUpdateMessage {
    type: "sensor_update";
    data: any;
}

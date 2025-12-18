export interface SensorData {
    timestamp: string;
    waterLevel: WaterLevel;
    alert: Alert;
}

interface WaterLevel {
    current_cm: number;
    change_rate_cm_per_min: number;
    trend: "rising" | "falling" | "stable"; // if (change_rate > 0.1) return "rising"; if (change_rate < -0.1) return "falling"; return "stable";
}

// SAMPLE FUNCTION TO CALCULATE CHANGE RATE
// const calculateChangeRate = (current: RawReading, previous: RawReading) => {
//   const current_water_level = SENSOR_HEIGHT - current.raw_distance_cm;
//   const previous_water_level = SENSOR_HEIGHT - previous.raw_distance_cm;

//   const time_diff_minutes = (
//     new Date(current.timestamp).getTime() -
//     new Date(previous.timestamp).getTime()
//   ) / 60000; // Convert ms to minutes

//   const change_rate = (current_water_level - previous_water_level) / time_diff_minutes;

//   return change_rate;
// };

interface Alert {
    level: "normal" | "warning" | "critical";
    distance_to_warning_cm: number;
    distance_to_critical_cm: number;
    distance_from_critical_cm: number;
    percentage_of_critical: number; // current_cm / critical_cm * 100 (can overflow 100%)
}

// send every interval (e.g., 5 minutes)
// Raspberry Pi Sensor Raw Data Example
// {
//   "sensor_id": "WLS_MAYSAN_001",
//   "timestamp": "2024-12-11T12:58:45.123+08:00",
//   "raw_distance_cm": 155.8
// }

// raw_distance_cm is the distance from the sensor to the water surface, so:
// water_level_cm = SENSOR_HEIGHT_CM - raw_distance_cm

export interface SensorThresholds {
    warning_cm: number;
    critical_cm: number;
}

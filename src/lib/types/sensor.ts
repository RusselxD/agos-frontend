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
    percentage_of_critical: number;
}

// Raspberry Pi Sensor Raw Data Example
// {
//   "sensor_id": "WLS_MAYSAN_001",
//   "timestamp": "2024-12-11T12:58:45.123+08:00",
//   "raw_distance_cm": 155.8
// }

export interface Thresholds {
    warning_cm: number;
    critical_cm: number;
}

// Normal
// {
//   "water_level": { "current_cm": 35.0, "trend": "stable" },
//   "alert": {
//     "level": "normal",
//     "distance_to_warning_cm": 15.0,
//     "percentage_of_critical": 43.8
//   }
// }

// Warning
// {
//   "water_level": { "current_cm": 65.0, "trend": "rising" },
//   "alert": {
//     "level": "warning",
//     "distance_to_critical_cm": 15.0,
//     "percentage_of_critical": 81.3
//   }
// }

// Critical
// {
//   "water_level": { "current_cm": 82.0, "trend": "rising" },
//   "alert": {
//     "level": "critical",
//     "distance_to_critical_cm": -2.0,
//     "percentage_of_critical": 102.5
//   }
// }

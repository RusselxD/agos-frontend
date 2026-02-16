export interface DailySummary {
    summary_date: string;
    min_risk_score: number;
    max_risk_score: number;
    min_risk_timestamp: string;
    max_risk_timestamp: string;
    min_debris_count: number;
    max_debris_count: number;
    min_debris_timestamp: string;
    max_debris_timestamp: string;
    least_severe_blockage: string;
    most_severe_blockage: string;
    min_water_level_cm: number;
    max_water_level_cm: number;
    min_water_timestamp: string;
    max_water_timestamp: string;
    min_precipitation_mm: number;
    max_precipitation_mm: number;
    min_precip_timestamp: string;
    max_precip_timestamp: string;
    most_severe_weather_code: number;
}
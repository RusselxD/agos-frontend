export interface FusionAnalysisData {
    fusionData: FusionData;
    decisionFactors: DecisionFactors;
    triggeredConditions: string[];
}

interface FusionData {
    alert_tier: number; // 1, 2, or 3
    alert_name: "Normal" | "Warning" | "Critical";
    combined_risk_score: number;
    timestamp: string;
}

interface DecisionFactors {
    visual_analysis: "Clear" | "Partial" | "Blocked";
    water_level_cm: number;
    water_level_trend: "falling" | "stable" | "rising";
    water_change_rate: number;
    weather_condition: string;
    weather_precipitation: number;
}

export interface AlertThresholds {
    tier_1_max: number;
    tier_2_min: number;
    tier_2_max: number;
    tier_3_min: number;
}
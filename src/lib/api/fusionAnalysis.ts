import type {
    AlertThresholds,
    FusionAnalysisData,
} from "../../types/fusionAnalysis";
export const sampleFusionAnalysisAPI = {
    getAnalysisThresholds: async (): Promise<AlertThresholds> => {
        return {
            tier_1_max: 45,
            tier_2_min: 46,
            tier_2_max: 75,
            tier_3_min: 76,
        } as AlertThresholds;
    },

    getLatestFusionData: async (): Promise<FusionAnalysisData> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate random scenario
        // Generate random scenario
        const scenarios = [
            {
                fusionData: {
                    alert_tier: 1,
                    alert_name: "Normal" as const,
                    combined_risk_score: 15,
                    timestamp: new Date().toISOString(),
                },
                decisionFactors: {
                    visual_analysis: "Clear" as const,
                    water_level_cm: 15,
                    water_level_trend: "stable" as const,
                    water_change_rate: 0.2,
                    weather_condition: "Partly Cloudy",
                    weather_precipitation: 0,
                },
                triggeredConditions: [
                    "All systems operating within normal parameters",
                    "Routine monitoring active",
                ],
                thresholds: {
                    tier_1_max: 44,
                    tier_2_min: 45,
                    tier_2_max: 74,
                    tier_3_min: 75,
                },
            },
            {
                fusionData: {
                    alert_tier: 2,
                    alert_name: "Warning" as const,
                    combined_risk_score: 58,
                    timestamp: new Date().toISOString(),
                },
                decisionFactors: {
                    visual_analysis: "Partial" as const,
                    water_level_cm: 35,
                    water_level_trend: "rising" as const,
                    water_change_rate: 1.5,
                    weather_condition: "Light Rain",
                    weather_precipitation: 5.2,
                },
                triggeredConditions: [
                    "Partial blockage detected in drainage",
                    "Elevated water level at 35cm (58.3% of critical)",
                    "Water rising quickly at 1.5 cm/min",
                    "Light rainfall ongoing: 5.2mm/h",
                ],
                thresholds: {
                    tier_1_max: 44,
                    tier_2_min: 45,
                    tier_2_max: 74,
                    tier_3_min: 75,
                },
            },
            {
                fusionData: {
                    alert_tier: 3,
                    alert_name: "Critical" as const,
                    combined_risk_score: 85,
                    timestamp: new Date().toISOString(),
                },
                decisionFactors: {
                    visual_analysis: "Blocked" as const,
                    water_level_cm: 52,
                    water_level_trend: "rising" as const,
                    water_change_rate: 4.8,
                    weather_condition: "Heavy Rain",
                    weather_precipitation: 18.7,
                },
                triggeredConditions: [
                    "Drainage is BLOCKED - immediate attention required",
                    "High water level at 52cm (86.7% of critical)",
                    "Water rising VERY rapidly at 4.8 cm/min",
                    "Heavy rainfall detected: 18.7mm/h",
                    "MULTIPLE CRITICAL FACTORS: Blockage + High Water + Rain",
                ],
                thresholds: {
                    tier_1_max: 44,
                    tier_2_min: 45,
                    tier_2_max: 74,
                    tier_3_min: 75,
                },
            },
            {
                fusionData: {
                    alert_tier: 3,
                    alert_name: "Critical" as const,
                    combined_risk_score: 95,
                    timestamp: new Date().toISOString(),
                },
                decisionFactors: {
                    visual_analysis: "Blocked" as const,
                    water_level_cm: 58,
                    water_level_trend: "rising" as const,
                    water_change_rate: 7.3,
                    weather_condition: "Torrential Rain",
                    weather_precipitation: 42.5,
                },
                triggeredConditions: [
                    "Drainage is BLOCKED - immediate attention required",
                    "CRITICAL water level at 58cm (96.7% of critical)",
                    "Water rising VERY rapidly at 7.3 cm/min",
                    "Heavy rainfall detected: 42.5mm/h",
                    "MULTIPLE CRITICAL FACTORS: Blockage + High Water + Rain",
                ],
                thresholds: {
                    tier_1_max: 44,
                    tier_2_min: 45,
                    tier_2_max: 74,
                    tier_3_min: 75,
                },
            },
            {
                fusionData: {
                    alert_tier: 2,
                    alert_name: "Warning" as const,
                    combined_risk_score: 48,
                    timestamp: new Date().toISOString(),
                },
                decisionFactors: {
                    visual_analysis: "Partial" as const,
                    water_level_cm: 38,
                    water_level_trend: "falling" as const,
                    water_change_rate: -1.2,
                    weather_condition: "Overcast",
                    weather_precipitation: 0.5,
                },
                triggeredConditions: [
                    "Partial blockage detected in drainage",
                    "Elevated water level at 38cm (63.3% of critical)",
                    "Water level decreasing (currently 38cm)",
                ],
                thresholds: {
                    tier_1_max: 44,
                    tier_2_min: 45,
                    tier_2_max: 74,
                    tier_3_min: 75,
                },
            },
        ];

        // Return random scenario
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    },
};

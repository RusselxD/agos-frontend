import { AlertTriangle } from "lucide-react";
import { useFusionAnalysis } from "../../../../../context/FusionAnalysisContext";
import { AnomalyType } from "../../../../../types/fusionAnalysis";

const anomalyMessages: Record<AnomalyType, { title: string; description: string }> = {
    [AnomalyType.OBSTRUCTED_SENSOR]: {
        title: "Suspected Sensor Obstruction",
        description: "Water level reads critical, but blockage and weather are clear. The sensor might be physically blocked.",
    },
    [AnomalyType.BLIND_CAMERA]: {
        title: "Suspected Camera Blindness",
        description: "Severe blockage detected but water level is stable despite heavy rain. Camera lens might be obscured.",
    },
    [AnomalyType.STALE_SENSOR]: {
        title: "Stale Sensor Reading",
        description: "Water level is static during heavy rain. Sensor may be disconnected or hardware failed.",
    },
    [AnomalyType.GHOST_FLOOD]: {
        title: "Unexpected Water Rise",
        description: "Rapid water rise detected without local rain or blockage. Monitor for localized flash flood or upstream discharge.",
    },
    [AnomalyType.CONFIDENCE_THRASHING]: {
        title: "High Data Volatility",
        description: "Sensor readings are fluctuating rapidly. Confidence in current risk score is low.",
    },
};

export default function AnomalyBanner() {
    const { fusionAnalysis } = useFusionAnalysis();
    const anomalies = fusionAnalysis?.fusion_data?.anomalies || [];

    if (anomalies.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {anomalies.map((type: AnomalyType) => {
                const info = anomalyMessages[type] || {
                    title: "System Anomaly Detected",
                    description: "Data inconsistency detected between sensors.",
                };
                return (
                    <div
                        key={type}
                        className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-400 animate-pulse-subtle"
                    >
                        <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-sm md:text-base">{info.title}</h4>
                            <p className="text-xs md:text-sm text-amber-700 dark:text-amber-500 opacity-90">
                                {info.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

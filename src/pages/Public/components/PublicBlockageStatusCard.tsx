import { ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import { useWaterwayContext } from "../../../context/BlockageContext";
import Card, { CardHeaderText, ErrorCard } from "../../Dashboard/components/ui/Card";
import BlockageStatusCardSkeleton from "../../Dashboard/components/BlockageStatusCard/components/BlockageStatusCardSkeleton";
import { useFusionAnalysis } from "../../../context/FusionAnalysisContext";
import { AnomalyType } from "../../../types/fusionAnalysis";
import StatusText from "../../Dashboard/components/BlockageStatusCard/components/StatusText";

export const getLevelCount = (status: string | null): number => {
    switch (status) {
        case "Clear": return 0;
        case "Partial": return 1;
        case "Blocked": return 2;
        default: return 0;
    }
};

export default function PublicBlockageStatusCard() {
    const { status, isFetching, error, warning: contextWarning } = useWaterwayContext();
    const { fusionAnalysis } = useFusionAnalysis();

    const isBlindCamera = fusionAnalysis?.fusion_data?.anomalies?.includes(AnomalyType.BLIND_CAMERA);
    const anomalyWarning = isBlindCamera ? "⚠️ Suspected Camera Blindness/Obscured Lens" : null;

    if (isFetching) return <BlockageStatusCardSkeleton />;
    if (error) return <ErrorCard message={error} />;

    const currentLevel = getLevelCount(status);
    const stages = [
        { label: "Clear", icon: ShieldCheck, color: "text-clear", bg: "bg-clear/10", border: "border-clear/30", glow: "shadow-clear/20" },
        { label: "Partial", icon: AlertTriangle, color: "text-partial", bg: "bg-partial/10", border: "border-partial/30", glow: "shadow-partial/20" },
        { label: "Blocked", icon: XCircle, color: "text-blocked", bg: "bg-blocked/10", border: "border-blocked/30", glow: "shadow-blocked/20" },
    ];

    return (
        <Card warning={anomalyWarning || contextWarning} className="min-h-[200px]">
            <CardHeaderText label="BLOCKAGE STATUS" />
            
            <StatusText />

            <div className="flex items-center justify-between gap-2 mt-4 mb-2 relative px-2">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-white/10 -translate-y-6 -z-0">
                    <div 
                        className="h-full bg-primary transition-all duration-700 ease-in-out" 
                        style={{ width: `${(currentLevel / 2) * 100}%` }}
                    />
                </div>

                {stages.map((stage, index) => {
                    const isActive = currentLevel === index;
                    const Icon = stage.icon;

                    return (
                        <div key={stage.label} className="flex flex-col items-center gap-2 flex-1 z-10">
                            <div
                                className={`p-3 rounded-2xl border-2 transition-all duration-500 ease-out ${
                                    isActive 
                                        ? `${stage.bg} ${stage.border} ${stage.glow} scale-110 shadow-2xl z-20` 
                                        : "bg-white/40 dark:bg-white/[0.02] border-transparent opacity-30 grayscale scale-90"
                                }`}
                            >
                                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? stage.color : "text-gray-400"}`} />
                            </div>
                            <span className={`text-[0.6rem] md:text-[0.65rem] font-black uppercase tracking-widest transition-all duration-500 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

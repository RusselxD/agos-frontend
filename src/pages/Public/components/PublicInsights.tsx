import { useWaterwayContext } from "../../../context/BlockageContext";
import { useWeather } from "../../../context/WeatherContext";
import { useFusionAnalysis } from "../../../context/FusionAnalysisContext";
import { Info, Home, ShieldAlert, Cloud, Droplet, AlertTriangle, CheckCircle, Waves } from "lucide-react";
import Container from "../../../components/ui/Container";

export default function PublicInsights() {
    const { status: waterwayStatus } = useWaterwayContext();
    const { weatherData } = useWeather();
    const { fusionAnalysis } = useFusionAnalysis();

    // Derived states
    const riskScore = fusionAnalysis?.fusion_data?.combined_risk_score ?? 0;
    
    
    // Waterway logic
    let waterwayHeader = "The waterway is CLEAR.";
    let waterwayDesc = "Water flows normally.";
    let WaterwayIcon = CheckCircle;
    let waterwayColor = "text-emerald-500";
    let waterwayBg = "bg-emerald-500/10";
    
    if (waterwayStatus === "Blocked") {
        waterwayHeader = "The waterway is BLOCKED.";
        waterwayDesc = "Water flow is severely restricted.";
        WaterwayIcon = AlertTriangle;
        waterwayColor = "text-red-500";
        waterwayBg = "bg-red-500/10";
    } else if (waterwayStatus === "Partial") {
        waterwayHeader = "The waterway is PARTIALLY BLOCKED.";
        waterwayDesc = "Water flow is restricted.";
        WaterwayIcon = AlertTriangle;
        waterwayColor = "text-amber-500";
        waterwayBg = "bg-amber-500/10";
    }

    // Water level logic
    let waterLevelHeader = "Water level is normal.";
    let waterLevelDesc = "No immediate danger.";
    let WaterLevelIcon = Droplet;
    let waterLevelColor = "text-blue-500";
    let waterLevelBg = "bg-blue-500/10";
    
    if (riskScore >= 76) {
        waterLevelHeader = "Water level is CRITICAL.";
        waterLevelDesc = "Immediate risk of flooding.";
        WaterLevelIcon = Waves;
        waterLevelColor = "text-red-500";
        waterLevelBg = "bg-red-500/10";
    } else if (riskScore >= 45) {
        waterLevelHeader = "Water level is ELEVATED.";
        waterLevelDesc = "Monitor conditions closely.";
        waterLevelColor = "text-amber-500";
        waterLevelBg = "bg-amber-500/10";
    }

    // Weather logic
    const condition = weatherData?.condition || "Clear";
    const precip = weatherData?.precipitation_mm || 0;
    
    let weatherHeader = `Weather is ${condition.toLowerCase()}`;
    if (precip === 0) weatherHeader += " with no rainfall.";
    else weatherHeader += ` with ${precip}mm/h rainfall.`;
    
    let weatherDesc = "Conditions are stable.";
    let WeatherIcon = Cloud;
    let weatherColor = "text-emerald-500";
    let weatherBg = "bg-emerald-500/10";

    if (precip > 10) {
        weatherDesc = "Heavy rainfall detected.";
        weatherColor = "text-red-500";
        weatherBg = "bg-red-500/10";
    } else if (precip > 0) {
        weatherDesc = "Light to moderate rainfall.";
        weatherColor = "text-amber-500";
        weatherBg = "bg-amber-500/10";
    }

    // Advice logic
    let adviceTitle = "Conditions Normal";
    let adviceLines = [
        "Conditions are currently stable.",
        "Continue routine activities but remain aware of weather updates."
    ];
    let adviceColor = "text-blue-500";
    let adviceBg = "bg-blue-50 dark:bg-slate-800/50";
    
    if (riskScore >= 76) {
        adviceTitle = "Evacuation Warning";
        adviceLines = [
            "Evacuate immediately to higher ground.",
            "Follow all instructions from local emergency authorities."
        ];
        adviceColor = "text-red-500";
        adviceBg = "bg-red-50 dark:bg-red-900/10 border border-red-500/20";
    } else if (riskScore >= 45) {
        adviceTitle = "Advice for Residents";
        adviceLines = [
            "Stay informed and monitor updates.",
            "Avoid going near waterways when it is raining."
        ];
        adviceColor = "text-indigo-500";
        adviceBg = "bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-500/20";
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* What This Means Card */}
            <Container className="xl:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Info className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">What This Means</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-800 pt-2">
                    {/* Waterway */}
                    <div className="flex items-start gap-3 pt-3 md:pt-0 md:px-3 first:pl-0">
                        <div className={`shrink-0 p-2.5 rounded-xl ${waterwayBg} ${waterwayColor}`}>
                            <WaterwayIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{waterwayHeader}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{waterwayDesc}</p>
                        </div>
                    </div>

                    {/* Water Level */}
                    <div className="flex items-start gap-3 pt-3 md:pt-0 md:px-3">
                        <div className={`shrink-0 p-2.5 rounded-xl ${waterLevelBg} ${waterLevelColor}`}>
                            <WaterLevelIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{waterLevelHeader}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{waterLevelDesc}</p>
                        </div>
                    </div>

                    {/* Weather */}
                    <div className="flex items-start gap-3 pt-3 md:pt-0 md:px-3 last:pr-0">
                        <div className={`shrink-0 p-2.5 rounded-xl ${weatherBg} ${weatherColor}`}>
                            <WeatherIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{weatherHeader}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{weatherDesc}</p>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Advice for Residents Card */}
            <div className={`rounded-2xl p-5 flex items-center justify-between gap-4 transition-colors ${adviceBg}`}>
                <div className="flex items-start gap-4 flex-1">
                    <div className={`shrink-0 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ${adviceColor}`}>
                        {riskScore >= 76 ? <ShieldAlert className="w-8 h-8" /> : <Home className="w-8 h-8" />}
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${adviceColor}`}>
                            {adviceTitle}
                        </h3>
                        <div className="space-y-1.5">
                            {adviceLines.map((line, i) => (
                                <p key={i} className="text-sm text-gray-700 dark:text-slate-300 font-medium">
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

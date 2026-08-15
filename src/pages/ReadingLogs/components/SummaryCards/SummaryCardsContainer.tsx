import { AlertTriangle, CloudRain, ShieldAlert, Waves } from "lucide-react";
import { useMemo } from "react";
import StatCard from "./StatCard";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import { formatDate } from "../../../../lib/utils/formatter";

export default function SummaryCardsContainer() {
    const { summaries, isLoading } = useReadingLogs();

    const stats = useMemo(() => {
        if (summaries.length === 0) {
            return {
                highestRisk: { value: 0, date: "N/A" },
                peakWaterLevel: { value: 0, date: "N/A" },
                avgPrecipitation: 0,
                worstBlockageCount: 0,
            };
        }

        // Find highest risk
        let highestRisk = { value: 0, date: "" };
        let peakWaterLevel = { value: 0, date: "" };
        let totalPrecip = 0;
        let blockedCount = 0;

        summaries.forEach((s) => {
            if (s.max_risk_score > highestRisk.value) {
                highestRisk = {
                    value: s.max_risk_score,
                    date: s.summary_date,
                };
            }
            if (s.max_water_level_cm > peakWaterLevel.value) {
                peakWaterLevel = {
                    value: s.max_water_level_cm,
                    date: s.summary_date,
                };
            }
            totalPrecip += s.max_precipitation_mm;
            if (s.most_severe_blockage === "blocked") {
                blockedCount++;
            }
        });

        return {
            highestRisk,
            peakWaterLevel,
            avgPrecipitation: totalPrecip / summaries.length,
            worstBlockageCount: blockedCount,
        };
    }, [summaries]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-slate-800 custom-shadow rounded-xl p-4 h-24 border border-gray-100 dark:border-slate-700/50"
                    >
                        <div className="skeleton h-full rounded-md"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <StatCard
                icon={AlertTriangle}
                label="Highest Risk Score"
                value={stats.highestRisk.value}
                subValue={formatDate(stats.highestRisk.date)}
                colorClass="text-blocked dark:text-red-400"
                bgColorClass="bg-blocked/10 dark:bg-red-950/20"
            />
            <StatCard
                icon={Waves}
                label="Peak Water Level"
                value={`${stats.peakWaterLevel.value} cm`}
                subValue={formatDate(stats.peakWaterLevel.date)}
                colorClass="text-blue-600 dark:text-indigo-400"
                bgColorClass="bg-blue-100 dark:bg-indigo-950/30"
            />
            <StatCard
                icon={CloudRain}
                label="Avg Precipitation"
                value={`${stats.avgPrecipitation.toFixed(1)} mm/h`}
                subValue="Across loaded days"
                colorClass="text-primary dark:text-sky-400"
                bgColorClass="bg-primary/10 dark:bg-sky-950/30"
            />
            <StatCard
                icon={ShieldAlert}
                label="Potential Obstruction Incidents"
                value={stats.worstBlockageCount}
                subValue={`of ${summaries.length} days`}
                colorClass="text-partial dark:text-amber-400"
                bgColorClass="bg-partial/10 dark:bg-amber-950/20"
            />
        </div>
    );
}

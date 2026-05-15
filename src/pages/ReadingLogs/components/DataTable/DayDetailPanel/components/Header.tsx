import { formatDate } from "../../../../../../lib/utils/formatter";
import { X } from "lucide-react";
import type { DailySummary } from "../../../../../../types/readingLogs";
import type { RiskLevelConfig } from "../DayDetailPanel";

interface HeaderProps {
    maxRiskLevel: RiskLevelConfig;
    summary: DailySummary;
    onClose: () => void;
}

export default function Header({
    maxRiskLevel,
    summary,
    onClose,
}: HeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl border-b border-white/50 dark:border-white/10 transition-all duration-300">
            <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">
                                Daily Summary
                            </p>
                            <h2 className="text-xl font-bold text-neutral dark:text-slate-200">
                                {formatDate(summary.summary_date)}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                    </button>
                </div>

                {/* Quick status badge */}
                <div
                    className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${maxRiskLevel.badgeBgClass} border ${maxRiskLevel.badgeBorderClass}`}
                >
                    <div
                        className={`w-2 h-2 rounded-full ${maxRiskLevel.dotClass} animate-pulse`}
                    />
                    <span
                        className={`text-xs font-medium ${maxRiskLevel.textClass}`}
                    >
                        {maxRiskLevel.label} Risk Day
                    </span>
                </div>
            </div>
        </div>
    );
}

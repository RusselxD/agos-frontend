import { ArrowRight, ShieldAlert } from "lucide-react";

const getBlockageConfig = (status: string | null) => {
    if (!status) return { textClass: "text-gray-500 dark:text-slate-400", bg: "bg-gray-50 dark:bg-slate-800/50", border: "border-gray-200 dark:border-slate-700/50" };
    const normalized = status.toLowerCase();
    if (normalized === "clear")
        return {
            textClass: "text-clear dark:text-emerald-400",
            bg: "bg-clear/10 dark:bg-emerald-900/10",
            border: "border-clear/30 dark:border-emerald-800/30",
        };
    if (normalized === "partial")
        return {
            textClass: "text-partial dark:text-amber-400",
            bg: "bg-partial/10 dark:bg-amber-900/10",
            border: "border-partial/30 dark:border-amber-800/30",
        };
    return {
        textClass: "text-blocked dark:text-red-400",
        bg: "bg-blocked/10 dark:bg-red-900/10",
        border: "border-blocked/30 dark:border-red-800/30",
    };
};

export default function BlockageCard({
    leastSevere,
    mostSevere,
}: {
    leastSevere: string | null;
    mostSevere: string | null;
}) {
    const leastConfig = getBlockageConfig(leastSevere);
    const mostConfig = getBlockageConfig(mostSevere);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700/50 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-partial dark:bg-amber-500/20">
                    <ShieldAlert className="w-4 h-4 text-white dark:text-amber-500" />
                </div>
                <span className="text-sm font-medium text-neutral dark:text-slate-200">
                    Blockage Status
                </span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div
                    className={`flex-1 ${leastConfig.bg} ${leastConfig.border} border rounded-lg p-3 text-center`}
                >
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Least Severe
                    </p>
                    <p className={`text-sm font-bold ${leastConfig.textClass}`}>
                        {leastSevere ? leastSevere.charAt(0).toUpperCase() +
                            leastSevere.slice(1) : "N/A"}
                    </p>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 flex-shrink-0" />

                <div
                    className={`flex-1 ${mostConfig.bg} ${mostConfig.border} border rounded-lg p-3 text-center`}
                >
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Most Severe
                    </p>
                    <p className={`text-sm font-bold ${mostConfig.textClass}`}>
                        {mostSevere ? mostSevere.charAt(0).toUpperCase() +
                            mostSevere.slice(1) : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
}

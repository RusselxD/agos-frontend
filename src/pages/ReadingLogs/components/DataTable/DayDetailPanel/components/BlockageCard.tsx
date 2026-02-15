import { ArrowRight, ShieldAlert } from "lucide-react";

const getBlockageConfig = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "clear")
        return {
            textClass: "text-clear",
            bg: "bg-clear/10",
            border: "border-clear/30",
        };
    if (normalized === "partial")
        return {
            textClass: "text-partial",
            bg: "bg-partial/10",
            border: "border-partial/30",
        };
    return {
        textClass: "text-blocked",
        bg: "bg-blocked/10",
        border: "border-blocked/30",
    };
};

export default function BlockageCard({
    leastSevere,
    mostSevere,
}: {
    leastSevere: string;
    mostSevere: string;
}) {
    const leastConfig = getBlockageConfig(leastSevere);
    const mostConfig = getBlockageConfig(mostSevere);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-partial">
                    <ShieldAlert className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral">
                    Blockage Status
                </span>
            </div>

            <div className="flex items-center justify-between gap-3">
                <div
                    className={`flex-1 ${leastConfig.bg} ${leastConfig.border} border rounded-lg p-3 text-center`}
                >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                        Least Severe
                    </p>
                    <p className={`text-sm font-bold ${leastConfig.textClass}`}>
                        {leastSevere.charAt(0).toUpperCase() +
                            leastSevere.slice(1)}
                    </p>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />

                <div
                    className={`flex-1 ${mostConfig.bg} ${mostConfig.border} border rounded-lg p-3 text-center`}
                >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                        Most Severe
                    </p>
                    <p className={`text-sm font-bold ${mostConfig.textClass}`}>
                        {mostSevere.charAt(0).toUpperCase() +
                            mostSevere.slice(1)}
                    </p>
                </div>
            </div>
        </div>
    );
}

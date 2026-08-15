import { useWaterwayContext } from "../../../../../context/BlockageContext";
import type { Status } from "../../../../../types/blockage";
import { barColors, getLevelCount } from "../BlockageStatusCard";
import { getSurfaceObstructionLabel } from "../../../../../lib/utils/obstruction";

export default function StatusText() {
    const { status } = useWaterwayContext();

    const getStatusColor = (status: Status | null): string => {
        switch (status) {
            case "Clear":
                return "text-clear";
            case "Partial":
                return "text-partial";
            case "Blocked":
                return "text-blocked";
            default:
                return "text-gray-400 dark:text-slate-500";
        }
    };

    const levelCount: number = status ? getLevelCount(status) : 0;

    return (
        <div className="flex items-center gap-2 md:gap-3 my-1.5 md:my-2">
            <span
                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ${barColors[levelCount]} ${
                    levelCount === 2 && "pulse-circle"
                }`}
            ></span>
            <span className={`font-bold text-2xl md:text-3xl ${getStatusColor(status)}`}>
                {status ? getSurfaceObstructionLabel(status, true) : "N/A"}
            </span>
        </div>
    );
}

import { useWaterwayContext } from "../../../../../context/BlockageContext";
import type { Status } from "../../../../../types/blockage";
import { barColors, getLevelCount } from "../BlockageStatusCard";

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
                return "text-gray-400";
        }
    };

    const levelCount: number = status ? getLevelCount(status) : 0;

    return (
        <div className="flex items-center gap-3 my-2">
            <span
                className={`w-4 h-4 rounded-full ${barColors[levelCount]} ${
                    levelCount === 2 && "pulse-circle"
                }`}
            ></span>
            <span className={`font-bold text-3xl ${getStatusColor(status)}`}>
                {status}
            </span>
        </div>
    );
}

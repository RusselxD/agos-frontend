import type { Status } from "../../../../../lib/types/blockage";
import { barColors, getLevelCount } from "../BlockageStatusCard";

export default function StatusText({
    status,
}: {
    status: Status;
}): React.JSX.Element {
    const getStatusColor = (status: Status): string => {
        switch (status) {
            case "Clear":
                return "text-clear";
            case "Partial":
                return "text-partial";
            case "Blocked":
                return "text-blocked";
        }
    };

    const levelCount: number = getLevelCount(status);

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

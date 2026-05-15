import { barColors, getLevelCount } from "../BlockageStatusCard";
import { useWaterwayContext } from "../../../../../context/BlockageContext";

export default function ProgressBar() {
    const { status } = useWaterwayContext();
    const barCount = getLevelCount(status);

    return (
        <div className="relative flex gap-1 pb-6 md:pb-7">
            {Array.from({ length: 3 }).map((_, index) => {
                return (
                    <span
                        key={index}
                        className={`w-full rounded-md h-1.5 md:h-2 ${
                            barCount >= index
                                ? barColors[barCount]
                                : "bg-gray-200 dark:bg-slate-700"
                        }`}
                    ></span>
                );
            })}
            <div className="absolute bottom-0 flex items-center justify-between text-gray-500 dark:text-slate-400 text-xs md:text-sm w-full">
                <span>Clear</span>
                <span>Blocked</span>
            </div>
        </div>
    );
}

import { useWeather } from "../../../../../context/WeatherContext";

export default function PrecipitationInfo({
    precipitation_mm,
}: {
    precipitation_mm: number;
}) {
    const { warning } = useWeather();

    return (
        <div
            className={`flex flex-col justify-center gap-0.5 rounded-xl p-2.5 md:p-3 border transition-colors ${warning ? "bg-amber-100/50 dark:bg-amber-900/20 border-amber-300/50 dark:border-amber-700/30 backdrop-blur-sm" : "bg-white/40 dark:bg-slate-800/30 border-gray-200/50 dark:border-white/5 backdrop-blur-sm shadow-sm"}`}
        >
            <p className="text-[0.7rem] md:text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-400">Precipitation</p>
            <p className="text-sm md:text-base font-semibold">
                <span>{`${precipitation_mm.toFixed(1)} mm/h`}</span>
            </p>
        </div>
    );
}

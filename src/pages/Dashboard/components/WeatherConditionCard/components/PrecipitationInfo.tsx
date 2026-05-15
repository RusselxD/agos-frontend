import { useWeather } from "../../../../../context/WeatherContext";

export default function PrecipitationInfo({
    precipitation_mm,
}: {
    precipitation_mm: number;
}) {
    const { warning } = useWeather();

    return (
        <div
            className={`rounded-lg p-2 md:p-2.5 border ${warning ? "bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50" : "bg-slate-100 dark:bg-slate-800/80 border-gray-300 dark:border-slate-700"}`}
        >
            <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">Precipitation</p>
            <p className="text-xs md:text-sm">
                <span>{`${precipitation_mm.toFixed(1)} mm/h`}</span>
            </p>
        </div>
    );
}

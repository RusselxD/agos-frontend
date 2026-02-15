import {
    getWeatherDescription,
    getWeatherIcon,
} from "../../../../../../lib/utils/weather";

export default function WeatherCard({ weatherCode }: { weatherCode: number }) {
    const WeatherIcon = getWeatherIcon(weatherCode);
    const description = getWeatherDescription(weatherCode);

    return (
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-100 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-sky-600 uppercase tracking-wide mb-1">
                        Most Severe Weather Condition
                    </p>
                    <p className="text-lg font-semibold text-neutral">
                        {description}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/60 shadow-sm">
                    <WeatherIcon className="w-8 h-8 text-sky-500" />
                </div>
            </div>
        </div>
    );
}

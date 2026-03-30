import type { WeatherProps } from "../WeatherConditionCard";

export default function WeatherCondition({ weather }: WeatherProps) {
    return (
        <div className="flex gap-2 items-center">
            <weather.icon className={`w-8 h-8 md:w-10 md:h-10 shrink-0 ${weather.color}`} />
            <div className="min-w-0">
                <h2 className={`font-semibold text-xl md:text-2xl truncate ${weather.color}`}>
                    {weather.condition}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 truncate">{weather.description}</p>
            </div>
        </div>
    );
}

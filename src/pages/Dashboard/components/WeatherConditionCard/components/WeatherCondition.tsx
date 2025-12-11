import type { WeatherProps } from "../WeatherConditionCard";

export default function WeatherCondition({
    weather,
}: WeatherProps): React.JSX.Element {
    return (
        <div className="flex gap-2 items-center">
            <weather.icon size={40} className={weather.color} />
            <div>
                <h2 className={`font-semibold text-2xl ${weather.color}`}>
                    {weather.condition}
                </h2>
                <p className="text-sm text-gray-600">{weather.description}</p>
            </div>
        </div>
    );
}

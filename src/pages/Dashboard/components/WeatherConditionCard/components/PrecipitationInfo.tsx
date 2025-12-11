import type { WeatherProps } from "../WeatherConditionCard";

export default function PrecipitationInfo({
    weather,
}: WeatherProps): React.JSX.Element {
    return (
        <div className="bg-gray-100 rounded-lg p-2.5">
            <p className="text-sm text-gray-500">Precipitation</p>
            <p className="text-sm ">
                <span>{weather.precipitation}</span>
                <span> mm</span>
            </p>
        </div>
    );
}

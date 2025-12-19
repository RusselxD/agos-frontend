export default function PrecipitationInfo({
    precipitation,
}: {
    precipitation: number;
}) {
    return (
        <div className="bg-gray-100 rounded-lg p-2.5">
            <p className="text-sm text-gray-500">Precipitation</p>
            <p className="text-sm ">
                <span>{`${precipitation.toFixed(1)} mm/h`}</span>
            </p>
        </div>
    );
}

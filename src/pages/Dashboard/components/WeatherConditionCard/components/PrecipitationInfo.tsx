export default function PrecipitationInfo({
    precipitation_mm,
}: {
    precipitation_mm: number;
}) {
    return (
        <div className="bg-slate-100 rounded-lg p-2.5 border">
            <p className="text-sm text-gray-500">Precipitation</p>
            <p className="text-sm ">
                <span>{`${precipitation_mm.toFixed(1)} mm/h`}</span>
            </p>
        </div>
    );
}

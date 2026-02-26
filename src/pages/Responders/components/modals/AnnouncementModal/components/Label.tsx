export default function Label({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
                {label}
            </label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
                <p className="text-sm leading-7 whitespace-pre-wrap">{value}</p>
            </div>
        </div>
    );
}

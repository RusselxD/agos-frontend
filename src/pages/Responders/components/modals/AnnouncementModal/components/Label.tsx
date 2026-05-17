export default function Label({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                {label}
            </label>
            <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 px-3 py-2 text-gray-800 dark:text-slate-200">
                <p className="text-sm leading-7 whitespace-pre-wrap">{value}</p>
            </div>
        </div>
    );
}

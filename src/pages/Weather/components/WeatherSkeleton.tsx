export default function WeatherSkeleton() {
    return (
        <div className="space-y-4">
            <div className="rounded-xl bg-white dark:bg-slate-800 p-4 sm:p-6 custom-shadow border border-gray-100 dark:border-slate-700">
                <div className="mb-5 flex items-start justify-between sm:mb-6">
                    <div className="space-y-1">
                        <div className="skeleton h-4 w-32 rounded" />
                        <div className="skeleton h-3 w-24 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="skeleton h-20 w-20 rounded-full sm:h-24 sm:w-24 shrink-0" />
                    <div className="space-y-2 min-w-0 flex-1">
                        <div className="skeleton h-12 w-28 rounded sm:h-14 sm:w-32" />
                        <div className="skeleton h-7 w-24 rounded" />
                        <div className="skeleton h-4 w-40 rounded" />
                    </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 dark:border-slate-700 pt-5 sm:mt-6 sm:grid-cols-3 sm:gap-4 sm:pt-6">
                    <div className="skeleton h-5 w-28 rounded" />
                    <div className="skeleton h-5 w-24 rounded" />
                    <div className="skeleton h-5 w-28 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                        <div className="skeleton h-4 w-20 rounded mb-2" />
                        <div className="skeleton h-6 w-16 rounded mb-1" />
                        <div className="skeleton h-4 w-24 rounded" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="skeleton rounded-xl h-20" />
                <div className="skeleton rounded-xl h-20" />
            </div>
        </div>
    );
}

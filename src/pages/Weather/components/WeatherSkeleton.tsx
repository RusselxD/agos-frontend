export default function WeatherSkeleton() {
    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="space-y-1">
                        <div className="skeleton h-4 w-32 rounded" />
                        <div className="skeleton h-3 w-24 rounded" />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="skeleton w-24 h-24 rounded-full" />
                    <div className="space-y-2">
                        <div className="skeleton h-14 w-32 rounded" />
                        <div className="skeleton h-7 w-24 rounded" />
                        <div className="skeleton h-4 w-40 rounded" />
                    </div>
                </div>
                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="skeleton h-5 w-28 rounded" />
                    <div className="skeleton h-5 w-24 rounded" />
                    <div className="skeleton h-5 w-28 rounded" />
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-4">
                        <div className="skeleton h-4 w-20 rounded mb-2" />
                        <div className="skeleton h-6 w-16 rounded mb-1" />
                        <div className="skeleton h-4 w-24 rounded" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="skeleton rounded-xl h-20" />
                <div className="skeleton rounded-xl h-20" />
            </div>
        </div>
    );
}

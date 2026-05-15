export default function ChartSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/50 custom-shadow rounded-xl p-5 h-80">
            <div className="skeleton h-5 w-40 rounded mb-4"></div>
            <div className="skeleton h-60 rounded-md"></div>
        </div>
    );
}

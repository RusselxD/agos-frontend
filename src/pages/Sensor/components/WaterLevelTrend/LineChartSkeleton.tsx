import type { ReactNode } from "react";
import "./style.css";

export default function LineChartSkeleton({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="w-full mx-auto p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg relative transition-colors">
            <h2 className="text-center -mt-2 mb-4 font-semibold text-gray-600 dark:text-slate-300">
                Water Level Trend
            </h2>

            {children}
            <div className="h-96 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4 relative">
                <div className="grid grid-cols-10 gap-2 lg:gap-5 h-full">
                    {[...Array(10)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-t from-gray-300 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-t-lg self-end animate-segment-load"
                            style={{
                                animationDelay: `${index * 0.2}s`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import type { ReactNode } from "react";
import "./style.css";

export default function LineChartSkeleton({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="relative mx-auto w-full rounded-xl bg-white p-4 shadow-lg sm:p-8">
            <h2 className="text-center -mt-2 mb-4 font-semibold text-gray-600">
                Water Level Trend
            </h2>

            {children}
            <div className="relative h-80 rounded-lg border-2 border-gray-200 p-4 sm:h-96">
                <div className="grid grid-cols-10 gap-2 lg:gap-5 h-full">
                    {[...Array(10)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg self-end animate-segment-load"
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

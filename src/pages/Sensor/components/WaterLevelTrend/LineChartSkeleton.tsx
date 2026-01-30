import "./style.css";

export default function LineChartSkeleton() {
    return (
        <div className="w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
            <div className="h-6 w-72 bg-gray-200 rounded mb-6 skeleton" />

            <div className="h-96 border-2 border-gray-200 rounded-lg p-4 relative">
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

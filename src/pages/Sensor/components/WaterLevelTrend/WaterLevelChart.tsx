import { Line } from "react-chartjs-2";
import { useMemo, useId } from "react";
import type { TooltipItem } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
} from "chart.js";
import type { SensorReadingTrendResponse } from "../../../../types/sensor";
import { useTheme } from "../../../../context/ThemeContext";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
);

interface WaterLevelChartProps {
    trendData: SensorReadingTrendResponse;
    duration: string;
    granularity: "Time" | "Day" | "Day & Time";
}

export default function WaterLevelChart({
    trendData,
    duration,
    granularity,
}: WaterLevelChartProps) {
    const { labels, levels } = trendData;

    // Calculate min and max for y-axis with padding safely
    const validLevels = levels.filter((l) => typeof l === "number" && !isNaN(l));
    const minLevel = validLevels.length > 0 ? Math.min(...validLevels) : 0;
    const maxLevel = validLevels.length > 0 ? Math.max(...validLevels) : 100;
    const range = maxLevel - minLevel || 10; // Fallback range if all values are the same
    const yMin = Math.max(0, Math.floor(minLevel - range * 0.1)); // 10% padding below
    const yMax = Math.ceil(maxLevel + range * 0.1); // 10% padding above

    const { isDark } = useTheme();

    const textColor = isDark ? "#cbd5e1" : "#4b5563"; // slate-300 : gray-600
    const titleColor = isDark ? "#e2e8f0" : "#1f2937"; // slate-200 : gray-800
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

    // Chart.js configuration options
    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top" as const,
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 10,
                    },
                },
                title: {
                    display: true,
                    text: `Water Level Trend (Last ${duration})`,
                    color: titleColor,
                    font: {
                        size: 16,
                        weight: "bold" as const,
                    },
                    padding: {
                        bottom: 10,
                    },
                },
                tooltip: {
                    mode: "index" as const,
                    intersect: false,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleFont: {
                        size: 13,
                    },
                    bodyFont: {
                        size: 13,
                    },
                    callbacks: {
                        label: function (context: TooltipItem<"line">) {
                            return `${context.dataset.label}: ${context.parsed.y} cm`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    min: yMin,
                    max: yMax,
                    grid: {
                        color: gridColor,
                    },
                    ticks: {
                        color: textColor,
                        callback: function (value: string | number) {
                            return `${value} cm`;
                        },
                        font: {
                            size: 12,
                        },
                    },
                    title: {
                        display: true,
                        text: "Water Level (cm)",
                        color: titleColor,
                        font: {
                            size: 12,
                            weight: "bold" as const,
                        },
                    },
                },
                x: {
                    grid: {
                        color: gridColor,
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12,
                        },
                        maxTicksLimit: 12, // Prevent x-axis clutter
                        autoSkip: true,
                    },
                    title: {
                        display: true,
                        text: granularity,
                        color: titleColor,
                        font: {
                            size: 12,
                            weight: "bold" as const,
                        },
                    },
                },
            },
            interaction: {
                mode: "nearest" as const,
                axis: "x" as const,
                intersect: false,
            },
            elements: {
                line: {
                    tension: 0.4, // Smooth line for water level trends
                },
                point: {
                    radius: 3,
                    hoverRadius: 6,
                },
            },
        }),
        [duration, granularity, yMin, yMax, textColor, titleColor, gridColor],
    );

    // Chart data structure
    const data = {
        labels,
        datasets: [
            {
                label: "Water Level",
                data: levels,
                borderColor: "rgb(59, 130, 246)", // Blue color
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "rgb(59, 130, 246)",
                pointBorderColor: "white",
                pointBorderWidth: 2,
            },
        ],
    };

    const chartId = useId();

    return (
        <div className="h-full mt-2 relative w-full overflow-hidden z-10">
            <Line data={data} options={options} id={chartId} key={chartId} />
        </div>
    );
}

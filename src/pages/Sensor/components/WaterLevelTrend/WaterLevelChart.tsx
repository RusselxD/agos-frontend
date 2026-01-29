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

    // Calculate min and max for y-axis with padding
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);
    const range = maxLevel - minLevel;
    const yMin = Math.max(0, Math.floor(minLevel - range * 0.1)); // 10% padding below
    const yMax = Math.ceil(maxLevel + range * 0.1); // 10% padding above

    // Chart.js configuration options
    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top" as const,
                    labels: {
                        usePointStyle: true,
                        padding: 10,
                    },
                },
                title: {
                    display: true,
                    text: `Water Level Trend (Last ${duration})`,
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
                    ticks: {
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
                        font: {
                            size: 12,
                            weight: "bold" as const,
                        },
                    },
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                        },
                        maxTicksLimit: 12, // Prevent x-axis clutter
                        autoSkip: true,
                    },
                    title: {
                        display: true,
                        text: granularity,
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
        [duration, granularity, yMin, yMax],
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
        <div className="h-full mt-2">
            <Line data={data} options={options} id={chartId} key={chartId} />
        </div>
    );
}

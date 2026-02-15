import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import type { TooltipItem } from "chart.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import Container from "../../../../components/ui/Container";
import { formatDate } from "../../../../lib/utils/formatter";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export default function PrecipitationChart() {
    const { summaries } = useReadingLogs();

    const chartData = useMemo(() => {
        const sorted = [...summaries].reverse();
        return {
            labels: sorted.map((s) => formatDate(s.summary_date)),
            minPrecip: sorted.map((s) => s.min_precipitation_mm),
            maxPrecip: sorted.map((s) => s.max_precipitation_mm),
        };
    }, [summaries]);

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top" as const,
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 },
                    },
                },
                tooltip: {
                    mode: "index" as const,
                    intersect: false,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    callbacks: {
                        label: function (context: TooltipItem<"bar">) {
                            return `${context.dataset.label}: ${context.parsed.y} mm`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 11 },
                        callback: (value: string | number) => `${value} mm`,
                    },
                    title: {
                        display: true,
                        text: "Precipitation (mm)",
                        font: { size: 11, weight: "bold" as const },
                    },
                },
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxTicksLimit: 8,
                        maxRotation: 45,
                    },
                },
            },
        }),
        [],
    );

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Max Precipitation",
                data: chartData.maxPrecip,
                backgroundColor: "rgba(10, 61, 98, 0.8)",
                borderColor: "#0A3D62",
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: "Min Precipitation",
                data: chartData.minPrecip,
                backgroundColor: "rgba(26, 188, 156, 0.6)",
                borderColor: "#1ABC9C",
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    return (
        <Container headerTitle="PRECIPITATION LEVELS" className="h-80">
            <div className="h-60">
                <Bar data={data} options={options} />
            </div>
        </Container>
    );
}

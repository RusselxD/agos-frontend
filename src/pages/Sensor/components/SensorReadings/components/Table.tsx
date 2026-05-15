import type { SensorReading } from "../../../../../types/sensor";
import { formatTimestamp } from "../../../../../lib/utils/formatter";

const getTextColor = (status: string) => {
    switch (status) {
        case "rising":
            return "text-red-600 dark:text-red-400";
        case "falling":
            return "text-blue-600 dark:text-blue-400";
        case "stable":
            return "text-green-600 dark:text-emerald-400";
        default:
            return "text-gray-600 dark:text-slate-400";
    }
};

export default function Table({
    sensorReadings,
}: {
    sensorReadings: SensorReading[];
}) {
    return (
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10 text-neutral dark:text-slate-200">
                <tr className="rounded-t-md">
                    <th className="px-4 py-3 font-medium text-center bg-background dark:bg-slate-700/50 rounded-tl-md transition-colors">
                        Water Level (cm)
                    </th>
                    <th className="px-4 py-3 font-medium text-center bg-background dark:bg-slate-700/50 transition-colors">
                        Change Rate (cm)
                    </th>
                    <th className="px-4 py-3 font-medium text-center bg-background dark:bg-slate-700/50 transition-colors">
                        Status
                    </th>
                    <th className="px-4 py-3 font-medium text-center bg-background dark:bg-slate-700/50 rounded-tr-md transition-colors">
                        Timestamp
                    </th>
                </tr>
            </thead>
            <tbody>
                {sensorReadings.map((reading, index) => (
                    <tr
                        key={reading.id}
                        className={`${index % 2 !== 0 ? "bg-gray-50 dark:bg-slate-800/50" : "bg-white dark:bg-slate-800"} text-neutral dark:text-slate-200 transition-colors`}
                    >
                        {/* <td className="px-4 py-3">{reading.device_name}</td> */}
                        <td className="px-4 py-3 text-center">{reading.water_level_cm}</td>
                        <td className="px-4 py-3 text-center">{`${
                            reading.change_rate > 0 ? "+" : ""
                        }${reading.change_rate}`}</td>
                        <td
                            className={`px-4 py-3 font-medium text-center ${getTextColor(
                                reading.status
                            )}`}
                        >
                            {reading.status}
                        </td>
                        <td className="px-4 py-3 text-center">
                            {formatTimestamp(reading.timestamp)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

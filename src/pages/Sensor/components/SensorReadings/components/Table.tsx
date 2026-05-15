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
            <thead className="sticky top-0 z-10 text-gray-700 dark:text-slate-200">
                <tr>
                    <th className="px-4 py-4 font-bold text-center bg-gray-100/80 dark:bg-white/[0.05] rounded-tl-xl transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Water Level (cm)
                    </th>
                    <th className="px-4 py-4 font-bold text-center bg-gray-100/80 dark:bg-white/[0.05] transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Change Rate (cm)
                    </th>
                    <th className="px-4 py-4 font-bold text-center bg-gray-100/80 dark:bg-white/[0.05] transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Status
                    </th>
                    <th className="px-4 py-4 font-bold text-center bg-gray-100/80 dark:bg-white/[0.05] rounded-tr-xl transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Timestamp
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {sensorReadings.map((reading, index) => (
                    <tr
                        key={reading.id}
                        className={`${index % 2 !== 0 ? "bg-gray-50/50 dark:bg-white/[0.01]" : "bg-white/40 dark:bg-transparent"} text-gray-700 dark:text-slate-200 transition-colors hover:bg-gray-100/50 dark:hover:bg-white/[0.03]`}
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

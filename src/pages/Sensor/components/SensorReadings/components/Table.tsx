import type { SensorReading } from "../../../../../types/sensor";
import { formatTimestamp } from "../../../../../lib/utils/formatter";

const getTextColor = (status: string) => {
    switch (status) {
        case "rising":
            return "text-red-600";
        case "falling":
            return "text-blue-600";
        case "stable":
            return "text-green-600";
        default:
            return "text-gray-600";
    }
};

export default function Table({
    sensorReadings,
}: {
    sensorReadings: SensorReading[];
}) {
    return (
        <table className="w-full text-left border-collapse text-sm">
            <thead>
                <tr className="border-b border-base-300">
                    {/* <th className="px-4 py-3 font-medium text-left">
                        Device Name
                    </th> */}
                    <th className="px-4 py-3 font-medium text-left">
                        Water Level (cm)
                    </th>
                    <th className="px-4 py-3 font-medium text-left">
                        Change Rate (cm)
                    </th>
                    <th className="px-4 py-3 font-medium text-left">Status</th>
                    <th className="px-4 py-3 font-medium text-left">
                        Timestamp
                    </th>
                </tr>
            </thead>
            <tbody>
                {sensorReadings.map((reading, index) => (
                    <tr
                        key={reading.id}
                        className={index % 2 !== 0 ? "bg-gray-100" : "bg-white"}
                    >
                        {/* <td className="px-4 py-3">{reading.device_name}</td> */}
                        <td className="px-4 py-3">{reading.water_level_cm}</td>
                        <td className="px-4 py-3">{`${
                            reading.change_rate > 0 ? "+" : ""
                        }${reading.change_rate}`}</td>
                        <td
                            className={`px-4 py-3 font-medium ${getTextColor(
                                reading.status
                            )}`}
                        >
                            {reading.status}
                        </td>
                        <td className="px-4 py-3">
                            {formatTimestamp(reading.timestamp)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

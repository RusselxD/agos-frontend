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
        <>
            <div className="space-y-2 md:hidden">
                {sensorReadings.map((reading) => (
                    <div
                        key={reading.id}
                        className="rounded-lg border border-gray-200 bg-white p-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Water Level
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {reading.water_level_cm} cm
                                </p>
                            </div>
                            <p
                                className={`rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold ${getTextColor(
                                    reading.status,
                                )}`}
                            >
                                {reading.status}
                            </p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Change Rate
                                </p>
                                <p className="font-medium text-gray-800">{`${
                                    reading.change_rate > 0 ? "+" : ""
                                }${reading.change_rate} cm`}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Timestamp
                                </p>
                                <p className="font-medium text-gray-800">
                                    {formatTimestamp(reading.timestamp)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10">
                        <tr className="rounded-t-md">
                            <th className="rounded-tl-md bg-background px-4 py-3 text-center font-medium">
                                Water Level (cm)
                            </th>
                            <th className="bg-background px-4 py-3 text-center font-medium">
                                Change Rate (cm)
                            </th>
                            <th className="bg-background px-4 py-3 text-center font-medium">
                                Status
                            </th>
                            <th className="rounded-tr-md bg-background px-4 py-3 text-center font-medium">
                                Timestamp
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sensorReadings.map((reading, index) => (
                            <tr
                                key={reading.id}
                                className={
                                    index % 2 !== 0 ? "bg-gray-100" : "bg-white"
                                }
                            >
                                <td className="px-4 py-3 text-center">
                                    {reading.water_level_cm}
                                </td>
                                <td className="px-4 py-3 text-center">{`${
                                    reading.change_rate > 0 ? "+" : ""
                                }${reading.change_rate}`}</td>
                                <td
                                    className={`px-4 py-3 text-center font-medium ${getTextColor(
                                        reading.status,
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
            </div>
        </>
    );
}

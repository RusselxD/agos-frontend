import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { Calendar, Clock } from "lucide-react";
import { sensorAPI } from "../../../../../lib/api/sensor";
import { useCoreHook } from "../../../../../context/CoreContext";

interface ChooseDateRangeModalProps {
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface DropdownProps {
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string | number; label: string }[];
    label: string;
}

const Dropdown = ({ value, onChange, options, label }: DropdownProps) => {
    return (
        <div>
            <label className="text-xs text-gray-600 mb-1 block">{label}</label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm focus:border-primary"
            >
                <option value="">Select date</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default function ChooseDateRangeModal({
    setModalIsOpen,
}: ChooseDateRangeModalProps) {
    const [availableDates, setAvailableDates] = useState<
        { value: string; label: string }[]
    >([]);
    const [isFetchingDays, setIsFetchingDays] = useState(false);

    const { sensor_device_id } = useCoreHook();

    useEffect(() => {
        const fetchAvailableDays = async () => {
            try {
                setIsFetchingDays(true);
                const res: string[] = await sensorAPI.getAvailableDays(
                    sensor_device_id
                );

                const availableDates = res.map((dateStr: string) => ({
                    value: dateStr,
                    label: new Date(dateStr).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }),
                }));
                setAvailableDates(availableDates);
            } catch (error) {
            } finally {
                setIsFetchingDays(false);
            }
        };
        fetchAvailableDays();
    }, []);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [startHour, setStartHour] = useState<number>(0);
    const [endHour, setEndHour] = useState<number>(23);

    const { exportSensorReadingsToExcel } = useCoreHook();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const isDateRangeValid =
        startDate && endDate && new Date(startDate) <= new Date(endDate);

    const formatDateTime = (dateStr: string, hour: number): string => {
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        const formattedTime = hour.toString().padStart(2, "0") + ":00";
        return `${formattedDate} ${formattedTime}`;
    };

    const getSelectedRangeText = (): string => {
        if (!isDateRangeValid) return "";
        return `${formatDateTime(startDate, startHour)} - ${formatDateTime(
            endDate,
            endHour
        )}`;
    };

    const handleExport = async () => {
        // Format datetime for backend with UTC timezone: YYYY-MM-DDTHH:mm:ssZ
        const startDateTime = `${startDate}T${startHour
            .toString()
            .padStart(2, "0")}:00:00Z`;
        const endDateTime = `${endDate}T${endHour
            .toString()
            .padStart(2, "0")}:00:00Z`;

        try {
            setModalIsOpen(false);
            await exportSensorReadingsToExcel(startDateTime, endDateTime);
        } catch (error) {
            console.log(error);
        }
    };

    if (isFetchingDays) {
        return (
            <ModalContainer setModalOpen={setModalIsOpen}>
                <div>loading....</div>
            </ModalContainer>
        );
    }

    return (
        <ModalContainer setModalOpen={setModalIsOpen}>
            <div
                className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold text-gray-800">
                    Select Time Range
                </h2>

                {/* Date Range Selection */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <label className="text-sm font-semibold text-gray-700">
                            DATE RANGE
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <Dropdown
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            options={availableDates}
                            label="Start Date"
                        />

                        {/* End Date */}
                        <Dropdown
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            options={availableDates}
                            label="End Date"
                        />
                    </div>

                    {startDate && endDate && !isDateRangeValid && (
                        <p className="text-xs text-red-500 mt-2">
                            Start date must be before or equal to end date
                        </p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                        Select the same date for both to query a single day
                    </p>
                </div>

                {/* Hour Range Selection */}
                {isDateRangeValid && (
                    <div className="animate-in fade-in duration-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <label className="text-sm font-semibold text-gray-700">
                                HOUR RANGE
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Hour */}
                            <Dropdown
                                value={startHour}
                                onChange={(e) =>
                                    setStartHour(Number(e.target.value))
                                }
                                options={hours.map((hour) => ({
                                    value: hour,
                                    label:
                                        hour.toString().padStart(2, "0") +
                                        ":00",
                                }))}
                                label="Start Hour"
                            />

                            {/* End Hour */}
                            <Dropdown
                                value={endHour}
                                onChange={(e) =>
                                    setEndHour(Number(e.target.value))
                                }
                                options={hours.map((hour) => ({
                                    value: hour,
                                    label:
                                        hour.toString().padStart(2, "0") +
                                        ":00",
                                }))}
                                label="End Hour"
                            />
                        </div>

                        {startDate === endDate && startHour >= endHour && (
                            <p className="text-xs text-red-500 mt-2">
                                For single day selection, start hour must be
                                before end hour
                            </p>
                        )}
                    </div>
                )}

                {/* Selected Range Display */}
                {isDateRangeValid && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1 font-semibold">
                            SELECTED RANGE
                        </p>
                        <p className="text-sm font-medium text-blue-900">
                            {getSelectedRangeText()}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setModalIsOpen(false)}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={
                            !isDateRangeValid ||
                            (startDate === endDate && startHour >= endHour)
                        }
                        className="btn-custom bg-primary text-white hover:bg-primary/90 px-6"
                    >
                        Export
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}

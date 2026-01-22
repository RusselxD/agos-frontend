import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { coreAPI } from "../lib/api/core";
import ExcelJS from "exceljs";
import { useToast } from "./ToastContext";
import {
    downloadExcelFile,
    exportToExcel,
    type ExportOptions,
} from "../lib/utils/export";
import type { SensorReadingForExportResponse } from "../types/sensor";
import type {
    CameraDeviceDetails,
    LocationDetails,
    SensorDeviceDetails,
} from "../types/core";
import { sensorAPI } from "../lib/api/sensor";

const sensor_readings_export_columns = [
    {
        header: "Water Level (cm)",
        key: "water_level_cm",
        width: 20,
    },
    {
        header: "Change Rate (cm)",
        key: "change_rate",
        width: 18,
    },
    { header: "Status", key: "status", width: 15 },
    {
        header: "Signal Strength",
        key: "signal_strength",
        width: 20,
    },
    {
        header: "Signal Quality",
        key: "signal_quality",
        width: 20,
    },
    { header: "Timestamp", key: "timestamp", width: 30 },
];

interface LocationAndDevicesContextValue {
    location_id: number;
    sensor_device_id: number;
    camera_device_id: number;

    isExportingToExcel: boolean;

    exportSensorReadingsToExcel: (
        startDate: string,
        endDate: string,
    ) => Promise<void>;
}

const LocationAndDevicesContext = createContext<
    LocationAndDevicesContextValue | undefined
>(undefined);

export function CoreProvider({ children }: { children: React.ReactNode }) {
    const location_details = useRef<LocationDetails>({
        location_id: 1,
        location_name: "",
    });
    const sensor_device_details = useRef<SensorDeviceDetails>({
        sensor_device_id: 1,
        sensor_device_name: "",
    });
    const camera_device_details = useRef<CameraDeviceDetails>({
        camera_device_id: 1,
        camera_device_name: "",
    });

    const [exportingToExcelInProgress, setExportingToExcelInProgress] =
        useState<{ mainMessage: string; subMessage: string }>({
            mainMessage: "",
            subMessage: "",
        });

    const { toastError } = useToast();

    const exportSensorReadingsToExcel = async (
        startDateTime: string,
        endDateTime: string,
    ) => {
        setExportingToExcelInProgress({
            mainMessage: "Fetching sensor readings...",
            subMessage: "",
        });
        const res: SensorReadingForExportResponse =
            await sensorAPI.getSensorReadingsForExport(
                startDateTime,
                endDateTime,
                sensor_device_details.current.sensor_device_id,
            );

        setExportingToExcelInProgress({
            mainMessage: "Generating Excel file...",
            subMessage: `Processing ${res.readings.length.toLocaleString()} rows`,
        });
        const workBook: ExcelJS.Workbook = await exportRecordsToExcel(
            res.readings,
            {
                // fileName: `${sensor_device_details.current.sensor_device_name}_Readings_${startDateTime}_to_${endDateTime}`,
                columns: sensor_readings_export_columns,
            },
        );

        setExportingToExcelInProgress({
            mainMessage: "Downloading Excel file...",
            subMessage: `Processing ${res.readings.length.toLocaleString()} rows`,
        });
        downloadExcelFile(
            workBook,
            `${sensor_device_details.current.sensor_device_name}_Readings_${startDateTime}_to_${endDateTime}.xlsx`,
        );

        setExportingToExcelInProgress({ mainMessage: "", subMessage: "" });
    };

    const exportRecordsToExcel = (
        data: any[],
        options: ExportOptions,
    ): Promise<ExcelJS.Workbook> => {
        return exportToExcel(data, options);
    };

    useEffect(() => {
        const fetchIDs = async () => {
            try {
                const locationIDres = await coreAPI.getLocationDetails();
                location_details.current = locationIDres;

                const deviceDetailsRes = await coreAPI.getDeviceDetails();
                sensor_device_details.current = {
                    sensor_device_id: deviceDetailsRes.sensor_device_id,
                    sensor_device_name: deviceDetailsRes.sensor_device_name,
                };
                camera_device_details.current = {
                    camera_device_id: deviceDetailsRes.camera_device_id,
                    camera_device_name: deviceDetailsRes.camera_device_name,
                };
            } catch (error) {
                toastError("Failed to fetch location and device IDs");
            }
        };

        fetchIDs();
    }, []);

    const contextValue = useMemo(
        () => ({
            location_id: location_details.current.location_id,
            sensor_device_id: sensor_device_details.current.sensor_device_id,
            camera_device_id: camera_device_details.current.camera_device_id,
            isExportingToExcel: exportingToExcelInProgress.mainMessage !== "",
            exportSensorReadingsToExcel,
        }),
        [exportingToExcelInProgress],
    );

    return (
        <LocationAndDevicesContext.Provider value={contextValue}>
            {children}

            {/* Toast for Excel export progress */}
            {exportingToExcelInProgress.mainMessage && (
                <div className="fixed right-10 bottom-10 pl-5 py-4 pr-16 bg-white border-2 border-gray-200 custom-shadow rounded-lg z-[50] flex items-center gap-5">
                    <div className="spinner w-5 h-5 "></div>
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm">
                            {exportingToExcelInProgress.mainMessage}
                        </p>
                        {exportingToExcelInProgress.subMessage && (
                            <p className="text-gray-600 text-xs">
                                {exportingToExcelInProgress.subMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </LocationAndDevicesContext.Provider>
    );
}

export const useCoreHook = () => {
    const context = useContext(LocationAndDevicesContext);
    if (context === undefined) {
        throw new Error("useCoreHook must be used within a CoreProvider");
    }
    return context;
};

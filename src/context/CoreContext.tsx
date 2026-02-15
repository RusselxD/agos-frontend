import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { useToast } from "./ToastContext";
import { downloadExcelFile, exportToExcel } from "../lib/utils/export";
import { coreAPI } from "../lib/api/core";
import type { SensorReadingForExportResponse } from "../types/sensor";
import type {
    LocationDetails,
    SensorDeviceDetails,
    CameraDeviceDetails,
} from "../types/core";
import { sensorAPI } from "../lib/api/sensor";

const STORAGE_KEYS = {
    LOCATION: "core_location",
    SENSOR_DEVICE: "core_sensor_device",
    CAMERA_DEVICE: "core_camera_device",
} as const;

const getObjectFromStorage = <T,>(key: string): T | null => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
};
const setObjectToStorage = (key: string, value: object): void =>
    localStorage.setItem(key, JSON.stringify(value));

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

interface CoreContextValue {
    locationDetails: LocationDetails;
    sensorDeviceDetails: SensorDeviceDetails;
    cameraDeviceDetails: CameraDeviceDetails;
    isExportingToExcel: boolean;
    exportSensorReadingsToExcel: (
        startDate: string,
        endDate: string,
    ) => Promise<void>;
}

const CoreContext = createContext<CoreContextValue | undefined>(undefined);

export function CoreProvider({ children }: { children: React.ReactNode }) {
    const [locationDetails, setLocationDetails] = useState<LocationDetails>(
        () =>
            getObjectFromStorage<LocationDetails>(STORAGE_KEYS.LOCATION) ?? {
                location_id: 0,
                location_name: "",
            },
    );
    const [sensorDeviceDetails, setSensorDeviceDetails] =
        useState<SensorDeviceDetails>(
            () =>
                getObjectFromStorage<SensorDeviceDetails>(
                    STORAGE_KEYS.SENSOR_DEVICE,
                ) ?? {
                    sensor_device_id: 0,
                    sensor_device_name: "",
                },
        );
    const [cameraDeviceDetails, setCameraDeviceDetails] =
        useState<CameraDeviceDetails>(
            () =>
                getObjectFromStorage<CameraDeviceDetails>(
                    STORAGE_KEYS.CAMERA_DEVICE,
                ) ?? {
                    camera_device_id: 0,
                    camera_device_name: "",
                },
        );

    const [exportingToExcelInProgress, setExportingToExcelInProgress] =
        useState<{ mainMessage: string; subMessage: string }>({
            mainMessage: "",
            subMessage: "",
        });

    const { toastError } = useToast();

    // Fetch from API only if localStorage is empty
    useEffect(() => {
        const fetchIfNeeded = async () => {
            try {
                if (!getObjectFromStorage(STORAGE_KEYS.LOCATION)) {
                    const res = await coreAPI.getLocationDetails();
                    setObjectToStorage(STORAGE_KEYS.LOCATION, res);
                    setLocationDetails(res);
                }

                if (!getObjectFromStorage(STORAGE_KEYS.SENSOR_DEVICE)) {
                    const res = await coreAPI.getDeviceDetails();
                    const sensor: SensorDeviceDetails = {
                        sensor_device_id: res.sensor_device_id,
                        sensor_device_name: res.sensor_device_name,
                    };
                    const camera: CameraDeviceDetails = {
                        camera_device_id: res.camera_device_id,
                        camera_device_name: res.camera_device_name,
                    };
                    setObjectToStorage(STORAGE_KEYS.SENSOR_DEVICE, sensor);
                    setObjectToStorage(STORAGE_KEYS.CAMERA_DEVICE, camera);
                    setSensorDeviceDetails(sensor);
                    setCameraDeviceDetails(camera);
                }
            } catch (error) {
                toastError("Failed to fetch location and device details");
            }
        };

        fetchIfNeeded();
    }, []);

    const exportSensorReadingsToExcel = async (
        startDateTime: string,
        endDateTime: string,
    ) => {
        try {
            setExportingToExcelInProgress({
                mainMessage: "Fetching sensor readings...",
                subMessage: "",
            });
            const res: SensorReadingForExportResponse =
                await sensorAPI.getSensorReadingsForExport(
                    startDateTime,
                    endDateTime,
                    sensorDeviceDetails.sensor_device_id,
                );

            setExportingToExcelInProgress({
                mainMessage: "Generating Excel file...",
                subMessage: `Processing ${res.readings.length.toLocaleString()} rows`,
            });
            const workBook: ExcelJS.Workbook = await exportToExcel(
                res.readings,
                { columns: sensor_readings_export_columns },
            );

            setExportingToExcelInProgress({
                mainMessage: "Downloading Excel file...",
                subMessage: `Processing ${res.readings.length.toLocaleString()} rows`,
            });
            downloadExcelFile(
                workBook,
                `${sensorDeviceDetails.sensor_device_name}_Readings_${startDateTime}_to_${endDateTime}.xlsx`,
            );
        } catch (error) {
            toastError("Failed to export sensor readings");
        } finally {
            setExportingToExcelInProgress({ mainMessage: "", subMessage: "" });
        }
    };

    const contextValue = useMemo(
        () => ({
            locationDetails,
            sensorDeviceDetails,
            cameraDeviceDetails,
            isExportingToExcel: exportingToExcelInProgress.mainMessage !== "",
            exportSensorReadingsToExcel,
        }),
        [
            locationDetails,
            sensorDeviceDetails,
            cameraDeviceDetails,
            exportingToExcelInProgress,
        ],
    );

    return (
        <CoreContext.Provider value={contextValue}>
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
        </CoreContext.Provider>
    );
}

export const useCoreHook = () => {
    const context = useContext(CoreContext);
    if (context === undefined) {
        throw new Error("useCoreHook must be used within a CoreProvider");
    }
    return context;
};

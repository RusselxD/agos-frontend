import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { coreAPI } from "../lib/api/core";
import { useToast } from "./ToastContext";

interface LocationAndDevicesContextValue {
    locationId: number;
    sensor_device_id: number;
    camera_device_id: number;
}

const LocationAndDevicesContext = createContext<
    LocationAndDevicesContextValue | undefined
>(undefined);

export function LocationAndDevicesProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const locationId = useRef<number>(1);
    const sensor_device_id = useRef<number>(1);
    const camera_device_id = useRef<number>(1);

    const { toastError } = useToast();

    useEffect(() => {
        const fetchIDs = async () => {
            try {
                const locationIDres = await coreAPI.getLocationID();
                locationId.current = locationIDres;

                const deviceIDsRes = await coreAPI.getDeviceIDs();
                sensor_device_id.current = deviceIDsRes.sensor_device_id;
                camera_device_id.current = deviceIDsRes.camera_device_id;
            } catch (error) {
                toastError("Failed to fetch location and device IDs");
            }
        };

        fetchIDs();
    }, []);

    const contextValue = useMemo(
        () => ({
            locationId: locationId.current,
            sensor_device_id: sensor_device_id.current,
            camera_device_id: camera_device_id.current,
        }),
        []
    );

    return (
        <LocationAndDevicesContext.Provider value={contextValue}>
            {children}
        </LocationAndDevicesContext.Provider>
    );
}

export const useCoreIDs = () => {
    const context = useContext(LocationAndDevicesContext);
    if (context === undefined) {
        throw new Error(
            "useCoreIDs must be used within a LocationAndDevicesProvider"
        );
    }
    return context;
};

import type { DeviceIDs } from "../../types/system_settings";
import apiClient from "./axiosConfig";

export const coreAPI = {
    getLocationID: async (): Promise<number> => {
        const res = await apiClient.get("/core/location-id");
        return res.data as number;
    },

    getDeviceIDs: async (): Promise<DeviceIDs> => {
        const res = await apiClient.get("/core/device-ids");
        return res.data as DeviceIDs;
    },
};

import apiClient from "./axiosConfig";
import type {
    EvacuationCenter,
    EvacuationCenterCreateRequest,
    EvacuationCenterUpdateRequest,
} from "../../types/evacuationCenters";

export const evacuationCentersAPI = {
    getByLocation: async (locationId: number): Promise<EvacuationCenter[]> => {
        const res = await apiClient.get("/evacuation-centers", {
            params: { location_id: locationId },
        });
        return res.data as EvacuationCenter[];
    },

    create: async (
        payload: EvacuationCenterCreateRequest,
    ): Promise<EvacuationCenter> => {
        const res = await apiClient.post("/evacuation-centers", payload);
        return res.data as EvacuationCenter;
    },

    update: async (
        centerId: number,
        payload: EvacuationCenterUpdateRequest,
    ): Promise<EvacuationCenter> => {
        const res = await apiClient.put(
            `/evacuation-centers/${centerId}`,
            payload,
        );
        return res.data as EvacuationCenter;
    },

    remove: async (centerId: number): Promise<void> => {
        await apiClient.delete(`/evacuation-centers/${centerId}`);
    },
};

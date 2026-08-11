import apiClient from "./axiosConfig";
import type {
    EvacuationConfirmRequest,
    EvacuationEvent,
} from "../../types/evacuation";

export const evacuationAPI = {
    confirm: async (
        payload: EvacuationConfirmRequest,
    ): Promise<EvacuationEvent> => {
        const res = await apiClient.post("/evacuation/confirm", payload);
        return res.data as EvacuationEvent;
    },

    getEvents: async (locationId: number): Promise<EvacuationEvent[]> => {
        const res = await apiClient.get("/evacuation/events", {
            params: { location_id: locationId },
        });
        return res.data as EvacuationEvent[];
    },
};

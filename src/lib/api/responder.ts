import type {
    ResponderCreateRequest,
    ResponderAdditionalDetails,
    ResponderListItem,
} from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    bulkCreateResponders: async (
        responders: ResponderCreateRequest[],
    ): Promise<ResponderListItem[]> => {
        try {
            const res = await apiClient.post("/responders/bulk", responders, {
                timeout: 60000, // 60 seconds for bulk operations
            });
            return res.data as ResponderListItem[];
        } catch (error) {
            throw error;
        }
    },

    getAllResponders: async (): Promise<ResponderListItem[]> => {
        try {
            const res = await apiClient.get("/responders/all");
            return res.data as ResponderListItem[];
        } catch (error) {
            throw error;
        }
    },

    getResponderDetails: async (
        responderId: string,
    ): Promise<ResponderAdditionalDetails> => {
        try {
            const res = await apiClient.get(
                `/responders/additional-details/${responderId}`,
            );
            return res.data as ResponderAdditionalDetails;
        } catch (error) {
            throw error;
        }
    },
};

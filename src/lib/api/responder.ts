import type {
    ResponderCreateRequest,
    ResponderAdditionalDetails,
    ResponderListItem,
    SendSMSRequest,
} from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    
    bulkCreateResponders: async (
        responders: ResponderCreateRequest[],
    ): Promise<ResponderListItem[]> => {
        try {
            const res = await apiClient.post("/responder/bulk", responders, {
                timeout: 60000, // 60 seconds for bulk operations
            });
            return res.data as ResponderListItem[];
        } catch (error) {
            throw error;
        }
    },

    getAllResponders: async (): Promise<ResponderListItem[]> => {
        try {
            const res = await apiClient.get("/responder/all");
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
                `/responder/additional-details/${responderId}`,
            );
            return res.data as ResponderAdditionalDetails;
        } catch (error) {
            throw error;
        }
    },

    sendSMS: async (request: SendSMSRequest): Promise<void> => {
        try {
            await apiClient.post("/responder/send-sms", request);
        } catch (error) {
            throw error;
        }
    },
};

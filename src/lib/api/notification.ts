import type { SendNotificationRequest } from "../../types/responder";
import apiClient from "./axiosConfig";

export const notificationAPI = {
    sendAnnouncement: async (
        payload: SendNotificationRequest,
    ): Promise<void> => {
        try {
            await apiClient.post("/push/send-notification", payload);
        } catch (error) {
            throw error;
        }
    },
};

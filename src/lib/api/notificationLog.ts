import type { NotificationType } from "../../types/responder";
import type {
    DeliveryLogPaginatedResponse,
    ResponderNotificationSummary,
} from "../../types/notificationLog";
import apiClient from "./axiosConfig";

export const notificationLogAPI = {
    getRespondersSummary: async (): Promise<ResponderNotificationSummary[]> => {
        try {
            const res = await apiClient.get("/notification-logs/responders-summary");
            return res.data as ResponderNotificationSummary[];
        } catch (error) {
            throw error;
        }
    },

    getResponderDeliveries: async (
        responderId: string,
        page: number = 1,
        pageSize: number = 10,
        type?: NotificationType,
    ): Promise<DeliveryLogPaginatedResponse> => {
        try {
            const params: Record<string, string | number> = { page, page_size: pageSize };
            if (type) {
                params.type = type;
            }
            const res = await apiClient.get(
                `/notification-logs/responder/${responderId}/deliveries`,
                { params },
            );
            return res.data as DeliveryLogPaginatedResponse;
        } catch (error) {
            throw error;
        }
    },
};

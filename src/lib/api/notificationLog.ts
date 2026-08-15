import type { NotificationType } from "../../types/responder";
import type {
    DeliveryLogPaginatedResponse,
    NotificationAnalyticsResponse,
    ResponderNotificationSummaryPaginatedResponse,
} from "../../types/notificationLog";
import apiClient from "./axiosConfig";

export const notificationLogAPI = {
    getRespondersSummary: async (
        page: number = 1,
        pageSize: number = 20,
        search?: string,
        signal?: AbortSignal,
    ): Promise<ResponderNotificationSummaryPaginatedResponse> => {
        const params: Record<string, string | number> = {
            page,
            page_size: pageSize,
        };
        if (search) params.search = search;

        const res = await apiClient.get("/notification-logs/responders-summary", {
            params,
            signal,
        });
        return res.data as ResponderNotificationSummaryPaginatedResponse;
    },

    getResponderDeliveries: async (
        responderId: string,
        page: number = 1,
        pageSize: number = 10,
        type?: NotificationType,
    ): Promise<DeliveryLogPaginatedResponse> => {
        const params: Record<string, string | number> = {
            page,
            page_size: pageSize,
        };
        if (type) {
            params.type = type;
        }
        const res = await apiClient.get(
            `/notification-logs/responder/${responderId}/deliveries`,
            { params },
        );
        return res.data as DeliveryLogPaginatedResponse;
    },

    getAnalytics: async (
        dateFrom?: string,
        dateTo?: string,
    ): Promise<NotificationAnalyticsResponse> => {
        const params: Record<string, string> = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        const res = await apiClient.get("/notification-logs/analytics", { params });
        return res.data as NotificationAnalyticsResponse;
    },

    exportDeliveries: async (
        dateFrom?: string,
        dateTo?: string,
    ): Promise<Record<string, unknown>[]> => {
        const params: Record<string, string> = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        const res = await apiClient.get("/notification-logs/export", { params });
        return res.data as Record<string, unknown>[];
    },
};

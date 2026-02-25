import apiClient from "./axiosConfig";
import type {
    NotificationTemplate,
    NotificationTemplateCreateRequest,
} from "../../types/responder";

export const notificationTemplatesAPI = {
    getAllNotification: async (): Promise<NotificationTemplate[]> => {
        try {
            const res = await apiClient.get("/notification-templates/all");
            return res.data as NotificationTemplate[];
        } catch (error) {
            throw error;
        }
    },

    createNotificationTemplate: async (
        notifTemplate: NotificationTemplateCreateRequest,
    ): Promise<NotificationTemplate> => {
        try {
            const res = await apiClient.post(
                "/notification-templates",
                notifTemplate,
            );
            return res.data as NotificationTemplate;
        } catch (error) {
            throw error;
        }
    },

    updateNotificationTemplate: async (
        templateId: number,
        notifTemplate: NotificationTemplateCreateRequest,
    ): Promise<NotificationTemplate> => {
        try {
            const res = await apiClient.put(
                `/notification-templates/${templateId}`,
                notifTemplate,
            );
            return res.data as NotificationTemplate;
        } catch (error) {
            throw error;
        }
    },


    // deleteMessageTemplate: async (templateId: number): Promise<void> => {
    //     try {
    //         await apiClient.delete(`/message-templates/${templateId}`);
    //     } catch (error) {
    //         throw error;
    //     }
    // },
};

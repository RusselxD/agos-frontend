import type {
    MessageTemplate,
    MessageTemplateCreateRequest,
    ResponderCreateRequest,
    ResponderAdditionalDetails,
    ResponderListItem,
    ResponderGroup,
    ResponderGroupCreateRequest,
    ResponderVerifyRequest,
    ResponderOTPVerifyResponse,
    ResponderOTPVerifyRequest,
    SendSMSRequest,
} from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    getResponderDetailsForApproval: async (
        responderId: string,
    ): Promise<ResponderVerifyRequest> => {
        try {
            const res = await apiClient.get(
                `/responder/for-approval/${responderId}`,
            );
            return res.data as ResponderVerifyRequest;
        } catch (error) {
            throw error;
        }
    },

    sendVerificationOTP: async (responderId: string): Promise<void> => {
        try {
            await apiClient.post(`/responder/send-otp/${responderId}`);
        } catch (error) {
            throw error;
        }
    },

    verifyOTP: async (
        request: ResponderOTPVerifyRequest,
    ): Promise<ResponderOTPVerifyResponse> => {
        try {
            const res = await apiClient.post("/responder/verify-otp", request);
            return res.data as ResponderOTPVerifyResponse;
        } catch (error) {
            throw error;
        }
    },

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

export const messageTemplateAPI = {
    getMessageTemplates: async (): Promise<MessageTemplate[]> => {
        try {
            const res = await apiClient.get("/message-templates/all");
            return res.data as MessageTemplate[];
        } catch (error) {
            throw error;
        }
    },

    createMessageTemplate: async (
        messageTemplate: MessageTemplateCreateRequest,
    ): Promise<MessageTemplate> => {
        try {
            const res = await apiClient.post(
                "/message-templates",
                messageTemplate,
            );
            return res.data as MessageTemplate;
        } catch (error) {
            throw error;
        }
    },

    updateMessageTemplate: async (
        templateId: number,
        messageTemplate: MessageTemplateCreateRequest,
    ): Promise<MessageTemplate> => {
        try {
            const res = await apiClient.put(
                `/message-templates/${templateId}`,
                messageTemplate,
            );
            return res.data as MessageTemplate;
        } catch (error) {
            throw error;
        }
    },

    deleteMessageTemplate: async (templateId: number): Promise<void> => {
        try {
            await apiClient.delete(`/message-templates/${templateId}`);
        } catch (error) {
            throw error;
        }
    },
};

export const responderGroupAPI = {
    getAllGroups: async (): Promise<ResponderGroup[]> => {
        try {
            const res = await apiClient.get("/responder-groups/all");
            return res.data as ResponderGroup[];
        } catch (error) {
            throw error;
        }
    },

    createGroup: async (
        groupCreate: ResponderGroupCreateRequest,
    ): Promise<ResponderGroup> => {
        try {
            const res = await apiClient.post("/responder-groups", groupCreate);
            return res.data as ResponderGroup;
        } catch (error) {
            throw error;
        }
    },

    updateGroup: async (
        groupId: number,
        groupUpdate: ResponderGroupCreateRequest,
    ): Promise<ResponderGroup> => {
        try {
            const res = await apiClient.put(
                `/responder-groups/${groupId}`,
                groupUpdate,
            );
            return res.data as ResponderGroup;
        } catch (error) {
            throw error;
        }
    },

    deleteGroup: async (groupId: number): Promise<void> => {
        try {
            await apiClient.delete(`/responder-groups/${groupId}`);
        } catch (error) {
            throw error;
        }
    },
};

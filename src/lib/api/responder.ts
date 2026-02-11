import type {
    MessageTemplate,
    MessageTemplateCreateRequest,
    ResponderCreateRequest,
    ResponderAdditionalDetails,
    ResponderListItem,
    ResponderOTPRequest,
    ResponderOTPResponse,
    ResponderOTPVerifyRequest,
    ResponderOTPVerifyResponse,
    ResponderGroup,
    ResponderGroupCreateRequest,
} from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
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

    approveResponder: async (responderId: string): Promise<void> => {
        try {
            await apiClient.put(`/responder/approve/${responderId}`);
        } catch (error) {
            throw error;
        }
    },

    createResponder: async (
        responderCreate: ResponderCreateRequest,
    ): Promise<void> => {
        try {
            await apiClient.post("/responder/create", responderCreate);
        } catch (error) {
            throw error;
        }
    },

    sendOTP: async (
        otpRequest: ResponderOTPRequest,
    ): Promise<ResponderOTPResponse> => {
        try {
            const res = await apiClient.post("/responder/send-otp", otpRequest);
            return res.data as ResponderOTPResponse;
        } catch (error) {
            throw error;
        }
    },

    verifyOTP: async (
        verifyOtpRequest: ResponderOTPVerifyRequest,
    ): Promise<ResponderOTPVerifyResponse> => {
        try {
            const res = await apiClient.post(
                "/responder/verify-otp",
                verifyOtpRequest,
            );
            return res.data as ResponderOTPVerifyResponse;
        } catch (error) {
            throw error;
        }
    },

    getMessageTemplates: async (): Promise<MessageTemplate[]> => {
        try {
            const res = await apiClient.get("/message-template/all");
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
                "/message-template",
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
                `/message-template/${templateId}`,
                messageTemplate,
            );
            return res.data as MessageTemplate;
        } catch (error) {
            throw error;
        }
    },

    getAllGroups: async (): Promise<ResponderGroup[]> => {
        try {
            const res = await apiClient.get("/responder-groups/all");
            return res.data as ResponderGroup[];
        } catch (error) {
            throw error;
        }
    },

    createGroup: async (groupCreate: ResponderGroupCreateRequest): Promise<ResponderGroup> => {
        try {
            const res = await apiClient.post("/responder-groups", groupCreate);
            return res.data as ResponderGroup;
        } catch (error) {
            throw error;
        }
    }
};

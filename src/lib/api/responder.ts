import type {
    ResponderCreateRequest,
    ResponderDetailsResponse,
    ResponderListResponse,
    ResponderOTPRequest,
    ResponderOTPResponse,
    ResponderOTPVerifyRequest,
    ResponderOTPVerifyResponse,
} from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    getAllResponders: async (): Promise<ResponderListResponse> => {
        try {
            const res = await apiClient.get("/responder/all");
            return res.data as ResponderListResponse;
        } catch (error) {
            throw error;
        }
    },

    getResponderDetails: async (
        responderId: string,
    ): Promise<ResponderDetailsResponse> => {
        try {
            const res = await apiClient.get(`/responder/${responderId}`);
            return res.data as ResponderDetailsResponse;
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
};

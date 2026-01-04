import type {
    ResponderCreateRequest,
    ResponderOTPRequest,
    ResponderOTPResponse,
    ResponderOTPVerifyRequest,
    ResponderOTPVerifyResponse,
} from "../../types/responder";
import apiClient from "./axiosConfig";

export const responderAPI = {
    createResponder: async (
        responderCreate: ResponderCreateRequest
    ): Promise<void> => {
        try {
            await apiClient.post("/responder/create", responderCreate);
        } catch (error) {
            throw error;
        }
    },

    sendOTP: async (
        otpRequest: ResponderOTPRequest
    ): Promise<ResponderOTPResponse> => {
        try {
            const res = await apiClient.post("/responder/send-otp", otpRequest);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    verifyOTP: async (
        verifyOtpRequest: ResponderOTPVerifyRequest
    ): Promise<ResponderOTPVerifyResponse> => {
        try {
            const res = await apiClient.post(
                "/responder/verify-otp",
                verifyOtpRequest
            );
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};

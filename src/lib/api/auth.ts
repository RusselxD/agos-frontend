import apiClient from "./axiosConfig";

import type {
    ChangePasswordCredentials,
    LoginCredentials,
    TokenResponse,
} from "../../types/auth";

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
        try {
            const res = await apiClient.post("/auth/login", credentials);
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (
        newPasswordCredentials: ChangePasswordCredentials,
    ): Promise<TokenResponse> => {
        try {
            const res = await apiClient.post(
                "/auth/change-password",
                newPasswordCredentials,
            );
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};

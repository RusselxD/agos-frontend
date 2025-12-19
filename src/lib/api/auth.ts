import apiClient from "./axiosConfig";

import type { LoginCredentials, LoginResponse } from "../../types/auth";

export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        const res = await apiClient.post<LoginResponse>(
            "/auth/login",
            credentials
        );
        return res.data;
    },
};

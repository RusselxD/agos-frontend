import apiClient from "./axiosConfig";

export interface LoginCredentials {
    phone_number: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export const authAPI = {
    
    login: async (credentials: LoginCredentials) => {
        const res = await apiClient.post<LoginResponse>(
            "/auth/login",
            credentials
        );
        return res.data;
    },
};

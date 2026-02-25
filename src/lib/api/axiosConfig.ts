import axios, { type InternalAxiosRequestConfig } from "axios";

let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Add a response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.clear();
                if (!window.location.pathname.includes("/auth/login")) {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(error);
            }

            try {
                if (!refreshPromise) {
                    refreshPromise = (async () => {
                        try {
                            const { data } = await axios.post(
                                `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
                                { refresh_token: refreshToken },
                            );
                            localStorage.setItem("authToken", data.access_token);
                            localStorage.setItem("refreshToken", data.refresh_token);
                            return {
                                accessToken: data.access_token,
                                refreshToken: data.refresh_token,
                            };
                        } finally {
                            refreshPromise = null;
                        }
                    })();
                }

                const tokens = await refreshPromise;
                if (tokens) {
                    original.headers.Authorization = `Bearer ${tokens.accessToken}`;
                    return apiClient(original);
                }
            } catch {
                localStorage.clear();
                if (!window.location.pathname.includes("/auth/login")) {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    },
);

export default apiClient;

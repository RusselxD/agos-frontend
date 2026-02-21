import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../lib/api/auth";
import type { LoginCredentials, TokenResponse } from "../types/auth";
import axios from "axios";

interface TokenClaims {
    sub: string;
    is_superuser: boolean;
    is_enabled: boolean;
    force_password_change: boolean;
    exp: number;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    user: TokenClaims | null;
    isAuthChecking: boolean;
    login: (phone_number: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (accessToken: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const decodeToken = (token: string): TokenClaims | null => {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        // JWT payload uses base64url, so normalize before decoding.
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded =
            normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

        const decoded = JSON.parse(atob(padded));
        return decoded as TokenClaims;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

const isTokenValid = (token: string): boolean => {
    const claims = decodeToken(token);
    if (!claims) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return claims.exp > currentTime;
};

const getBaseUrl = () =>
    `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

/**
 * Attempts to refresh tokens when we have a refresh token but expired/invalid access token.
 * Do NOT clear refresh token when only access token is expired - let refresh try first.
 */
const initializeAuth = (): {
    isAuth: boolean;
    user: TokenClaims | null;
    needsRefresh: boolean;
} => {
    const token = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token && isTokenValid(token)) {
        return { isAuth: true, user: decodeToken(token), needsRefresh: false };
    }

    if (refreshToken) {
        return { isAuth: false, user: null, needsRefresh: true };
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    return { isAuth: false, user: null, needsRefresh: false };
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const initialState = useState(initializeAuth)[0];
    const [user, setUser] = useState<TokenClaims | null>(initialState.user);
    const [isAuthenticated, setIsAuthenticated] =
        useState<boolean>(initialState.isAuth);
    const [isAuthChecking, setIsAuthChecking] = useState(initialState.needsRefresh);

    useEffect(() => {
        if (!initialState.needsRefresh) return;

        const doRefresh = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.clear();
                setIsAuthChecking(false);
                return;
            }

            try {
                const { data } = await axios.post<TokenResponse>(
                    `${getBaseUrl()}/auth/refresh`,
                    { refresh_token: refreshToken },
                );
                localStorage.setItem("authToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                const claims = decodeToken(data.access_token);
                setUser(claims);
                setIsAuthenticated(true);
            } catch {
                localStorage.clear();
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsAuthChecking(false);
            }
        };

        doRefresh();
    }, [initialState.needsRefresh]);

    const login = async (
        phoneNumber: string,
        password: string,
    ): Promise<void> => {
        const loginCredentials = {
            phone_number: phoneNumber,
            password: password,
        } as LoginCredentials;

        try {
            const res: TokenResponse = await authAPI.login(loginCredentials);
            localStorage.setItem("refreshToken", res.refresh_token);
            updateUser(res.access_token);
        } catch (error) {
            throw error; // Rethrow to handle in the calling function
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authAPI.logout();

            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {}
    };

    const updateUser = (accessToken: string): void => {
        localStorage.setItem("authToken", accessToken);

        const claims = decodeToken(accessToken);
        setIsAuthenticated(true);
        setUser(claims);
    };

    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            user,
            isAuthChecking,
            login,
            logout,
            updateUser,
        }),
        [isAuthenticated, user, isAuthChecking],
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

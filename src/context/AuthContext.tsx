import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../lib/api/auth";
import type { LoginCredentials, TokenResponse } from "../types/auth";

interface TokenClaims {
    sub: string;
    is_superuser: boolean;
    is_active: boolean;
    force_password_change: boolean;
    exp: number;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    user: TokenClaims | null;
    login: (phone_number: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (accessToken: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const decodeToken = (token: string): TokenClaims | null => {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
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

const initializeAuth = (): {
    isAuth: boolean;
    user: TokenClaims | null;
} => {
    const token = localStorage.getItem("authToken");
    if (!token || !isTokenValid(token)) {
        localStorage.removeItem("authToken");
        return { isAuth: false, user: null };
    }
    return { isAuth: true, user: decodeToken(token) };
};

export function AuthProvider({ children }: { children: ReactNode }) {
    // Initialize auth state from localStorage
    // Runs only once on component mount
    const { isAuth, user: initialUser } = initializeAuth();

    const [user, setUser] = useState<TokenClaims | null>(initialUser);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuth);

    const login = async (
        phoneNumber: string,
        password: string
    ): Promise<void> => {
        const loginCredentials = {
            phone_number: phoneNumber,
            password: password,
        } as LoginCredentials;

        try {
            const res: TokenResponse = await authAPI.login(loginCredentials);
            updateUser(res.access_token);
        } catch (error) {
            throw error; // Rethrow to handle in the calling function
        }
    };

    const logout = (): void => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
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
            login,
            logout,
            updateUser,
        }),
        [isAuthenticated, user]
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

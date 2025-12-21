import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AdminUserResponse } from "../../../types/user";
import type { ReactNode } from "react";
import { adminUsersAPI } from "../../../lib/api/user";
import { useToast } from "../../../context/ToastContext";

interface AdminsPageContextValue {
    admins: AdminUserResponse[];
    isFetching: boolean;
}

const AdminsPageContext = createContext<AdminsPageContextValue | undefined>(
    undefined
);

export function AdminsPageProvider({ children }: { children: ReactNode }) {
    const [admins, setAdmins] = useState<AdminUserResponse[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const { toastError } = useToast();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setIsFetching(true);
                const res = await adminUsersAPI.getAllAdmins();
                setAdmins(res);
            } catch (error) {
                toastError("Failed to fetch admin users");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAdmins();
    }, []);

    const contextValue = useMemo(
        () => ({
            admins,
            isFetching,
        }),
        [admins, isFetching]
    );

    return (
        <AdminsPageContext.Provider value={contextValue}>
            {children}
        </AdminsPageContext.Provider>
    );
}

export const useAdmins = () => {
    const context = useContext(AdminsPageContext);
    if (context === undefined) {
        throw new Error("useAdmins must be used within an AdminsPageProvider");
    }
    return context;
};

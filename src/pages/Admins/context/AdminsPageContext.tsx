import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AdminUserResponse } from "../../../types/adminUser";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { adminUsersAPI } from "../../../lib/api/adminUser";
import { useToast } from "../../../context/ToastContext";

interface AdminsPageContextValue {
    admins: AdminUserResponse[];
    filteredAdmins: AdminUserResponse[];
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    isFetchingAdmins: boolean;
    createNewAdminIsOpen: boolean;
    setCreateNewAdminIsOpen: Dispatch<SetStateAction<boolean>>;
    addNewAdmin: (newAdmin: AdminUserResponse) => void;
    logRefetchTrigger: number;
    triggerLogRefetch: () => void;
    refetchAdmins: () => void;
}

const AdminsPageContext = createContext<AdminsPageContextValue | undefined>(
    undefined
);

export function AdminsPageProvider({ children }: { children: ReactNode }) {
    const [admins, setAdmins] = useState<AdminUserResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFetchingAdmins, setIsFetchingAdmins] = useState<boolean>(true);

    const [createNewAdminIsOpen, setCreateNewAdminIsOpen] =
        useState<boolean>(false);

    const [logRefetchTrigger, setLogRefetchTrigger] = useState<number>(0);

    const triggerLogRefetch = () => {
        setLogRefetchTrigger((prev) => prev + 1);
    };

    const { toastError } = useToast();

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setIsFetchingAdmins(true);
                const res = await adminUsersAPI.getAllAdmins();
                setAdmins(res);
            } catch (error) {
                toastError("Failed to fetch admin users");
            } finally {
                setIsFetchingAdmins(false);
            }
        };

        fetchAdmins();
    }, []);

    const addNewAdmin = (newAdmin: AdminUserResponse) => {
        setAdmins((prevAdmins) => [...prevAdmins, newAdmin]);
    };

    const refetchAdmins = async () => {
        try {
            const res = await adminUsersAPI.getAllAdmins();
            setAdmins(res);
            triggerLogRefetch();
        } catch {
            toastError("Failed to refresh admin users");
        }
    };

    const filteredAdmins = useMemo(() => {
        if (!searchQuery.trim()) return admins;
        const q = searchQuery.toLowerCase();
        return admins.filter(
            (a) =>
                `${a.first_name} ${a.last_name}`.toLowerCase().includes(q) ||
                (a.phone_number && a.phone_number.toLowerCase().includes(q))
        );
    }, [admins, searchQuery]);

    const contextValue = useMemo(
        () => ({
            admins,
            filteredAdmins,
            searchQuery,
            setSearchQuery,
            isFetchingAdmins,
            createNewAdminIsOpen,
            setCreateNewAdminIsOpen,
            addNewAdmin,
            logRefetchTrigger,
            triggerLogRefetch,
            refetchAdmins,
        }),
        [admins, filteredAdmins, searchQuery, isFetchingAdmins, createNewAdminIsOpen, logRefetchTrigger]
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

import apiClient from "./axiosConfig";
import type {
    AdmindUserLogsResponse,
    AdminUserCreateRequest,
    AdminUserResponse,
} from "../../types/adminUser";

export const adminUsersAPI = {
    
    createAdminUser: async (
        adminUser: AdminUserCreateRequest
    ): Promise<AdminUserResponse> => {
        const res = await apiClient.post("admin-users", adminUser);
        return res.data as AdminUserResponse;
    },

    getAllAdmins: async (): Promise<AdminUserResponse[]> => {
        const res = await apiClient.get("admin-users");
        return res.data as AdminUserResponse[];
    },

    deactivateAdmin: async (userId: string, reason: string): Promise<void> => {
        await apiClient.put(`admin-users/${userId}/deactivate`, { reason });
    },

    reactivateAdmin: async (userId: string): Promise<void> => {
        await apiClient.put(`admin-users/${userId}/reactivate`);
    },

    getAdminLogs: async (
        page: number,
        pageSize: number
    ): Promise<AdmindUserLogsResponse> => {
        const res = await apiClient.get("/admin-audit-logs/paginated", {
            params: {
                page: page,
                page_size: pageSize,
            },
        });

        return res.data as AdmindUserLogsResponse;
    },
};

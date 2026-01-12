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

import apiClient from "./axiosConfig";
import type { AdminUserResponse } from "../../types/user";

export const adminUsersAPI = {

    getAllAdmins: async (): Promise<AdminUserResponse[]> => {
        const res = await apiClient.get('admin-users')
        return res.data;
    }

}

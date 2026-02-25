import apiClient from "./axiosConfig";
import type {
    ResponderGroup,
    ResponderGroupCreateRequest,
} from "../../types/responder";

export const responderGroupAPI = {
    getAllGroups: async (): Promise<ResponderGroup[]> => {
        try {
            const res = await apiClient.get("/responder-groups/all");
            return res.data as ResponderGroup[];
        } catch (error) {
            throw error;
        }
    },

    createGroup: async (
        groupCreate: ResponderGroupCreateRequest,
    ): Promise<ResponderGroup> => {
        try {
            const res = await apiClient.post("/responder-groups", groupCreate);
            return res.data as ResponderGroup;
        } catch (error) {
            throw error;
        }
    },

    updateGroup: async (
        groupId: number,
        groupUpdate: ResponderGroupCreateRequest,
    ): Promise<ResponderGroup> => {
        try {
            const res = await apiClient.put(
                `/responder-groups/${groupId}`,
                groupUpdate,
            );
            return res.data as ResponderGroup;
        } catch (error) {
            throw error;
        }
    },

    deleteGroup: async (groupId: number): Promise<void> => {
        try {
            await apiClient.delete(`/responder-groups/${groupId}`);
        } catch (error) {
            throw error;
        }
    },
};

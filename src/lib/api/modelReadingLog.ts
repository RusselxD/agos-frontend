import type {
    BlockageStatus,
    ModelReadingDetailResponse,
    ModelReadingPaginatedResponse,
} from "../../types/modelReadingLog";
import apiClient from "./axiosConfig";

export const modelReadingLogAPI = {
    getPaginated: async (
        page: number = 1,
        pageSize: number = 10,
        cameraDeviceId: number = 1,
        blockageStatus?: BlockageStatus,
    ): Promise<ModelReadingPaginatedResponse> => {
        try {
            const params: Record<string, string | number> = {
                page,
                page_size: pageSize,
                camera_device_id: cameraDeviceId,
            };
            if (blockageStatus) {
                params.blockage_status = blockageStatus;
            }
            const res = await apiClient.get("/model-reading-logs/paginated", { params });
            return res.data as ModelReadingPaginatedResponse;
        } catch (error) {
            throw error;
        }
    },

    getDetail: async (readingId: number): Promise<ModelReadingDetailResponse> => {
        try {
            const res = await apiClient.get(`/model-reading-logs/${readingId}`);
            return res.data as ModelReadingDetailResponse;
        } catch (error) {
            throw error;
        }
    },
};

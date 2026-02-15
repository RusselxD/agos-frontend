import type { DailySummaryPaginatedResponse } from "../../types/readingLogs";
import apiClient from "./axiosConfig";

export const readingLogsAPI = {
    getLogsPaginated: async (
        page: number,
        page_size: number,
        location_id: number,
    ): Promise<DailySummaryPaginatedResponse> => {
        try {
            const res = await apiClient.get("/daily-summaries/paginated", {
                params: {
                    page: page,
                    page_size: page_size,
                    location_id: location_id,
                },
            });
            return res.data as DailySummaryPaginatedResponse;
        } catch (error) {
            throw error;
        }
    },
};

import type { DailySummary } from "../../types/readingLogs";
import apiClient from "./axiosConfig";

export const readingLogsAPI = {
    getAvailableDays: async (location_id: number): Promise<string[]> => {
        try {
            const res = await apiClient.get(
                `/daily-summaries/available-days/${location_id}`,
            );
            return res.data as string[];
        } catch (error) {
            throw error;
        }
    },

    getDailySummaries: async (
        location_id: number,
        start_date: string,
        end_date: string,
    ): Promise<DailySummary[]> => {
        try {
            const res = await apiClient.get(`/daily-summaries`, {
                params: {
                    location_id,
                    start_date,
                    end_date,
                },
            });
            return res.data as DailySummary[];
        } catch (error) {
            throw error;
        }
    },
};

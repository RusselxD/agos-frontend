import type { WeatherComprehensiveResponse } from "../../types/weather";
import apiClient from "./axiosConfig";

export const weatherAPI = {
    getWeatherComprehensive:
        async (locationId: number): Promise<WeatherComprehensiveResponse> => {
            const res = await apiClient.get(`/weather/comprehensive-summary/${locationId}`);
            return res.data as WeatherComprehensiveResponse;
        },
};

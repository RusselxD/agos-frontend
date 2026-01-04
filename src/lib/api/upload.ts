import type { UploadResponse } from "../../types/upload";
import apiClient from "./axiosConfig";

export const uploadAPI = {
    uploadResponderID: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post(
            "/responder/upload-id-photo",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data;
    },
};

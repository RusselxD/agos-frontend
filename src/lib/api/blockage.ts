import { GoogleGenAI } from "@google/genai";
import type { Status } from "../types/blockage";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to convert Base64 to the required API format
const base64ToGenerativePart = (base64String: string, mimeType: string) => {
    const data = base64String.split(",")[1] || base64String;
    return {
        inlineData: {
            data: data,
            mimeType: mimeType,
        },
    };
};

export const sampleBlockageAPI = {
    getBlockageStatus: async (latestFrameBase64: string): Promise<Status> => {
        if (!ai) {
            throw new Error("AI client not initialized");
        }

        const imagePart = base64ToGenerativePart(
            latestFrameBase64,
            "image/jpeg"
        );
        
        const prompt = `
            Analyze the image of the stream. Classify the waterway's flow status.
            Rules: **Clear**: Water is flowing freely, minimal to no debris.
            **Partial**: Moderate debris or partial blockage, flow mostly maintained.
            **Blocked**: Significant debris severely impedes or stops flow.
            Respond with ONLY one word: 'Clear', 'Partial', or 'Blocked'.
        `;
        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [prompt, imagePart],
        });

        console.log(res);

        const statusText = res.text ?? ""; // Default to an empty string if res.text is undefined
        const status = statusText.trim();
        
        if (["Clear", "Partial", "Blocked"].includes(status)) {
            return status as Status;
        } else {
            // Handle unexpected response from the model
            throw new Error("Failed to interpret model response");
        }
    },
};

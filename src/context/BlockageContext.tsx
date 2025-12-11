import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import type { Status } from "../lib/types/blockage";
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface WaterwayContextProps {
    setLatestFrameBase64: React.Dispatch<React.SetStateAction<string | null>>;
    status: Status | null;
    isFetching: boolean;
    error: string | null;
}

const WaterwayContext = createContext<WaterwayContextProps | undefined>(
    undefined
);

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

export function BlockageProvider({ children }: { children: ReactNode }) {
    const [latestFrameBase64, setLatestFrameBase64] = useState<string | null>(
        null
    );
    const [status, setStatus] = useState<Status | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isFirstFetch = useRef(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!ai || !latestFrameBase64) return;

            try {
                if (isFirstFetch.current) {
                    setIsFetching(true);
                    isFirstFetch.current = false;
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
                    setStatus(status as Status);
                } else {
                    // Handle unexpected response from the model
                    setError("Failed to interpret model response");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchAnalysis();
    }, [latestFrameBase64]);

    const contextValue = useMemo(
        () => ({
            setLatestFrameBase64,
            status,
            isFetching,
            error,
        }),
        [setLatestFrameBase64, status, isFetching, error]
    );

    return (
        <WaterwayContext.Provider value={contextValue}>
            {children}
        </WaterwayContext.Provider>
    );
}

export const useWaterwayContext = () => {
    const context = useContext(WaterwayContext);
    if (context === undefined) {
        throw new Error(
            "useWaterwayContext must be used within a WaterwayProvider"
        );
    }
    return context;
};

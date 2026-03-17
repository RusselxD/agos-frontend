import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { useWebSocketMessage } from "./WebSocketContext";

interface CameraFrame {
    image: string;
    timestamp: string;
}

interface VideoContextValue {
    latestFrame: CameraFrame | null;
    isLoading: boolean;
}

const VideoContext = createContext<VideoContextValue | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
    const [latestFrame, setLatestFrame] = useState<CameraFrame | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useWebSocketMessage<CameraFrame>("camera_update", (data) => {
        setLatestFrame(data);
        setIsLoading(false);
    });

    return (
        <VideoContext.Provider value={{ latestFrame, isLoading }}>
            {children}
        </VideoContext.Provider>
    );
}

export function useVideoContext() {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error("useVideoContext must be used within a VideoProvider");
    }
    return context;
}

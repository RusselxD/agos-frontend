import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import Hls from "hls.js";
import { useWaterwayContext } from "./BlockageContext";

interface VideoContextValue {
    // The persistent video DOM element.
    videoElement: HTMLVideoElement | null;

    // Function to move the video into a UI container
    attachVideoContainer: (container: HTMLElement) => void;

    // Function to move the video back to the hidden storage (prevents stream termination)
    detachVideoContainer: () => void;

    isLoading: boolean;
    error: string | null;
    reloadStream: () => void;
}

const VideoContext = createContext<VideoContextValue | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hiddenContainerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const retryCountRef = useRef(0);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get the setter from BlockageContext to update frames
    const { setLatestFrameBase64 } = useWaterwayContext();

    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 10000;

    const streamUrl =
        "https://cdn-005.whatsupcams.com/hls/si_solkankajak.m3u8";
        // "https://cdn-005.whatsupcams.com/hls/ba_mostar01.m3u8";
    // "https://cdn-002.whatsupcams.com/hls/si_solkan02.m3u8";
    // "https://cdn-002.whatsupcams.com/hls/hr_rastoke1.m3u8";
    // "https://videos-3.earthcam.com/fecnetwork/4387.flv/chunklist_w274942325.m3u8?t=UzhbnKWg%2FPy%2BGo5V6Go%2B0iKPv70B5mMBzCZ%2FIR6UFofiOJBj1nKX7cnyarR5nH3i&td=202512120535";
    // "https://videos-3.earthcam.com/fecnetwork/23032.flv/chunklist_w190875193.m3u8?t=mhlmCQFLhmptNf%2FU%2FYGa8sxTJJXTJ56vYZYvqNdAiSKrPTjToBO5hViUDn1KTiAK&td=202512120537";

    // Initialize the Video Element once
    if (!videoRef.current) {
        const v = document.createElement("video");
        v.crossOrigin = "anonymous";
        v.autoplay = true;
        v.muted = true;
        v.playsInline = true;
        v.loop = true;
        // Basic styling to ensure it fits any container it's placed in
        v.style.width = "100%";
        v.style.height = "100%";
        v.style.objectFit = "cover";
        videoRef.current = v;
    }

    const loadStream = () => {
        try {
            const video = videoRef.current;
            if (!video) return;

            setError(null);
            setIsLoading(true);

            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            if (Hls.isSupported()) {
                const hls = new Hls();
                hlsRef.current = hls;

                hls.attachMedia(video);

                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    hls.loadSource(streamUrl);
                });

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video
                        .play()
                        .catch((e) =>
                            console.log("Video playback error (autoplay):", e)
                        );
                });

                // --- HLS.js ERROR HANDLING (Crucial for robust streaming) ---
                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) {
                        console.warn("HLS.js Fatal Error:", data);
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                if (
                                    (data.details as string) ===
                                    "levelParsingError"
                                ) {
                                    console.log(
                                        "Fatal level parsing error, reloading stream..."
                                    );
                                    hls.destroy();
                                    setTimeout(() => loadStream(), 2000);
                                } else {
                                    console.log(
                                        "Fatal network error encountered, trying to recover..."
                                    );
                                    hls.startLoad();
                                }
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log(
                                    "Fatal media error encountered, trying to recover..."
                                );
                                hls.recoverMediaError();
                                break;
                            default:
                                // Cannot recover, do full reload
                                handleStreamFailure();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                video.load();
            } else {
                setError(
                    "HLS is not supported in this browser. Please use Chrome, Firefox, or Safari."
                );
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setError("Error loading stream: " + (error as Error).message);
        }
    };

    const handleStreamFailure = () => {
        if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            console.log(
                `Stream connection lost. Retrying in ${
                    RETRY_DELAY_MS / 1000
                }s... (Attempt ${retryCountRef.current}/${MAX_RETRIES})`
            );
            setTimeout(() => {
                loadStream();
            }, RETRY_DELAY_MS);
        } else {
            setError("Stream failed after multiple attempts.");
            setIsLoading(false);
        }
    };

    const captureFrame = () => {
        const video = videoRef.current;
        if (!video || video.paused || video.ended) return;

        const TARGET_WIDTH = 640;
        const TARGET_HEIGHT = 360;

        const canvas = document.createElement("canvas");
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        try {
            canvas.toBlob(
                (blob) => {
                    if (!blob) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const imageBase64 = reader.result;
                        if (typeof imageBase64 === "string") {
                            setLatestFrameBase64(imageBase64);
                        }
                    };
                    reader.readAsDataURL(blob);
                },
                "image/jpeg",
                0.3
            );
        } catch (e) {
            console.error("Capture failed", e);
        }
    };

    // Lifecycle for stream and listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is initially in the hidden container to allow playback logic to start
        if (hiddenContainerRef.current && !video.parentElement) {
            hiddenContainerRef.current.appendChild(video);
        }

        loadStream();

        const handleLoadedData = () => {
            setIsLoading(false);
            retryCountRef.current = 0;
            captureFrame();
        };

        // We need to manage the interval ID separately because addEventListener doesn't support returning a cleanup
        // So we'll just set the interval in the main effect or use a separate effect for the interval?
        // Actually, the previous code attached 'play' listener.
        // Let's simplify: just set interval here if playing.
        let intervalId: NodeJS.Timeout;

        video.addEventListener("loadeddata", handleLoadedData);

        // Start capturing when it plays
        const onPlay = () => {
            captureFrame();
            intervalId = setInterval(captureFrame, 10 * 60 * 1000);
        };
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", () => clearInterval(intervalId));

        return () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("play", onPlay);
            clearInterval(intervalId);

            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, []);

    const attachVideoContainer = (container: HTMLElement) => {
        if (videoRef.current && container) {
            // If it's already there, do nothing
            if (container.contains(videoRef.current)) return;

            container.appendChild(videoRef.current);

            // Force play after moving node
            if (videoRef.current.paused) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((e) => {
                        console.log("Auto-play prevented after attach:", e);
                    });
                }
            }
        }
    };

    const detachVideoContainer = () => {
    if (videoRef.current && hiddenContainerRef.current) {
        // If it's already there, do nothing
        if (hiddenContainerRef.current.contains(videoRef.current)) return;

        // Clear any text nodes or stray content
        hiddenContainerRef.current.innerHTML = '';
        hiddenContainerRef.current.appendChild(videoRef.current);
    }
};

    return (
        <VideoContext.Provider
            value={{
                videoElement: videoRef.current,
                attachVideoContainer,
                detachVideoContainer,
                isLoading,
                error,
                reloadStream: loadStream,
            }}
        >
            {children}
            {/* Hidden container to keep video alive in DOM when not in Dashboard */}
            <div
                ref={hiddenContainerRef}
                style={{
                    position: "fixed",
                    top: "-10000px",
                    left: "-10000px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                    visibility: "hidden",
                    pointerEvents: "none",
                }}
            ></div>
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

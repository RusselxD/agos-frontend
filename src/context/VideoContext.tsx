import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import Hls from "hls.js";
import axios from "axios";

const createVideoElement = (): HTMLVideoElement => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.autoplay = true;
    v.muted = true;
    v.playsInline = true;
    v.style.width = "100%";
    v.style.height = "100%";
    v.style.objectFit = "cover";
    return v;
};

interface VideoContextValue {
    // The persistent video DOM element.
    videoElement: HTMLVideoElement | null;

    // Function to move the video into a UI container
    attachVideoContainer: (container: HTMLElement) => void;

    // Function to move the video back to the hidden storage (prevents stream termination)
    detachVideoContainer: () => void;

    isLoading: boolean;
    isSyncing: boolean; // New state for resyncing
    error: string | null;
    reloadStream: () => void;
}

const VideoContext = createContext<VideoContextValue | undefined>(undefined);

// Backend configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HLS_STREAM_URL = `${API_BASE_URL}/api/v1/stream/hls/stream.m3u8`;

export function VideoProvider({ children }: { children: ReactNode }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hiddenContainerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const retryCountRef = useRef(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false); // New state
    const [error, setError] = useState<string | null>(null);

    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 10000;

    // Initialize the Video Element once
    if (!videoRef.current) {
        videoRef.current = createVideoElement();
    }

    const loadStream = async (isResync = false) => {
        try {
            const video = videoRef.current;
            if (!video) return;

            setError(null);
            if (isResync) {
                setIsSyncing(true);
            } else {
                setIsLoading(true);
            }

            // --- STEP 1: Check Status & Start if needed ---
            let isReady = false;
            try {
                // Check if the process is running in Python
                const statusRes = await axios.get(
                    `${API_BASE_URL}/api/v1/stream/status`,
                );

                if (!statusRes.data.is_running) {
                    console.log("Stream stopped. Starting engine...");
                    await axios.post(`${API_BASE_URL}/api/v1/stream/start`);
                    // We don't wait here anymore, we rely on the polling loop below to know when it's TRULY ready
                }
            } catch (err) {
                console.warn(
                    "Status check failed (Backend might be down):",
                    err,
                );
                setError("Server is unreachable. Please try again later.");
            }

            // --- STEP 2: The "Availability" Loop (The most important part) ---
            // We poll until the .m3u8 file actually exists on the disk.
            let retries = 0;
            const maxPollRetries = 20; // 20 * 1.5s = 30 seconds max wait

            while (!isReady && retries < maxPollRetries) {
                try {
                    // HEAD request checks if file exists without downloading the whole body
                    await axios.head(HLS_STREAM_URL);
                    isReady = true;
                    console.log("Stream file found! Initializing player...");
                } catch (e) {
                    console.log(
                        `Waiting for stream generation... (${
                            retries + 1
                        }/${maxPollRetries})`,
                    );
                    await new Promise((r) => setTimeout(r, 3000)); // Wait 3s between checks
                    retries++;
                }
            }

            if (!isReady) {
                throw new Error(
                    "Stream timed out. Backend could not generate video files.",
                );
            }

            // --- STEP 3: Initialize Player (Only safe after Step 2) ---

            // Clean up previous instance
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    // STABILITY SETTINGS:
                    lowLatencyMode: false,
                    liveSyncDurationCount: 3, // Reduced to 3 (~18s) to stay closer to live
                    fragLoadingMaxRetry: 3,
                    manifestLoadingMaxRetry: 3,
                    // RESYNC SETTINGS:
                    // If we fall behind (e.g. background tab), play 2x speed to catch up
                    liveMaxLatencyDurationCount: 10,
                    maxLiveSyncPlaybackRate: 2,
                });
                hlsRef.current = hls;

                hls.attachMedia(video);

                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    // Add timestamp (?t=...) to force browser to fetch fresh playlist
                    hls.loadSource(`${HLS_STREAM_URL}?t=${Date.now()}`);
                });

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video
                        .play()
                        .catch((e) => console.log("Autoplay blocked:", e));
                });

                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) {
                        console.warn("HLS.js Fatal Error:", data);
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log(
                                    "Network error, trying to recover...",
                                );
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log(
                                    "Media error, trying to recover...",
                                );
                                hls.recoverMediaError();
                                break;
                            default:
                                setError(
                                    `Fatal Playback Error: ${data.details}`,
                                );
                                handleStreamFailure();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                // Native HLS support (Safari)
                video.src = `${HLS_STREAM_URL}?t=${Date.now()}`;
                video.load();
            } else {
                setError("HLS is not supported in this browser.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setError("Error loading stream: " + (error as Error).message);
            setIsLoading(false);
        }
    };

    const handleStreamFailure = () => {
        if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            const msg = `Stream connection lost. Retrying in ${
                RETRY_DELAY_MS / 1000
            }s... (Attempt ${retryCountRef.current}/${MAX_RETRIES})`;
            console.log(msg);
            setError(msg);
            setTimeout(() => {
                loadStream();
            }, RETRY_DELAY_MS);
        } else {
            setError("Stream failed after multiple attempts.");
            setIsLoading(false);
        }
    };

    // Lifecycle for stream
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is initially in the hidden container
        if (hiddenContainerRef.current && !video.parentElement) {
            hiddenContainerRef.current.appendChild(video);
        }

        loadStream();

        const handleLoadedData = () => {
            setIsLoading(false);
            setIsSyncing(false); // Ensure syncing is cleared
            retryCountRef.current = 0;
        };

        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("playing", () => setIsSyncing(false)); // Clear syncing on play

        // --- NEW: Handle Tab Switching (Visibility Change) ---
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                const hls = hlsRef.current;

                if (hls && video) {
                    console.log("Tab Active: Checking synchronization...");

                    // If the browser throttled the tab, hls.latency might be very high (e.g., >10s)
                    // or the buffer might be empty. We check for drift or stalled state.
                    // Note: hls.latency can be NaN during startup/stall, so we handle that too.
                    const currentLatency = hls.latency || 0;
                    // Relaxed threshold to 30s to avoid false positives on short switches
                    const isDrifted = currentLatency > 30;

                    if (isDrifted) {
                        console.log(
                            `Stream drifted by ${currentLatency.toFixed(1)}s. performing Hard Resync...`,
                        );

                        loadStream(true);
                    } else if (video.paused) {
                        // If we are in sync (low latency) but just paused by the browser
                        console.log("Stream in sync. Resuming playback.");
                        video
                            .play()
                            .catch((e) =>
                                console.log("Resume on visibility failed:", e),
                            );
                    }
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("playing", () => setIsSyncing(false));
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );

            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, []);

    const attachVideoContainer = (container: HTMLElement) => {
        if (videoRef.current && container) {
            if (container.contains(videoRef.current)) return;

            container.appendChild(videoRef.current);

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
            if (hiddenContainerRef.current.contains(videoRef.current)) return;

            hiddenContainerRef.current.innerHTML = "";
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
                isSyncing,
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

import React, { useEffect, useRef, useState } from "react";
import { useWaterwayContext } from "../../../context/BlockageContext";
import Hls from "hls.js"; // Import HLS.js

const Header = (): React.JSX.Element => {
    return (
        <div className="flex items-center justify-between font-semibold mb-2">
            <p className="text-neutral-600">LIVE VISION FEED</p>
            <div className="flex items-center gap-2">
                <span className="bg-red-600 rounded-full w-3 h-3 animate-pulse"></span>
                <span className="text-red-600">LIVE</span>
            </div>
        </div>
    );
};

const VideoPlaceholder = (): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Context Hook
    const { setLatestFrameBase64 } = useWaterwayContext();

    // Stream URL (Keep the WhatsupCams URL)
    const streamUrl = "https://cdn-005.whatsupcams.com/hls/si_solkankajak.m3u8";

    // Retry state
    const retryCountRef = useRef(0);
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 10000; // 10 seconds delay before reconnect attempt

    // The Hls.js instance reference
    const hlsRef = useRef<Hls | null>(null);

    // Function to capture the current video frame
    const captureFrame = () => {
        const video = videoRef.current;
        if (!video || video.paused || video.ended) return;

        // --- OPTIMIZATION: FIXED LOW RESOLUTION FOR API ANALYSIS ---
        const TARGET_WIDTH = 640;
        const TARGET_HEIGHT = 360;
        // -------------------------------------------------------------

        const canvas = document.createElement("canvas");
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        try {
            const imageBase64 = canvas.toDataURL("image/jpeg", 0.5);
            setLatestFrameBase64(imageBase64);
        } catch (e) {
            console.error(
                "Capture failed due to canvas security/browser error.",
                e
            );
        }
    };

    // Function to handle stream errors and attempt a reload
    const loadStream = () => {
        const video = videoRef.current;
        if (!video) return;

        setError(null);
        setIsLoading(true);

        if (hlsRef.current) {
            hlsRef.current.destroy(); // Destroy existing Hls instance before creating a new one
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls; // Store the instance in the ref

            hls.attachMedia(video);

            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                hls.loadSource(streamUrl);
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Manually start playback on HLS success
                video
                    .play()
                    .catch((e) =>
                        console.warn(
                            "Video playback error (user interaction required):",
                            e
                        )
                    );
            });

            // --- HLS.js ERROR HANDLING (Crucial for robust streaming) ---
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS.js Error:", data);

                // Only handle fatal errors that require a restart
                if (data.fatal) {
                    handleStreamFailure();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Fallback for native Safari HLS support
            video.src = streamUrl;
            video.load();
        } else {
            setError(
                "HLS is not supported in this browser. Please use Chrome, Firefox, or Safari."
            );
            setIsLoading(false);
        }
    };

    const handleStreamFailure = () => {
        if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            setError(
                `Stream connection lost. Retrying in ${
                    RETRY_DELAY_MS / 1000
                }s... (Attempt ${retryCountRef.current}/${MAX_RETRIES})`
            );
            console.warn(`Stream retry attempt #${retryCountRef.current}...`);

            // Wait and then attempt to reload the stream
            setTimeout(() => {
                loadStream();
            }, RETRY_DELAY_MS);
        } else {
            setError(
                "Stream failed after multiple attempts. Manual check required."
            );
            console.error("Max stream retries reached. Stopping attempts.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Start the initial loading process
        loadStream();

        let intervalId: NodeJS.Timeout;

        const handleLoadedData = () => {
            setIsLoading(false);
            retryCountRef.current = 0; // Reset counter on successful load
            // Capture the first frame after metadata is loaded
            captureFrame();
        };

        const handlePlay = () => {
            // Start interval for capturing frames (5 minutes)
            intervalId = setInterval(captureFrame, 5 * 60 * 1000);
        };

        const handleError = () => {
            handleStreamFailure();
        };

        // Attach native video listeners
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("error", handleError);
        video.addEventListener("play", handlePlay);

        return () => {
            if (video) {
                video.pause();
                video.src = ""; // Clear source

                // Clean up native listeners
                video.removeEventListener("loadeddata", handleLoadedData);
                video.removeEventListener("error", handleError);
                video.removeEventListener("play", handlePlay);

                // Clean up interval
                clearInterval(intervalId);

                // Clean up HLS.js instance
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }
            }
        };
    }, []);

    // ... (JSX render remains the same) ...
    return (
        <div className="relative bg-black rounded-md w-full h-[32rem] overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Loading stream...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="text-red-500 text-center">
                        <p className="text-xl mb-2">⚠️</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                loop
                // controls
            />

            {/* Optional: Stream info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                Demo Stream (Replace with CCTV feed)
            </div>
        </div>
    );
};

export default function VideoContainer(): React.JSX.Element {
    return (
        <div className="bg-white shadow-lg p-5 flex-1 rounded-md">
            <Header />
            <VideoPlaceholder />
        </div>
    );
}

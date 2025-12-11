import React, { useEffect, useRef, useState } from "react";

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

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Using a public HLS stream (Big Buck Bunny demo)
        const streamUrl =
            "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

        // Check if browser supports HLS natively (Safari)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            video.addEventListener("loadeddata", () => setIsLoading(false));
            video.addEventListener("error", () => {
                setError("Failed to load video stream");
                setIsLoading(false);
            });
        } else {
            // For other browsers, you'd typically use hls.js here
            // For this demo, we'll use a regular mp4 as fallback
            video.src =
                "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
            video.addEventListener("loadeddata", () => setIsLoading(false));
            video.addEventListener("error", () => {
                setError("Failed to load video stream");
                setIsLoading(false);
            });
        }

        return () => {
            if (video) {
                video.pause();
                video.src = "";
            }
        };
    }, []);

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

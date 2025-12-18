import { useEffect, useRef } from "react";
import { useVideoContext } from "../../../context/VideoContext";

const Header = () => {
    return (
        <div className="flex items-center justify-between font-semibold mb-2">
            <p className="text-neutral-600">LIVE VISION FEED</p>
            <div className="flex items-center gap-2">
                <span className="bg-red-600 rounded-full w-3 h-3 pulse-circle"></span>
                <span className="text-red-600">LIVE</span>
            </div>
        </div>
    );
};

const VideoPlaceholder = () => {
    const { attachVideoContainer, detachVideoContainer, isLoading, error } =
        useVideoContext();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            attachVideoContainer(containerRef.current);
        }
        return () => {
            detachVideoContainer();
        };
    }, [attachVideoContainer, detachVideoContainer]);

    return (
        <div
            ref={containerRef}
            className="relative bg-black rounded-md w-full h-[32rem] overflow-hidden"
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Loading stream...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-red-500 text-center">
                        <p className="text-xl mb-2">⚠️</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* The video element is appended here by the context */}

            {/* Stream info overlay */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm z-20 pointer-events-none">
                Cam.01: Maysan Creek 1
            </div>
        </div>
    );
};

export default function VideoContainer() {
    return (
        <div className="bg-white shadow-lg p-5 flex-1 rounded-md">
            <Header />
            <VideoPlaceholder />
        </div>
    );
}

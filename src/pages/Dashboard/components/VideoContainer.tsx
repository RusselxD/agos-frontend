import { useEffect, useRef } from "react";
import { useVideoContext } from "../../../context/VideoContext";
import { useCoreHook } from "../../../context/CoreContext";

const Header = () => {
    const { locationDetails, cameraDeviceDetails } = useCoreHook();

    return (
        <div className="flex items-center justify-between font-semibold mb-2">
            {/* <p className="text-neutral-600">LIVE VISION FEED</p> */}
            <div className=" bg-black/50 text-white px-3 py-1.5 rounded text-sm pointer-events-none">
                {`${cameraDeviceDetails?.camera_device_name} | ${locationDetails?.location_name}`}
            </div>
            <div className="flex items-center gap-2 border border-red-600 bg-red-100 px-3.5 py-0.5 rounded">
                <span className="bg-red-600 rounded-full w-3 h-3"></span>
                <span className="text-red-600">LIVE</span>
            </div>
        </div>
    );
};

const VideoPlaceholder = () => {
    const {
        attachVideoContainer,
        detachVideoContainer,
        isLoading,
        isSyncing,
        error,
    } = useVideoContext();
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
            className="relative bg-black rounded-lg custom-shadow w-full h-[32rem] overflow-hidden"
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Loading stream...</p>
                    </div>
                </div>
            )}

            {isSyncing && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 backdrop-blur-[1px]">
                    <div className="bg-black/60 px-4 py-2 rounded-lg text-white flex items-center gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/80 border-t-transparent"></div>
                        <span className="text-sm font-medium">
                            Syncing live feed...
                        </span>
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
        </div>
    );
};

export default function VideoContainer() {
    return (
        <div className="bg-white custom-shadow p-5 flex-1 rounded-xl">
            <Header />
            <VideoPlaceholder />
        </div>
    );
}

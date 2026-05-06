import { useState, useEffect, useRef } from "react";
import { useVideoContext } from "../../../context/VideoContext";
import { useCoreHook } from "../../../context/CoreContext";
import { Activity, Clock } from "lucide-react";

const Header = () => {
    const { cameraDeviceDetails, locationDetails } = useCoreHook();

    return (
        <div className="flex items-center justify-between font-semibold mb-2">
            <div className="bg-black/50 text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm pointer-events-none truncate mr-2">
                {`${cameraDeviceDetails.camera_device_name} | ${locationDetails.location_name}`}
            </div>
            <div className="flex items-center gap-2 border border-red-600 bg-red-100 px-2.5 py-0.5 md:px-3.5 rounded flex-shrink-0">
                {/* Added pulse animation for better live feel */}
                <span className="bg-red-600 rounded-full w-2.5 h-2.5 md:w-3 md:h-3 animate-pulse"></span>
                <span className="text-red-600 text-sm md:text-base">LIVE</span>
            </div>
        </div>
    );
};

const StreamStatsOverlay = () => {
    const { latestFrame } = useVideoContext();
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [intervalSecs, setIntervalSecs] = useState<number>(10); // Default to 10s initially
    const lastFrameTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (latestFrame) {
            const now = Date.now();
            if (lastFrameTimeRef.current) {
                const diff = (now - lastFrameTimeRef.current) / 1000;
                // Cap the diff to reasonable limits so inactive tabs don't show huge intervals
                if (diff > 1 && diff < 60) {
                    setIntervalSecs(Math.round(diff));
                }
            }
            lastFrameTimeRef.current = now;
            setTimeElapsed(0);
        }
    }, [latestFrame]);

    useEffect(() => {
        if (!latestFrame) return; // Wait for first frame
        
        // Start counting seconds
        const intervalId = setInterval(() => {
            if (lastFrameTimeRef.current) {
                setTimeElapsed(Math.floor((Date.now() - lastFrameTimeRef.current) / 1000));
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [latestFrame]);

    if (!latestFrame) return null;

    // Calculate progress percentage (clamped to 100%)
    const progressPercent = Math.min(100, (timeElapsed / intervalSecs) * 100);

    return (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-none select-none z-10 transition-opacity duration-300">
            {/* Stats Panel */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-lg shadow-xl flex items-center gap-3 w-40 sm:w-48">
                <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-white/70">
                        <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider font-bold flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-red-400" />
                            Latency
                        </span>
                        <span className="font-mono text-[0.7rem] sm:text-xs text-white/90 font-medium">{timeElapsed}s</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-white/70">
                        <span className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider font-bold flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-red-400" />
                            Interval
                        </span>
                        <span className="font-mono text-[0.7rem] sm:text-xs text-white/90 font-medium">~{intervalSecs}s</span>
                    </div>
                </div>
            </div>

            {/* Next Frame ETA Progress Bar */}
            <div className="w-full bg-black/60 backdrop-blur-md rounded-full h-1.5 sm:h-2 border border-white/10 overflow-hidden shadow-xl" title="ETA for next frame">
                <div 
                    className="bg-red-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
};

const VideoPlaceholder = () => {
    const { latestFrame, isLoading } = useVideoContext();

    return (
        <div className="relative bg-black rounded-lg custom-shadow w-full h-[14rem] sm:h-[18rem] md:h-[22rem] lg:h-[26rem] xl:h-[32rem] overflow-hidden group">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-sm md:text-base">Waiting for camera feed...</p>
                    </div>
                </div>
            )}

            {latestFrame && (
                <>
                    <img
                        src={`data:image/jpeg;base64,${latestFrame.image}`}
                        alt="Live camera feed"
                        className="w-full h-full object-cover"
                    />
                    <StreamStatsOverlay />
                </>
            )}
        </div>
    );
};

export default function VideoContainer() {
    return (
        <div className="bg-white custom-shadow p-3 md:p-5 flex-1 rounded-xl">
            <Header />
            <VideoPlaceholder />
        </div>
    );
}
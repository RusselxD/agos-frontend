import { useVideoContext } from "../../../context/VideoContext";
import { useCoreHook } from "../../../context/CoreContext";

const Header = () => {
    const { cameraDeviceDetails, locationDetails } = useCoreHook();

    return (
        <div className="flex items-center justify-between font-semibold mb-2">
            <div className="bg-black/50 text-white px-3 py-1.5 rounded text-sm pointer-events-none">
                {`${cameraDeviceDetails.camera_device_name} | ${locationDetails.location_name}`}
            </div>
            <div className="flex items-center gap-2 border border-red-600 bg-red-100 px-3.5 py-0.5 rounded">
                <span className="bg-red-600 rounded-full w-3 h-3"></span>
                <span className="text-red-600">LIVE</span>
            </div>
        </div>
    );
};

const VideoPlaceholder = () => {
    const { latestFrame, isLoading } = useVideoContext();

    return (
        <div className="relative bg-black rounded-lg custom-shadow w-full h-[32rem] overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p>Waiting for camera feed...</p>
                    </div>
                </div>
            )}

            {latestFrame && (
                <img
                    src={`data:image/jpeg;base64,${latestFrame.image}`}
                    alt="Live camera feed"
                    className="w-full h-full object-cover"
                />
            )}
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

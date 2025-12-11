import React from "react";

const Header = (): React.JSX.Element => {
    return (
        <div className="flex items-center justify-between font-semibold mb-2">
            <p className="text-neutral/80">LIVE VISION FEED</p>
            <div className="flex items-center gap-2">
                <span className="bg-red-600 rounded-full w-3 h-3"></span>
                <span className="text-red-600">LIVE</span>
            </div>
        </div>
    );
};

const VideoPlaceholder = (): React.JSX.Element => {
    return <div className="bg-black rounded-md w-full h-[32rem]"></div>;
};

export default function VideoContainer(): React.JSX.Element {
    return (
        <div className="bg-white custom-shadow p-5 flex-1 rounded-md">
            <Header />
            <VideoPlaceholder />
        </div>
    );
}

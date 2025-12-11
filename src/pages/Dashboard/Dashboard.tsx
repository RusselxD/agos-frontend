import React from "react";
import Header from "./components/Header";
import VideoContainer from "./components/VideoContainer";
import BlockageStatusCard from "./components/BlockageStatusCard";
import WeatherConditionCard from "./components/WeatherConditionCard";
import WaterLevelStatusCard from "./components/WaterLevelStatusCard";

export default function Dashboard(): React.JSX.Element {
    return (
        <div className="flex flex-col gap-4">
            <Header />
            <div className="flex w-full gap-2">
                <VideoContainer />
                <div className="grid gap-2 grid-rows-[0.5fr_1fr_1.3fr] w-2/6">
                    <BlockageStatusCard />
                    <WeatherConditionCard />
                    <WaterLevelStatusCard />
                </div>
            </div>
        </div>
    );
}

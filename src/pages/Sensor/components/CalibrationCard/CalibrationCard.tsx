import React from "react";
import ThresholdsContainer from "./components/ThresholdsContainer";
import StatusContainer from "./components/StatusContainer";
import { CalibrationCardProvider } from "./context/CalibrationCardContext";

export default function CalibrationCard(): React.JSX.Element {
    return (
        <CalibrationCardProvider>
            <div className="bg-white custom-shadow rounded-md p-5 grid grid-cols-[1.5fr_1fr] gap-4">
                <ThresholdsContainer />
                <StatusContainer />
            </div>
        </CalibrationCardProvider>
    );
}

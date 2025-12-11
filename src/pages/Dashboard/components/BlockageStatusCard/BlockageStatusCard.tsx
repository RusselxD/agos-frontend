import React, { useState } from "react";
import CardHeaderText from "../ui/CardHeaderText";
import Card from "../ui/Card";

const Status = {
    CLEAR: "Clear",
    PARTIAL: "Partial",
    BLOCKED: "Blocked",
} as const;

type Status = (typeof Status)[keyof typeof Status];

const barColors = ["bg-clear", "bg-partial", "bg-blocked"];

const getLevelCount = (status: Status): number => {
    switch (status) {
        case Status.CLEAR:
            return 0;
        case Status.PARTIAL:
            return 1;
        case Status.BLOCKED:
            return 2;
    }
};

const StatusText = ({ status }: { status: Status }): React.JSX.Element => {
    const getStatusColor = (status: Status): string => {
        switch (status) {
            case Status.CLEAR:
                return "text-clear";
            case Status.PARTIAL:
                return "text-partial";
            case Status.BLOCKED:
                return "text-blocked";
        }
    };

    const levelCount: number = getLevelCount(status);

    return (
        <div className="flex items-center gap-3 my-2">
            <span
                className={`w-4 h-4 rounded-full ${barColors[levelCount]} ${
                    levelCount === 2 && "pulse-circle"
                }`}
            ></span>
            <span className={`font-bold text-3xl ${getStatusColor(status)}`}>
                {status}
            </span>
        </div>
    );
};

const ProgressBar = ({ status }: { status: Status }): React.JSX.Element => {
    const barCount: number = getLevelCount(status);

    return (
        <div className="relative flex gap-1 pb-7">
            {Array.from({ length: 3 }).map((_, index) => {
                return (
                    <span
                        key={index}
                        className={`w-full rounded-md h-2 ${
                            barCount >= index ? barColors[index] : "bg-gray-200"
                        }`}
                    ></span>
                );
            })}
            <div className="absolute bottom-0 flex items-center justify-between text-gray-500 text-sm w-full">
                <span>Clear</span>
                <span>Blocked</span>
            </div>
        </div>
    );
};

export default function BlockageStatusCard(): React.JSX.Element {
    const [currentStatus, setCurrentStatus] = useState<Status>(Status.PARTIAL);

    return (
        <Card>
            <CardHeaderText label="CURRENT STATUS" />
            <StatusText status={currentStatus} />
            <ProgressBar status={currentStatus} />
        </Card>
    );
}

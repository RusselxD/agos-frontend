import React, { useState } from "react";
import CardHeaderText from "../ui/CardHeaderText";
import Card from "../ui/Card";
import type { Status } from "../../../../lib/types/blockage";
import ProgressBar from "./components/ProgressBar";
import StatusText from "./components/StatusText";
import { useWaterwayContext } from "../../../../context/BlockageContext";
import LoadingCard from "../ui/LoadingCard";

export const barColors = ["bg-clear", "bg-partial", "bg-blocked"];

export const getLevelCount = (status: Status): number => {
    switch (status) {
        case "Clear":
            return 0;
        case "Partial":
            return 1;
        case "Blocked":
            return 2;
    }
};

export default function BlockageStatusCard(): React.JSX.Element {
    const { status, isFetching, error } = useWaterwayContext();

    if (isFetching || !status) {
        return (
            <LoadingCard
                label="CURRENT STATUS"
                desc="Loading blockage status..."
                className="!mb-0 mt-7"
            />
        );
    }

    return (
        <Card>
            <CardHeaderText label="CURRENT STATUS" />
            <StatusText status={status!} />
            <ProgressBar status={status!} />
        </Card>
    );
}

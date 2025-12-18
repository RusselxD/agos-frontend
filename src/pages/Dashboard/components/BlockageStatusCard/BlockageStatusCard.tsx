import { CardHeaderText } from "../ui/Card";
import Card from "../ui/Card";
import type { Status } from "../../../../types/blockage";
import ProgressBar from "./components/ProgressBar";
import StatusText from "./components/StatusText";
import { useWaterwayContext } from "../../../../context/BlockageContext";
import BlockageStatusCardSkeleton from "./components/BlockageStatusCardSkeleton";

export const barColors = ["bg-clear", "bg-partial", "bg-blocked"];

export const getLevelCount = (status: Status | null): number => {
    switch (status) {
        case "Clear":
            return 0;
        case "Partial":
            return 1;
        case "Blocked":
            return 2;
        default:
            return 0;
    }
};

export default function BlockageStatusCard() {
    const { isFetching, error } = useWaterwayContext();

    if (isFetching) {
        return <BlockageStatusCardSkeleton />;
    }

    if (error) {
        return <div>Error</div>;
    }

    return (
        <Card>
            <CardHeaderText label="BLOCKAGE STATUS" />
            <StatusText />
            <ProgressBar />
        </Card>
    );
}

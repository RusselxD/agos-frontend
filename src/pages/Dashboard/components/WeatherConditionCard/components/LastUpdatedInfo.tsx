import { useEffect, useState } from "react";
import { getTimeAgo } from "../../../../../lib/utils/formatter";

export default function LastUpdatedInfo({ timestamp }: { timestamp: string }) {
    const [timeAgo, setTimeAgo] = useState<string>(getTimeAgo(timestamp));

    useEffect(() => {
        setTimeAgo(getTimeAgo(timestamp));
        // Update every 60 seconds
        const intervalId = setInterval(() => {
            setTimeAgo(getTimeAgo(timestamp));
        }, 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [timestamp]);

    return (
        <div className="bg-slate-100 rounded-lg p-2.5 border">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm">{timeAgo}</p>
        </div>
    );
}

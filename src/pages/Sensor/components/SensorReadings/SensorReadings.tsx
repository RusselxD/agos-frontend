import { useEffect, useRef, useState } from "react";
import Container from "../../../../components/ui/Container";
import type {
    SensorReading,
    SensorReadingResponse,
} from "../../../../types/sensor";
import { sensorAPI } from "../../../../lib/api/sensor";
import { useToast } from "../../../../context/ToastContext";
import Table from "./components/Table";
import TableSkeleton from "../../../../components/common/TableSkeleton";
import ExportToExcelButton from "./components/ExportToExcelButton";
import EmptyList from "../../../../components/common/EmptyList";
import { FileText } from "lucide-react";
import { useCoreHook } from "../../../../context/CoreContext";

export default function SensorReadings() {
    const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { toastError } = useToast();
    const { sensorDeviceDetails } = useCoreHook();

    const [page, setPage] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(true);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateAutoLoadMode = () => {
            setAutoLoadEnabled(container.scrollHeight > container.clientHeight + 8);
        };

        updateAutoLoadMode();

        const resizeObserver = new ResizeObserver(updateAutoLoadMode);
        resizeObserver.observe(container);
        window.addEventListener("resize", updateAutoLoadMode);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateAutoLoadMode);
        };
    }, [sensorReadings.length, isFetching, isFetchingMore]);

    // Infinite scroll observer
    useEffect(() => {
        const container = containerRef.current;
        const target = observerTarget.current;

        if (!container || !target || !autoLoadEnabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const isScrollable =
                    container.scrollHeight > container.clientHeight + 8;

                if (
                    entries[0].isIntersecting &&
                    isScrollable &&
                    hasMore &&
                    !isFetchingMore &&
                    !isFetching
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                root: container,
                threshold: 0.1,
            },
        );

        observer.observe(target);

        // Cleanup function
        return () => {
            observer.unobserve(target);
        };
    }, [autoLoadEnabled, hasMore, isFetchingMore, isFetching]);

    useEffect(() => {
        const fetchSensorReadings = async () => {
            try {
                if (page == 1) {
                    setIsFetching(true);
                } else {
                    setIsFetchingMore(true);
                }

                const res: SensorReadingResponse =
                    await sensorAPI.getLatestSensorReadings(
                        page,
                        10,
                        sensorDeviceDetails.sensor_device_id,
                    );
                setSensorReadings((prev) => [...prev, ...res.items]);
                setHasMore(res.has_more);
            } catch (error) {
                console.log("Error fetching sensor readings:", error);
                toastError("Failed to fetch sensor readings.");
                setHasMore(false); // Stop further fetches on error
            } finally {
                setIsFetching(false);
                setIsFetchingMore(false);
            }
        };

        if (hasMore) {
            fetchSensorReadings();
        }
    }, [page]);

    if (isFetching) {
        return <TableSkeleton title="SENSOR READINGS" rows={7} />;
    }

    return (
        <Container
            headerTitle="SENSOR READINGS"
            className="relative flex min-h-[24rem] flex-1 flex-col lg:min-h-0"
        >
            {sensorReadings.length > 0 && <ExportToExcelButton />}

            <div ref={containerRef} className="flex-1 overflow-y-auto pr-1">
                <Table sensorReadings={sensorReadings} />

                {/* Loading indicator for fetching more data */}
                {isFetchingMore && (
                    <div className="space-y-3 mt-3">
                        <div className="skeleton rounded-md w-full h-12"></div>
                        <div className="skeleton rounded-md w-full h-12"></div>
                    </div>
                )}

                {/* Invisible element to trigger loading when this panel scrolls */}
                {hasMore && autoLoadEnabled && (
                    <div ref={observerTarget} className="h-4"></div>
                )}

                {hasMore && !autoLoadEnabled && sensorReadings.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isFetchingMore}
                        className="mt-3 w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isFetchingMore ? "Loading..." : "Load more readings"}
                    </button>
                )}

                {!hasMore && sensorReadings.length > 0 && (
                    <p className="text-center text-sm text-gray-500 py-4">
                        No more data
                    </p>
                )}

                {sensorReadings.length === 0 && (
                    <EmptyList
                        icon={FileText}
                        title="No sensor readings available."
                    />
                )}
            </div>
        </Container>
    );
}

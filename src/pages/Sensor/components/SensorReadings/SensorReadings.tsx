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
import { useCoreHook } from "../../../../context/CoreContext";

export default function SensorReadings() {
    const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { toastError } = useToast();

    const [page, setPage] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const { sensor_device_id } = useCoreHook();

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isFetchingMore &&
                    !isFetching
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                root: containerRef.current,
                threshold: 0.1,
            }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        // Cleanup function
        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isFetchingMore, isFetching]);

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
                        sensor_device_id
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
            className="flex-1 flex flex-col relative"
        >
            <ExportToExcelButton />

            <div ref={containerRef} className="flex-1 overflow-y-auto">
                <Table sensorReadings={sensorReadings} />

                {/* Loading indicator for fetching more data */}
                {isFetchingMore && (
                    <div className="space-y-3 mt-3">
                        <div className="skeleton rounded-md w-full h-12"></div>
                        <div className="skeleton rounded-md w-full h-12"></div>
                    </div>
                )}

                {/* Invisible element to trigger loading */}
                {hasMore && <div ref={observerTarget} className="h-4"></div>}

                {!hasMore && sensorReadings.length > 0 && (
                    <p className="text-center text-sm text-gray-500 py-4">
                        No more data
                    </p>
                )}
            </div>

            {sensorReadings.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                    No sensor readings available.
                </p>
            )}
        </Container>
    );
}

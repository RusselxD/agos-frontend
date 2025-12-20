import { useEffect, useRef, useState } from "react";
import Container from "../../../../components/ui/Container";
import type { SensorReading } from "../../../../types/sensor";
import { sensorAPI } from "../../../../lib/api/sensor";
import { useToast } from "../../../../context/ToastContext";
import Table from "./components/Table";
import TableSkeleton from "./components/TableSkeleton";

export default function SensorReadings() {
    const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { toastError } = useToast();

    const [page, setPage] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

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
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate network delay
                const res = await sensorAPI.getLatestSensorReadings(page, 10);
                setSensorReadings((prev) => [...prev, ...res.items]);
                setHasMore(res.has_more);
            } catch (error) {
                console.log("Error fetching sensor readings:", error);
                toastError("Failed to fetch sensor readings.");
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
        return <TableSkeleton />;
    }

    return (
        <Container
            headerTitle="SENSOR READINGS"
            className="flex-1 flex flex-col"
        >
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

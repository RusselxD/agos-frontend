import { useEffect, useRef, useState, useCallback } from "react";
import Container from "../../../components/ui/Container";
import { formatTimestamp } from "../../../lib/utils/formatter";
import type {
    AdminUserLogs,
    AdmindUserLogsResponse,
} from "../../../types/adminUser";
import { useToast } from "../../../context/ToastContext";
import { adminUsersAPI } from "../../../lib/api/adminUser";
import TableSkeleton from "../../../components/common/TableSkeleton";
import { useAdmins } from "../context/AdminsPageContext";

const Table = ({ logs }: { logs: AdminUserLogs[] }) => {
    return (
        <table className="w-full text-left border-collapse text-sm">
            <thead className="sticky top-0 z-10">
                <tr className="rounded-t-xl text-gray-700 dark:text-slate-200">
                    <th className="px-5 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] rounded-tl-xl transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Admin
                    </th>
                    <th className="px-5 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Details
                    </th>
                    <th className="px-5 py-4 font-bold text-left bg-gray-100/80 dark:bg-white/[0.05] rounded-tr-xl transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                        Timestamp
                    </th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log, index) => (
                    <tr
                        key={index}
                        className={`${index % 2 !== 0 ? "bg-gray-50/50 dark:bg-white/[0.01]" : "bg-white/40 dark:bg-transparent"} text-gray-700 dark:text-slate-200 transition-colors hover:bg-gray-100/50 dark:hover:bg-white/[0.03]`}
                    >
                        <td className="px-4 py-3 text-left">
                            {log.admin_name}
                        </td>

                        <td className="px-4 py-3 text-left">{log.action}</td>
                        <td className="px-4 py-3 text-left">
                            {formatTimestamp(log.created_at)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default function LogsContainer() {
    const [logs, setLogs] = useState<AdminUserLogs[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [isFetching, setIsFetching] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);

    const { toastError } = useToast();
    const { logRefetchTrigger } = useAdmins();
    const lastTriggerRef = useRef<number>(0);

    const fetchLogs = useCallback(
        async (pageToFetch: number, forceLoading = false) => {
            try {
                if (forceLoading) {
                    setIsFetching(true);
                } else {
                    setIsFetchingMore(true);
                }

                const res: AdmindUserLogsResponse =
                    await adminUsersAPI.getAdminLogs(pageToFetch, 10);
                setLogs((prev) => [...prev, ...res.logs]);
                setHasMore(res.has_more);
            } catch (error) {
                toastError("Failed to fetch admin logs");
                setHasMore(false); // Stop further fetches on error
            } finally {
                setIsFetching(false);
                setIsFetchingMore(false);
            }
        },
        [toastError],
    );

    // Initial fetch
    useEffect(() => {
        fetchLogs(1, true);
    }, [fetchLogs]);

    // Refetch logs when trigger changes
    useEffect(() => {
        if (
            logRefetchTrigger > 0 &&
            logRefetchTrigger !== lastTriggerRef.current // to avoid initial run and infinite loop
        ) {
            lastTriggerRef.current = logRefetchTrigger;
            setLogs([]);
            setHasMore(true);
            setIsFetching(false);
            setIsFetchingMore(false);

            if (page === 1) {
                fetchLogs(1, true);
            } else {
                setPage(1);
            }
        }
    }, [logRefetchTrigger, page, fetchLogs]);

    // Fetch more when page changes (but not on initial mount)
    useEffect(() => {
        if (page > 1 && hasMore) {
            fetchLogs(page);
        }
    }, [page]);

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
            },
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

    if (isFetching) {
        return <TableSkeleton title="AUDIT LOGS" rows={3} />;
    }

    return (
        <Container headerTitle="AUDIT LOGS" className="flex-1 flex flex-col">
            <div ref={containerRef} className="overflow-y-auto custom-scrollbar">
                <Table logs={logs} />

                {/* Loading indicator for fetching more data */}
                {isFetchingMore && (
                    <div className="space-y-3 mt-3">
                        <div className="skeleton rounded-md w-full h-12"></div>
                        <div className="skeleton rounded-md w-full h-12"></div>
                    </div>
                )}

                {/* Triggers loading of more data */}
                {hasMore && <div ref={observerTarget} className="h-4"></div>}

                {!hasMore && logs.length > 0 && (
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 py-4">
                        No more logs
                    </p>
                )}
            </div>

            {logs.length === 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-slate-400 py-4">
                    No logs available
                </p>
            )}
        </Container>
    );
}

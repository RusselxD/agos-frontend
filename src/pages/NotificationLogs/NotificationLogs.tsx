import { useEffect, useState } from "react";
import { notificationLogAPI } from "../../lib/api/notificationLog";
import type { NotificationAnalyticsResponse, ResponderNotificationSummary } from "../../types/notificationLog";
import ResponderSummaryCard from "./components/ResponderSummaryCard";
import DeliveryHistoryDrawer from "./components/DeliveryHistoryDrawer";
import { Search, Download, BarChart3 } from "lucide-react";
import { exportToExcel, downloadExcelFile } from "../../lib/utils/export";
import { useToast } from "../../context/ToastContext";

export default function NotificationLogs() {
    const [responders, setResponders] = useState<ResponderNotificationSummary[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedResponder, setSelectedResponder] = useState<ResponderNotificationSummary | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [analytics, setAnalytics] = useState<NotificationAnalyticsResponse | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const { toastSuccess, toastError } = useToast();

    useEffect(() => {
        document.title = "Notification Logs - AGOS";
        return () => { document.title = "AGOS"; };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true);
            try {
                const [summaryData, analyticsData] = await Promise.all([
                    notificationLogAPI.getRespondersSummary(),
                    notificationLogAPI.getAnalytics(),
                ]);
                setResponders(summaryData);
                setAnalytics(analyticsData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, []);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await notificationLogAPI.exportDeliveries();
            if (data.length === 0) {
                toastError("No delivery data to export.");
                return;
            }
            const workbook = await exportToExcel(data, {
                sheetName: "Notification Deliveries",
                autoFilter: true,
                freezeHeader: true,
            });
            downloadExcelFile(workbook, "notification-logs-export.xlsx");
            toastSuccess("Export downloaded successfully.");
        } catch {
            toastError("Failed to export notification logs.");
        } finally {
            setIsExporting(false);
        }
    };

    const filtered = responders.filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
            r.first_name.toLowerCase().includes(q) ||
            r.last_name.toLowerCase().includes(q) ||
            r.phone_number.includes(q)
        );
    });

    const formatTime = (seconds: number | null) => {
        if (seconds === null) return "N/A";
        if (seconds < 60) return `${Math.round(seconds)}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${(seconds / 3600).toFixed(1)}h`;
    };

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden gap-2">
            {/* Analytics summary cards */}
            {analytics && (
                <div className="flex gap-2">
                    <div className="bg-white custom-shadow rounded-xl px-4 py-3 flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Sent</p>
                            <p className="font-bold text-lg">{analytics.total_sent}</p>
                        </div>
                    </div>
                    <div className="bg-white custom-shadow rounded-xl px-4 py-3 flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Acknowledged</p>
                            <p className="font-bold text-lg">{analytics.total_acknowledged} <span className="text-sm font-normal text-gray-400">({(analytics.acknowledgement_rate * 100).toFixed(1)}%)</span></p>
                        </div>
                    </div>
                    <div className="bg-white custom-shadow rounded-xl px-4 py-3 flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Avg Response Time</p>
                            <p className="font-bold text-lg">{formatTime(analytics.avg_response_time_seconds)}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden gap-2">
                {/* Left panel - Responder list */}
                <div className="bg-white custom-shadow rounded-xl p-5 flex-1 h-full overflow-auto min-w-0 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary">
                            NOTIFICATION LOGS
                        </h2>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/5 disabled:opacity-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? "Exporting..." : "Export"}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* List */}
                    {isFetching ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="skeleton w-full h-24 rounded-lg" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-8">
                            {searchQuery ? "No responders match your search." : "No responders found."}
                        </div>
                    ) : (
                        <div className="space-y-2 overflow-auto flex-1">
                            {filtered.map((responder) => (
                                <ResponderSummaryCard
                                    key={responder.id}
                                    responder={responder}
                                    isSelected={selectedResponder?.id === responder.id}
                                    onClick={() => setSelectedResponder(responder)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right panel - Delivery history drawer */}
                <DeliveryHistoryDrawer
                    responder={selectedResponder}
                    onClose={() => setSelectedResponder(null)}
                />
            </div>
        </div>
    );
}

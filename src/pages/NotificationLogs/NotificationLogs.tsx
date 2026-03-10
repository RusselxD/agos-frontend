import { useEffect, useState } from "react";
import { notificationLogAPI } from "../../lib/api/notificationLog";
import type { ResponderNotificationSummary } from "../../types/notificationLog";
import ResponderSummaryCard from "./components/ResponderSummaryCard";
import DeliveryHistoryDrawer from "./components/DeliveryHistoryDrawer";
import { Search } from "lucide-react";

export default function NotificationLogs() {
    const [responders, setResponders] = useState<ResponderNotificationSummary[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedResponder, setSelectedResponder] = useState<ResponderNotificationSummary | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        document.title = "Notification Logs - AGOS";
        return () => {
            document.title = "AGOS";
        };
    }, []);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsFetching(true);
            try {
                const data = await notificationLogAPI.getRespondersSummary();
                setResponders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchSummary();
    }, []);

    const filtered = responders.filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
            r.first_name.toLowerCase().includes(q) ||
            r.last_name.toLowerCase().includes(q) ||
            r.phone_number.includes(q)
        );
    });

    return (
        <div className="flex flex-1 h-full overflow-hidden gap-2">
            {/* Left panel - Responder list */}
            <div className="bg-white custom-shadow rounded-xl p-5 flex-1 h-full overflow-auto min-w-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary">
                        NOTIFICATION LOGS
                    </h2>
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
    );
}

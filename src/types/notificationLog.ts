import type { NotificationType } from "./responder";

export type DeliveryStatus = "pending" | "sent" | "failed";

export interface ResponderNotificationSummary {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: string;
    total_notifications: number;
    total_sent: number;
    total_failed: number;
    total_pending: number;
    total_acknowledged: number;
    last_notified_at: string | null;
}

export interface DeliveryLogItem {
    id: string;
    status: DeliveryStatus;
    sent_at: string | null;
    error_message: string | null;
    created_at: string;
    type: NotificationType;
    title: string;
    message: string;
    dispatched_at: string;
    is_acknowledged: boolean;
    acknowledged_at: string | null;
    acknowledge_message: string | null;
}

export interface DeliveryLogPaginatedResponse {
    items: DeliveryLogItem[];
    has_more: boolean;
}

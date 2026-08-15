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

export interface ResponderNotificationSummaryPaginatedResponse {
    items: ResponderNotificationSummary[];
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    has_more: boolean;
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

export interface TypeBreakdown {
    type: string;
    total: number;
    acknowledged: number;
    avg_response_time_seconds: number | null;
}

export interface ResponderRanking {
    responder_id: string;
    first_name: string;
    last_name: string;
    avg_response_time_seconds: number;
    total_acknowledged: number;
}

export interface NotificationAnalyticsResponse {
    total_sent: number;
    total_acknowledged: number;
    acknowledgement_rate: number;
    avg_response_time_seconds: number | null;
    per_type_breakdown: TypeBreakdown[];
    top_responders: ResponderRanking[];
}

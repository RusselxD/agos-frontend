export type EvacuationKind = "evacuate" | "all_clear";

export interface EvacuationRecommendation {
    recommendation_id: string;
    location_id: number;
    risk_score: number;
    alert_name: string;
    triggered_conditions: string[];
    suggested_message: string;
    created_at: string;
}

export interface EvacuationConfirmRequest {
    location_id: number;
    kind: EvacuationKind;
    message?: string | null;
    recommendation_id?: string | null;
}

export interface EvacuationEvent {
    id: string;
    location_id: number;
    dispatch_id: number | null;
    kind: EvacuationKind;
    authorized_by: string;
    basis_risk_score: number | null;
    message: string;
    created_at: string;
}

export interface PublicAlertPayload {
    level: "be_alert" | "evacuate" | "all_clear";
    title: string;
    message: string;
    location_id: number;
    timestamp: string;
}

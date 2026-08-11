export type EvacuationCenterStatus = "open" | "full" | "closed";

export interface EvacuationCenter {
    id: number;
    location_id: number;
    name: string;
    address: string | null;
    latitude: number;
    longitude: number;
    capacity: number | null;
    contact: string | null;
    status: EvacuationCenterStatus;
    created_at: string;
    updated_at: string;
}

export interface EvacuationCenterCreateRequest {
    location_id: number;
    name: string;
    address: string | null;
    latitude: number;
    longitude: number;
    capacity: number | null;
    contact: string | null;
    status: EvacuationCenterStatus;
}

export type EvacuationCenterUpdateRequest = Partial<
    Omit<EvacuationCenterCreateRequest, "location_id">
>;

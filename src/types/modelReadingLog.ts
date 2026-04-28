export type BlockageStatus = "clear" | "partial" | "blocked";

export interface ModelReadingListItem {
    id: number;
    blockage_status: BlockageStatus;
    blockage_percentage: number;
    timestamp: string;
}

export interface ModelReadingPaginatedResponse {
    items: ModelReadingListItem[];
    has_more: boolean;
}

export interface ModelReadingDetailResponse {
    id: number;
    camera_device_id: number;
    image_path: string;
    blockage_status: BlockageStatus;
    blockage_percentage: number;
    timestamp: string;
    created_at: string;
}

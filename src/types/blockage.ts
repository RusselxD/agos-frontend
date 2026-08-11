import type { SummaryResponse } from "./readingResponse";

export type Status = "Clear" | "Partial" | "Blocked";

// F1 — graded surface-obstruction confidence (additive to the blockage payload).
export type ObstructionTier = "clear" | "possible" | "likely" | "confirmed";

export interface ObstructionConfidence {
    tier: ObstructionTier;
    score: number; // 0..1
    window_size: number;
    flagged_in_window: number;
}

export interface BlockageSummaryResponse extends SummaryResponse{
    blockage_status: Status
    confidence?: ObstructionConfidence | null
}
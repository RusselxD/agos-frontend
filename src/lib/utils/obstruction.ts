/**
 * Translate stable backend obstruction enum values into honest, user-facing
 * language. The camera observes only the water surface, so the UI must never
 * present `blocked` as a confirmed subsurface condition.
 */
export function getSurfaceObstructionLabel(
    status: string | null | undefined,
    compact = false,
): string {
    switch (status?.toLowerCase()) {
        case "clear":
            return "Clear";
        case "partial":
            return compact ? "Possible" : "Possible Surface Obstruction";
        case "blocked":
            return compact ? "Potential" : "Potential Surface Obstruction";
        default:
            return status || "N/A";
    }
}

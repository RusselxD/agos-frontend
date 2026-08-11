import { useWaterwayContext } from "../../../../../context/BlockageContext";
import type { ObstructionTier } from "../../../../../types/blockage";

const TIER_META: Record<
    ObstructionTier,
    { label: string; className: string }
> = {
    clear: {
        label: "Clear",
        className:
            "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    },
    possible: {
        label: "Possible",
        className:
            "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    },
    likely: {
        label: "Likely",
        className:
            "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    },
    confirmed: {
        label: "Confirmed",
        className:
            "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
    },
};

export default function ConfidencePill() {
    const { confidence } = useWaterwayContext();

    if (!confidence) return null;

    const meta = TIER_META[confidence.tier] ?? TIER_META.clear;
    const percent = Math.round(confidence.score * 100);

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${meta.className}`}
            title={`Surface-obstruction confidence: ${meta.label} (${confidence.flagged_in_window}/${confidence.window_size} recent readings flagged)`}
        >
            <span className="uppercase tracking-wide">{meta.label}</span>
            <span className="opacity-70">{percent}%</span>
        </span>
    );
}

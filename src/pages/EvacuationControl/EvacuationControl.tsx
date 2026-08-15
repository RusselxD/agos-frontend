import { useCallback, useEffect, useState } from "react";
import {
    AlertTriangle,
    ShieldCheck,
    Siren,
    History,
    X,
} from "lucide-react";

import Container from "../../components/ui/Container";
import EmptyList from "../../components/common/EmptyList";
import { useCoreHook } from "../../context/CoreContext";
import { useToast } from "../../context/ToastContext";
import { useEvacuation } from "../../context/EvacuationContext";
import { evacuationAPI } from "../../lib/api/evacuation";
import { formatDate } from "../../lib/utils/formatter";
import type { EvacuationEvent, EvacuationKind } from "../../types/evacuation";
import ConfirmDispatchModal from "./components/ConfirmDispatchModal";

const ALL_CLEAR_MESSAGE =
    "The flood threat in your area has subsided. It is now safe. Continue to stay alert and follow local advisories.";

export default function EvacuationControl() {
    const { locationDetails } = useCoreHook();
    const locationId = locationDetails.location_id;
    const { toastSuccess, toastError } = useToast();
    const { recommendation, confirm, dismiss, isDispatching } = useEvacuation();

    const [events, setEvents] = useState<EvacuationEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalKind, setModalKind] = useState<EvacuationKind | null>(null);

    const loadEvents = useCallback(async () => {
        if (!locationId) {
            setEvents([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            setEvents(await evacuationAPI.getEvents(locationId));
        } catch {
            toastError("Failed to load evacuation history");
        } finally {
            setIsLoading(false);
        }
    }, [locationId, toastError]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleConfirm = async (message: string) => {
        if (!modalKind) return;
        try {
            const event = await confirm(modalKind, message);
            toastSuccess(
                modalKind === "evacuate"
                    ? "Evacuation alert dispatched"
                    : "All-clear dispatched",
            );
            setEvents((prev) => [event, ...prev]);
            setModalKind(null);
        } catch (err: unknown) {
            const detail =
                (err as { response?: { data?: { detail?: string } } })?.response
                    ?.data?.detail ?? "Failed to dispatch alert";
            toastError(detail);
        }
    };

    const defaultMessage =
        modalKind === "all_clear"
            ? ALL_CLEAR_MESSAGE
            : recommendation?.suggested_message ??
              "Flood risk in your area has reached a critical level. Please prepare to evacuate and follow instructions from local authorities.";

    return (
        <div className="space-y-4">
            {/* Active recommendation (advisory only) */}
            {recommendation ? (
                <div className="rounded-2xl border-2 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-0.5" />
                            <div>
                                <h2 className="font-bold text-rose-700 dark:text-rose-300">
                                    Evacuation recommended
                                </h2>
                                <p className="text-sm text-rose-600/90 dark:text-rose-300/80 mt-0.5">
                                    Fusion risk score{" "}
                                    <span className="font-semibold">
                                        {recommendation.risk_score}
                                    </span>{" "}
                                    ({recommendation.alert_name}). This is advisory —
                                    no public alert has been sent.
                                </p>
                                {recommendation.triggered_conditions.length > 0 && (
                                    <ul className="mt-2 list-disc pl-5 text-xs text-rose-600/80 dark:text-rose-300/70 space-y-0.5">
                                        {recommendation.triggered_conditions
                                            .slice(0, 4)
                                            .map((c, i) => (
                                                <li key={i}>{c}</li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={dismiss}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                            title="Dismiss"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => setModalKind("evacuate")}
                            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                            <Siren className="w-4 h-4" />
                            Review & Dispatch Evacuation
                        </button>
                    </div>
                </div>
            ) : (
                <Container>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <p className="text-sm">
                            No active evacuation recommendation. Risk is below the
                            evacuation threshold.
                        </p>
                    </div>
                </Container>
            )}

            {/* Manual dispatch controls */}
            <Container headerTitle="Manual Dispatch">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Public alerts are always human-gated. Use these only with proper
                    authority.
                </p>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setModalKind("evacuate")}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                    >
                        <Siren className="w-4 h-4" />
                        Dispatch Evacuation
                    </button>
                    <button
                        onClick={() => setModalKind("all_clear")}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Dispatch All-Clear
                    </button>
                </div>
            </Container>

            {/* Audit log */}
            <Container headerTitle="Audit Log">
                {isLoading ? (
                    <div className="py-8 flex justify-center">
                        <div className="spinner w-6 h-6 text-primary" />
                    </div>
                ) : events.length === 0 ? (
                    <EmptyList icon={History} title="No public alerts dispatched yet." />
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {events.map((event) => (
                            <li key={event.id} className="py-3 flex items-start gap-3">
                                <span
                                    className={`mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        event.kind === "evacuate"
                                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    }`}
                                >
                                    {event.kind === "evacuate" ? "Evacuate" : "All-Clear"}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-800 dark:text-slate-200">
                                        {event.message}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {formatDate(event.created_at)}
                                        {event.basis_risk_score != null &&
                                            ` · risk score ${event.basis_risk_score}`}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Container>

            {modalKind && (
                <ConfirmDispatchModal
                    kind={modalKind}
                    defaultMessage={defaultMessage}
                    isDispatching={isDispatching}
                    setOpen={(open) => !open && setModalKind(null)}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}

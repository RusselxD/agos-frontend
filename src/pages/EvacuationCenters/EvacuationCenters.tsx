import { useCallback, useEffect, useState } from "react";
import { MapPinned, Plus, Pencil, Trash2, Building2 } from "lucide-react";

import Container from "../../components/ui/Container";
import EmptyList from "../../components/common/EmptyList";
import { useCoreHook } from "../../context/CoreContext";
import { useToast } from "../../context/ToastContext";
import { evacuationCentersAPI } from "../../lib/api/evacuationCenters";
import type {
    EvacuationCenter,
    EvacuationCenterStatus,
} from "../../types/evacuationCenters";
import CenterFormModal from "./components/CenterFormModal";

const STATUS_STYLES: Record<EvacuationCenterStatus, string> = {
    open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800",
    full: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-800",
    closed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-300 dark:border-rose-800",
};

const STATUS_OPTIONS: EvacuationCenterStatus[] = ["open", "full", "closed"];

export default function EvacuationCenters() {
    const { locationDetails } = useCoreHook();
    const locationId = locationDetails.location_id;
    const { toastSuccess, toastError } = useToast();

    const [centers, setCenters] = useState<EvacuationCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<EvacuationCenter | null>(null);

    const loadCenters = useCallback(async () => {
        if (!locationId) return;
        setIsLoading(true);
        try {
            const data = await evacuationCentersAPI.getByLocation(locationId);
            setCenters(data);
        } catch {
            toastError("Failed to load evacuation centers");
        } finally {
            setIsLoading(false);
        }
    }, [locationId, toastError]);

    useEffect(() => {
        loadCenters();
    }, [loadCenters]);

    const upsertCenter = (saved: EvacuationCenter) => {
        setCenters((prev) => {
            const exists = prev.some((c) => c.id === saved.id);
            return exists
                ? prev.map((c) => (c.id === saved.id ? saved : c))
                : [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
        });
    };

    const handleStatusFlip = async (
        center: EvacuationCenter,
        status: EvacuationCenterStatus,
    ) => {
        const previous = center.status;
        setCenters((prev) =>
            prev.map((c) => (c.id === center.id ? { ...c, status } : c)),
        );
        try {
            const updated = await evacuationCentersAPI.update(center.id, { status });
            upsertCenter(updated);
        } catch {
            toastError("Failed to update status");
            setCenters((prev) =>
                prev.map((c) =>
                    c.id === center.id ? { ...c, status: previous } : c,
                ),
            );
        }
    };

    const handleDelete = async (center: EvacuationCenter) => {
        if (!window.confirm(`Delete evacuation center "${center.name}"?`)) return;
        try {
            await evacuationCentersAPI.remove(center.id);
            setCenters((prev) => prev.filter((c) => c.id !== center.id));
            toastSuccess("Evacuation center deleted");
        } catch {
            toastError("Failed to delete evacuation center");
        }
    };

    const openCreate = () => {
        setEditing(null);
        setModalOpen(true);
    };
    const openEdit = (center: EvacuationCenter) => {
        setEditing(center);
        setModalOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPinned className="w-6 h-6 text-primary dark:text-blue-400" />
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Evacuation Centers
                    </h1>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                    <Plus className="w-4 h-4" />
                    Add Center
                </button>
            </div>

            <Container>
                {isLoading ? (
                    <div className="py-12 flex justify-center">
                        <div className="spinner w-6 h-6 text-primary" />
                    </div>
                ) : centers.length === 0 ? (
                    <EmptyList
                        icon={Building2}
                        title="No evacuation centers yet. Add one to get started."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                    <th className="py-3 pr-4">Name</th>
                                    <th className="py-3 pr-4">Coordinates</th>
                                    <th className="py-3 pr-4">Capacity</th>
                                    <th className="py-3 pr-4">Contact</th>
                                    <th className="py-3 pr-4">Status</th>
                                    <th className="py-3 pr-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {centers.map((center) => (
                                    <tr
                                        key={center.id}
                                        className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                                    >
                                        <td className="py-3 pr-4">
                                            <div className="font-medium text-slate-900 dark:text-slate-100">
                                                {center.name}
                                            </div>
                                            {center.address && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-[16rem] truncate">
                                                    {center.address}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {center.latitude.toFixed(5)},{" "}
                                            {center.longitude.toFixed(5)}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                                            {center.capacity ?? "—"}
                                        </td>
                                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                                            {center.contact || "—"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <select
                                                value={center.status}
                                                onChange={(e) =>
                                                    handleStatusFlip(
                                                        center,
                                                        e.target.value as EvacuationCenterStatus,
                                                    )
                                                }
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_STYLES[center.status]}`}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option
                                                        key={s}
                                                        value={s}
                                                        className="bg-white text-slate-900"
                                                    >
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(center)}
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(center)}
                                                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Container>

            {modalOpen && (
                <CenterFormModal
                    locationId={locationId}
                    center={editing}
                    setOpen={setModalOpen}
                    onSaved={upsertCenter}
                />
            )}
        </div>
    );
}

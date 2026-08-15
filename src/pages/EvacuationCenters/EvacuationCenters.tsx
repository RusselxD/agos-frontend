import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

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
import CenterStatusSelect from "./components/CenterStatusSelect";
import DeleteCenterModal from "./components/DeleteCenterModal";

export default function EvacuationCenters() {
    const { locationDetails } = useCoreHook();
    const locationId = locationDetails.location_id;
    const { toastSuccess, toastError } = useToast();

    const [centers, setCenters] = useState<EvacuationCenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<EvacuationCenter | null>(null);
    const [centerPendingDelete, setCenterPendingDelete] =
        useState<EvacuationCenter | null>(null);
    const [statusUpdates, setStatusUpdates] = useState<Set<number>>(
        () => new Set(),
    );

    const loadCenters = useCallback(async () => {
        if (!locationId) {
            setCenters([]);
            setIsLoading(false);
            return;
        }
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
            const next = exists
                ? prev.map((c) => (c.id === saved.id ? saved : c))
                : [...prev, saved];

            return next.sort((a, b) => a.name.localeCompare(b.name));
        });
    };

    const handleStatusFlip = async (
        center: EvacuationCenter,
        status: EvacuationCenterStatus,
    ) => {
        if (statusUpdates.has(center.id) || status === center.status) return;

        const previous = center.status;
        setStatusUpdates((prev) => new Set(prev).add(center.id));
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
                    c.id === center.id && c.status === status
                        ? { ...c, status: previous }
                        : c,
                ),
            );
        } finally {
            setStatusUpdates((prev) => {
                const next = new Set(prev);
                next.delete(center.id);
                return next;
            });
        }
    };

    const handleDelete = async () => {
        if (!centerPendingDelete) return;

        try {
            await evacuationCentersAPI.remove(centerPendingDelete.id);
            setCenters((prev) =>
                prev.filter((center) => center.id !== centerPendingDelete.id),
            );
            toastSuccess("Evacuation center deleted");
            setCenterPendingDelete(null);
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
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={openCreate}
                    disabled={!locationId}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
                        title={
                            locationId
                                ? "No evacuation centers yet. Add one to get started."
                                : "Location configuration is unavailable."
                        }
                    />
                ) : (
                    <div className="custom-scrollbar overflow-x-auto">
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
                                            <CenterStatusSelect
                                                value={center.status}
                                                onChange={(status) =>
                                                    handleStatusFlip(
                                                        center,
                                                        status,
                                                    )
                                                }
                                                variant="pill"
                                                disabled={statusUpdates.has(center.id)}
                                                isLoading={statusUpdates.has(center.id)}
                                                ariaLabel={`Status for ${center.name}`}
                                            />
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(center)}
                                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                    title="Edit"
                                                    aria-label={`Edit ${center.name}`}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCenterPendingDelete(center)
                                                    }
                                                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                    title="Delete"
                                                    aria-label={`Delete ${center.name}`}
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

            {centerPendingDelete && (
                <DeleteCenterModal
                    centerName={centerPendingDelete.name}
                    onClose={() => setCenterPendingDelete(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}

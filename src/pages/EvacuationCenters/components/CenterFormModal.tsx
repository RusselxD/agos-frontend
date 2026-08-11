import { useState } from "react";
import { X } from "lucide-react";

import ModalContainer from "../../../components/common/ModalContainer";
import { useToast } from "../../../context/ToastContext";
import { evacuationCentersAPI } from "../../../lib/api/evacuationCenters";
import type {
    EvacuationCenter,
    EvacuationCenterStatus,
} from "../../../types/evacuationCenters";

interface CenterFormModalProps {
    locationId: number;
    center: EvacuationCenter | null; // null => create
    setOpen: (open: boolean) => void;
    onSaved: (center: EvacuationCenter) => void;
}

const STATUS_OPTIONS: EvacuationCenterStatus[] = ["open", "full", "closed"];

export default function CenterFormModal({
    locationId,
    center,
    setOpen,
    onSaved,
}: CenterFormModalProps) {
    const isEdit = center !== null;
    const { toastSuccess, toastError } = useToast();

    const [name, setName] = useState(center?.name ?? "");
    const [latitude, setLatitude] = useState(center?.latitude?.toString() ?? "");
    const [longitude, setLongitude] = useState(
        center?.longitude?.toString() ?? "",
    );
    const [capacity, setCapacity] = useState(
        center?.capacity != null ? center.capacity.toString() : "",
    );
    const [contact, setContact] = useState(center?.contact ?? "");
    const [status, setStatus] = useState<EvacuationCenterStatus>(
        center?.status ?? "open",
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const lat = Number(latitude);
        const lng = Number(longitude);
        if (!name.trim()) return toastError("Name is required");
        if (Number.isNaN(lat) || lat < -90 || lat > 90)
            return toastError("Latitude must be between -90 and 90");
        if (Number.isNaN(lng) || lng < -180 || lng > 180)
            return toastError("Longitude must be between -180 and 180");

        const capacityValue = capacity.trim() === "" ? null : Number(capacity);
        if (capacityValue !== null && (Number.isNaN(capacityValue) || capacityValue < 0))
            return toastError("Capacity must be a non-negative number");

        setIsSaving(true);
        try {
            let saved: EvacuationCenter;
            if (isEdit) {
                saved = await evacuationCentersAPI.update(center!.id, {
                    name: name.trim(),
                    latitude: lat,
                    longitude: lng,
                    capacity: capacityValue,
                    contact: contact.trim() || null,
                    status,
                });
            } else {
                saved = await evacuationCentersAPI.create({
                    location_id: locationId,
                    name: name.trim(),
                    latitude: lat,
                    longitude: lng,
                    capacity: capacityValue,
                    contact: contact.trim() || null,
                    status,
                });
            }
            toastSuccess(
                isEdit ? "Evacuation center updated" : "Evacuation center created",
            );
            onSaved(saved);
            setOpen(false);
        } catch {
            toastError("Failed to save evacuation center");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40";
    const labelClass =
        "block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1";

    return (
        <ModalContainer setModalOpen={() => setOpen(false)}>
            <div
                className="w-[92vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {isEdit ? "Edit Evacuation Center" : "Add Evacuation Center"}
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelClass}>Name</label>
                        <input
                            className={inputClass}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Barangay Hall Covered Court"
                            maxLength={120}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Latitude</label>
                            <input
                                className={inputClass}
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="14.5995"
                                inputMode="decimal"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Longitude</label>
                            <input
                                className={inputClass}
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="120.9842"
                                inputMode="decimal"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Capacity (optional)</label>
                            <input
                                className={inputClass}
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="200"
                                inputMode="numeric"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                className={inputClass}
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as EvacuationCenterStatus)
                                }
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Contact (optional)</label>
                        <input
                            className={inputClass}
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Contact person / number"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                        >
                            {isSaving ? "Saving..." : isEdit ? "Save changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}

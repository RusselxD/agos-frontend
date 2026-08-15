import { useId, useState } from "react";
import { X } from "lucide-react";

import ModalContainer from "../../../components/common/ModalContainer";
import { useToast } from "../../../context/ToastContext";
import { evacuationCentersAPI } from "../../../lib/api/evacuationCenters";
import type {
    EvacuationCenter,
    EvacuationCenterStatus,
} from "../../../types/evacuationCenters";
import CenterStatusSelect from "./CenterStatusSelect";
import LocationPicker, { type PickedLocation } from "./LocationPicker";

interface CenterFormModalProps {
    locationId: number;
    center: EvacuationCenter | null; // null => create
    setOpen: (open: boolean) => void;
    onSaved: (center: EvacuationCenter) => void;
}

export default function CenterFormModal({
    locationId,
    center,
    setOpen,
    onSaved,
}: CenterFormModalProps) {
    const isEdit = center !== null;
    const { toastSuccess, toastError } = useToast();
    const fieldPrefix = useId();
    const titleId = `${fieldPrefix}-title`;
    const nameId = `${fieldPrefix}-name`;
    const locationSearchId = `${fieldPrefix}-location-search`;
    const addressId = `${fieldPrefix}-address`;
    const capacityId = `${fieldPrefix}-capacity`;
    const statusId = `${fieldPrefix}-status`;
    const contactId = `${fieldPrefix}-contact`;

    const [name, setName] = useState(center?.name ?? "");
    const [address, setAddress] = useState(center?.address ?? "");
    const [latitude, setLatitude] = useState<number | null>(
        center?.latitude ?? null,
    );
    const [longitude, setLongitude] = useState<number | null>(
        center?.longitude ?? null,
    );
    const [capacity, setCapacity] = useState(
        center?.capacity != null ? center.capacity.toString() : "",
    );
    const [contact, setContact] = useState(center?.contact ?? "");
    const [status, setStatus] = useState<EvacuationCenterStatus>(
        center?.status ?? "open",
    );
    const [isSaving, setIsSaving] = useState(false);

    const handlePickLocation = (next: PickedLocation) => {
        setLatitude(next.latitude);
        setLongitude(next.longitude);
        // Only overwrite the address when the picker supplies one (reverse
        // geocode / search); a plain map tap leaves the admin's edits intact.
        if (next.address) setAddress(next.address);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return toastError("Name is required");
        if (latitude == null || longitude == null)
            return toastError("Pick the center's location on the map");

        const capacityValue = capacity.trim() === "" ? null : Number(capacity);
        if (
            capacityValue !== null &&
            (!Number.isInteger(capacityValue) || capacityValue < 0)
        )
            return toastError("Capacity must be a non-negative whole number");

        setIsSaving(true);
        try {
            let saved: EvacuationCenter;
            if (isEdit) {
                saved = await evacuationCentersAPI.update(center!.id, {
                    name: name.trim(),
                    address: address.trim() || null,
                    latitude,
                    longitude,
                    capacity: capacityValue,
                    contact: contact.trim() || null,
                    status,
                });
            } else {
                saved = await evacuationCentersAPI.create({
                    location_id: locationId,
                    name: name.trim(),
                    address: address.trim() || null,
                    latitude,
                    longitude,
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
        "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
    const labelClass =
        "block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1";
    const handleClose = () => {
        if (!isSaving) setOpen(false);
    };

    return (
        <ModalContainer setModalOpen={handleClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="custom-scrollbar w-[92vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2
                        id={titleId}
                        className="text-lg font-bold text-slate-900 dark:text-slate-100"
                    >
                        {isEdit ? "Edit Evacuation Center" : "Add Evacuation Center"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor={nameId} className={labelClass}>
                            Name
                        </label>
                        <input
                            id={nameId}
                            autoFocus
                            disabled={isSaving}
                            className={inputClass}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Barangay Hall Covered Court"
                            maxLength={120}
                        />
                    </div>

                    <div>
                        <label htmlFor={locationSearchId} className={labelClass}>
                            Location
                        </label>
                        <LocationPicker
                            searchInputId={locationSearchId}
                            latitude={latitude}
                            longitude={longitude}
                            onChange={handlePickLocation}
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label htmlFor={addressId} className={labelClass}>
                            Address (optional)
                        </label>
                        <input
                            id={addressId}
                            disabled={isSaving}
                            className={inputClass}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Auto-filled from the map — edit if needed"
                            maxLength={255}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor={capacityId} className={labelClass}>
                                Capacity (optional)
                            </label>
                            <input
                                id={capacityId}
                                type="number"
                                min={0}
                                step={1}
                                disabled={isSaving}
                                className={inputClass}
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="200"
                                inputMode="numeric"
                            />
                        </div>
                        <div>
                            <label htmlFor={statusId} className={labelClass}>
                                Status
                            </label>
                            <CenterStatusSelect
                                id={statusId}
                                value={status}
                                onChange={setStatus}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor={contactId} className={labelClass}>
                            Contact (optional)
                        </label>
                        <input
                            id={contactId}
                            disabled={isSaving}
                            className={inputClass}
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Contact person / number"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
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

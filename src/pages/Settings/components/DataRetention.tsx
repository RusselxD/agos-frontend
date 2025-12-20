import { Info } from "lucide-react";
import Container from "../../../components/ui/Container";
import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { settingsAPI } from "../../../lib/api/settings";
import type { SystemSettingsUpdate } from "../../../types/system_settings";

const InfoBox = () => {
    return (
        <div className="flex items-center text-sm gap-2 bg-primary p-3 text-white rounded-md">
            <Info />
            <span>
                Auto-deletion is always active to ensure system stability and
                optimal performance.
            </span>
        </div>
    );
};

export default function DataRetention() {
    const [originalValue, setOriginalValue] = useState<number>(7);
    const [newValue, setNewValue] = useState<number>(7);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const { toastSuccess, toastError } = useToast();

    useEffect(() => {
        const fetchDataRetention = async () => {
            try {
                const res = await settingsAPI.getSettingValue(
                    "data_retention_days"
                );
                setOriginalValue(Number(res));
                setNewValue(Number(res));
            } catch (error) {
                console.log("here");
                toastError(
                    "Failed to fetch data retention period. Please try again."
                );
            } finally {
            }
        };

        fetchDataRetention();
    }, []);

    const handleConfirmChanges = async () => {
        if (isUpdating) return;

        try {
            setIsUpdating(true);

            const res = await settingsAPI.updateDataRetention({
                key: "data_retention_days",
                json_value: JSON.stringify(newValue),
            } as SystemSettingsUpdate);

            setOriginalValue(Number(res));
            setNewValue(Number(res));
            setIsEditing(false);

            toastSuccess("Data retention period updated successfully.");
        } catch (error) {
            console.log("dito");
            toastError(
                "Failed to update data retention period. Please try again."
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDragRange = (value: number) => {
        console.log("Value: ", value);
        console.log("Original Value: ", originalValue);
        setIsEditing(value !== originalValue);
        setNewValue(value);
    };

    return (
        <Container className="space-y-3" headerTitle="DATA RETENTION">
            <InfoBox />
            <div>
                <div className="flex items-center justify-between">
                    <p className="text-gray-700">Retention Period</p>
                    <p className="font-semibold text-blue-700">{`${newValue} days`}</p>
                </div>
                <input
                    type="range"
                    min={7}
                    max={30}
                    className="w-full cursor-pointer"
                    value={newValue}
                    onChange={(e) => handleDragRange(Number(e.target.value))}
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>{`7 days (Min)`}</p>
                    <p>{`30 days (Max)`}</p>
                </div>
            </div>
            <div className="space-x-2 font-medium flex items-center">
                <button
                    className="btn-custom bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary flex items-center"
                    disabled={!isEditing || isUpdating}
                    onClick={() => handleConfirmChanges()}
                >
                    {isUpdating && <div className="spinner w-5 h-5 mr-3"></div>}
                    <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                    disabled={!isEditing || isUpdating}
                    onClick={() => {
                        setIsEditing(false);
                        setNewValue(originalValue);
                    }}
                    className="btn-cancel"
                >
                    Cancel
                </button>
            </div>
        </Container>
    );
}

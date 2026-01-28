import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { settingsAPI } from "../../../lib/api/settings";

export default function AutoSendCriticalSMSToggle() {
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { toastSuccess, toastError } = useToast();

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const res = await settingsAPI.getSettingValue(
                    "auto_send_sms_when_critical",
                );
                setIsEnabled(res === "true");
            } catch (error) {
                toastError(
                    "Failed to fetch SMS alert setting. Please try again.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchSetting();
    }, [toastError]);

    const handleToggle = async () => {
        if (isLoading || isSaving) return;

        const nextValue = !isEnabled;
        setIsEnabled(nextValue);
        setIsSaving(true);

        try {
            await settingsAPI.updateSetting({
                key: "auto_send_sms_when_critical",
                json_value: JSON.stringify(nextValue),
            });

            toastSuccess(
                "Automatic SMS for critical alerts updated successfully.",
            );
        } catch (error) {
            setIsEnabled(!nextValue);
            toastError("Failed to update SMS alert setting. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    console.log("Hey");
    console.log("isEnabled", isEnabled);

    return (
        <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
            <div>
                <p className="font-semibold text-gray-800">
                    Automatically send SMS for critical alerts
                </p>
                <p className="text-sm text-gray-500">
                    When enabled, an SMS will be sent automatically whenever a
                    critical alert is triggered.
                </p>
            </div>
            <button
                type="button"
                onClick={handleToggle}
                disabled={isLoading || isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? "bg-primary" : "bg-gray-300"
                } ${isLoading || isSaving ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        isEnabled ? "translate-x-5" : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}

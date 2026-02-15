import { Info } from "lucide-react";

interface SendRecipientsInfoProps {
    selectedCount: number;
}

export default function SendRecipientsInfo({
    selectedCount,
}: SendRecipientsInfoProps) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-3 text-blue-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm">
                This message will be sent to{" "}
                <span className="font-semibold">
                    {selectedCount} recipient
                    {selectedCount > 1 ? "s" : ""}
                </span>
                . Please review the message carefully before sending.
            </p>
        </div>
    );
}

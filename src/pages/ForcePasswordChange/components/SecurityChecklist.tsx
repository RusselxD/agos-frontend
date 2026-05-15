import { Circle, CircleCheck, Shield } from "lucide-react";
import type { Checklist } from "./ResetPasswordForm";

const CheckListItem = ({ value, label }: { value: boolean; label: string }) => {
    return (
        <div
            className={`flex items-center gap-2 transition-colors ${
                value ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-500 dark:text-slate-400"
            }`}
        >
            {value ? <CircleCheck size={18} /> : <Circle size={18} />}
            <span>{label}</span>
        </div>
    );
};

export default function SecurityChecklist({
    checklist,
}: {
    checklist: Checklist;
}) {
    return (
        <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800/50 rounded-md p-4 transition-colors">
            <div className="flex items-center gap-2 text-sm mb-3 font-medium text-blue-600 dark:text-blue-400 transition-colors">
                <Shield size={18} />
                <p>Security Checklist</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-slate-300 transition-colors">
                <CheckListItem
                    value={checklist.atLeats8Chars}
                    label="At least 8 characters"
                />
                <CheckListItem
                    value={checklist.hasUppercase}
                    label="Has uppercase letter"
                />
                <CheckListItem
                    value={checklist.hasLowercase}
                    label="Has lowercase letter"
                />
                <CheckListItem value={checklist.hasNumber} label="Has number" />
                <CheckListItem
                    value={checklist.hasSpecialChar}
                    label="Has special character"
                />
                <CheckListItem
                    value={checklist.passwordsMatch}
                    label="Passwords match"
                />
            </div>
        </div>
    );
}

import type { ResponderGroup } from "../../../../../../types/responder";

interface GroupSelectProps {
    groups: ResponderGroup[];
    value: string;
    onChange: (groupId: string) => void;
    onSelectionChange?: () => void;
    disabled?: boolean;
}

export default function GroupSelect({
    groups,
    value,
    onChange,
    onSelectionChange,
    disabled,
}: GroupSelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                GROUP
            </label>
            <select
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    onSelectionChange?.();
                }}
                disabled={disabled || groups.length === 0}
                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-slate-900/50"
            >
                {groups.length === 0 ? (
                    <option value="">No groups available</option>
                ) : (
                    groups.map((g) => (
                        <option key={g.id} value={String(g.id)}>
                            {g.group_name} ({g.member_ids.length} member
                            {g.member_ids.length !== 1 ? "s" : ""})
                        </option>
                    ))
                )}
            </select>
        </div>
    );
}

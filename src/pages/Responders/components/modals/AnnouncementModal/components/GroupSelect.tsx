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
            <label className="text-sm font-semibold text-gray-700">
                GROUP
            </label>
            <select
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    onSelectionChange?.();
                }}
                disabled={disabled || groups.length === 0}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 disabled:bg-gray-100"
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

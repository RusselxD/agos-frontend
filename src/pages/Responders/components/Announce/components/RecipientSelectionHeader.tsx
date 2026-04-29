interface RecipientSelectionHeaderProps {
    onSelectAll: () => void;
    onDeselectAll: () => void;
    selectAllDisabled: boolean;
    deselectAllDisabled: boolean;
}

export default function RecipientSelectionHeader({
    onSelectAll,
    onDeselectAll,
    selectAllDisabled,
    deselectAllDisabled,
}: RecipientSelectionHeaderProps) {
    return (
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="w-full border-l-4 border-primary pl-2 font-semibold text-gray-600">
                SELECT RECIPIENTS
            </h2>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button
                    type="button"
                    onClick={onSelectAll}
                    disabled={selectAllDisabled}
                    className="btn-custom rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Select All
                </button>
                <button
                    type="button"
                    onClick={onDeselectAll}
                    disabled={deselectAllDisabled}
                    className="btn-custom rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Deselect All
                </button>
            </div>
        </div>
    );
}

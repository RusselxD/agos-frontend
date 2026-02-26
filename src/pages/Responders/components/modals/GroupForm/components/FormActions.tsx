interface FormActionsProps {
    isSaving: boolean;
    isSubmitDisabled: boolean;
    submitLabel: string;
    onCancel: () => void;
}

export default function FormActions({
    isSaving,
    isSubmitDisabled,
    submitLabel,
    onCancel,
}: FormActionsProps) {
    return (
        <div className="flex items-center justify-end gap-2 text-sm">
            <button type="button" className="btn-cancel" onClick={onCancel}>
                Cancel
            </button>
            <button
                disabled={isSubmitDisabled}
                type="submit"
                className="btn-custom bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary"
            >
                {isSaving && <div className="spinner h-4 w-4"></div>}
                <span>{submitLabel}</span>
            </button>
        </div>
    );
}

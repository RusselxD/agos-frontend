import type {
    NotificationTemplate,
    ResponderGroup,
    ResponderListItem,
} from "../../../../../../types/responder";
import Label from "./Label";
import GroupSelect from "./GroupSelect";
import RecipientsList from "./RecipientsList";
import ConfirmCheckbox from "./ConfirmCheckbox";
import ErrorAlert from "./ErrorAlert";
import ModalActions from "./ModalActions";

interface AnnounceModalFormProps {
    template: NotificationTemplate;
    groups: ResponderGroup[];
    selectedGroupId: string;
    setSelectedGroupId: (id: string) => void;
    responderIds: string[];
    selectedResponders: ResponderListItem[];
    confirmSend: boolean;
    setConfirmSend: (v: boolean) => void;
    error: string;
    isFetching: boolean;
    isSending: boolean;
    isSendDisabled: boolean;
    onAnnounce: () => void | Promise<void>;
    onCancel: () => void;
}

export default function AnnounceModalForm({
    template,
    groups,
    selectedGroupId,
    setSelectedGroupId,
    responderIds,
    selectedResponders,
    confirmSend,
    setConfirmSend,
    error,
    isFetching,
    isSending,
    isSendDisabled,
    onAnnounce,
    onCancel,
}: AnnounceModalFormProps) {
    return (
        <div className="flex flex-col gap-3">
            <Label label="NOTIFICATION TITLE" value={template.title} />
            <Label label="NOTIFICATION MESSAGE" value={template.message} />

            <div className="flex flex-col gap-2">
                <GroupSelect
                    groups={groups}
                    value={selectedGroupId}
                    onChange={setSelectedGroupId}
                    onSelectionChange={() => setConfirmSend(false)}
                    disabled={isFetching}
                />
                <RecipientsList
                    responders={selectedResponders}
                    count={responderIds.length}
                />
            </div>

            <ConfirmCheckbox checked={confirmSend} onChange={setConfirmSend} />

            {error && <ErrorAlert message={error} />}

            <ModalActions
                onCancel={onCancel}
                onSend={onAnnounce}
                isSending={isSending}
                sendDisabled={isSendDisabled}
            />
        </div>
    );
}

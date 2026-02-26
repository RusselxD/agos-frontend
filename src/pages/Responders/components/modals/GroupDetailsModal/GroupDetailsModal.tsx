import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import type {
    ResponderGroup,
    ResponderListItem,
} from "../../../../../types/responder";
import ResponderPageModalContainer from "../ResponderPageModalContainer";
import GroupSummary from "./components/GroupSummary";
import GroupMembersList from "./components/GroupMembersList";

interface GroupDetailsModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    responderGroup: ResponderGroup;
    memberResponders: ResponderListItem[];
    missingMembersCount: number;
}

export default function GroupDetailsModal({
    setModalOpen,
    responderGroup,
    memberResponders,
    missingMembersCount,
}: GroupDetailsModalProps) {
    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText="Group Details"
                setModalOpen={setModalOpen}
            >
                <GroupSummary
                    groupName={responderGroup.group_name}
                    totalMembers={responderGroup.member_ids.length}
                    missingMembersCount={missingMembersCount}
                />

                <GroupMembersList members={memberResponders} />
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}

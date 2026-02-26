import type {
    NotificationTemplate,
    NotificationType,
} from "../../../../../types/responder";

export const NOTIF_TYPES: {
    value: NotificationType;
    label: string;
}[] = [
    {
        value: "critical",
        label: "This will be sent when a critical alert is detected.",
    },
    {
        value: "warning",
        label: "This will be sent when a warning alert is detected.",
    },
    {
        value: "blockage",
        label: "This will be sent when a blockage is detected.",
    },
    {
        value: "announcement",
        label: "Use this template for announcements / manual sending.",
    },
];

export const MESSAGE_LENGTH = 120;

export const getInitialNotifType = (
    template?: NotificationTemplate,
): NotificationType => {
    if (!template) {
        return "announcement";
    }

    if (template.type === "critical") {
        return "critical";
    }

    if (template.type === "warning") {
        return "warning";
    }

    if (template.type === "blockage") {
        return "blockage";
    }

    return "announcement";
};

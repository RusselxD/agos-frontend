export interface ResponderCreateRequest {
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface ResponderListItem {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: string;
}

export interface ResponderVerifyRequest {
    first_name: string;
    last_name: string;
    phone_number: string;
    status: "pending" | "active";
}

export interface ResponderOTPVerifyRequest {
    responder_id: string;
    otp: string;
}

export interface ResponderOTPVerifyResponse {
    success: boolean;
    message: string;
    requires_resend: boolean;
}

export interface SendSMSRequest {
    responder_ids: string[];
    message: string;
}

export interface ResponderAdditionalDetails {
    created_at: string;
    created_by: string;
    activated_at: string | null;
}

export interface ResponderAllDetails
    extends ResponderListItem, ResponderAdditionalDetails {}

export interface MessageTemplate extends MessageTemplateCreateRequest {
    id: number;
}

export interface MessageTemplateCreateRequest {
    template_name: string;
    template_content: string;
    auto_send_on_critical: boolean | null;
    auto_send_on_warning: boolean | null;
    auto_send_on_blocked: boolean | null;
}

export interface ResponderGroup extends ResponderGroupCreateRequest {
    id: number;
}

export interface ResponderGroupCreateRequest {
    group_name: string;
    member_ids: string[];
}

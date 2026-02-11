export interface ResponderOTPRequest {
    phone_number: string;
}

export interface ResponderOTPResponse {
    success: boolean;
    message: string;
}

export interface ResponderOTPVerifyRequest {
    phone_number: string;
    otp: string;
}

export interface ResponderOTPVerifyResponse {
    success: boolean;
    message: string;
    send_again: boolean;
}

export interface ResponderCreateRequest {
    first_name: string;
    last_name: string;
    phone_number: string;
    id_photo_path: string;
}

export interface ResponderListItem {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: string;
    groups: string[];
}

export interface ResponderAdditionalDetails {
    id_photo_path: string;
    created_at: string;
    approved_by: string | null;
    approved_at: string | null;
}

export interface ResponderAllDetails
    extends ResponderListItem, ResponderAdditionalDetails {}

export interface MessageTemplate {
    id: number;
    template_name: string;
    template_content: string;
    auto_send_on_critical: boolean;
}

export interface MessageTemplateCreateRequest {
    template_name: string;
    template_content: string;
    auto_send_on_critical: boolean;
}

export interface ResponderGroup {
    id: number;
    group_name: string;
    member_ids: string[];
}

export interface ResponderGroupCreateRequest {
    group_name: string;
    member_ids: string[];
}

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
}

export interface ResponderListResponse {
    responders: ResponderListItem[];
}

export interface ResponderDetailsResponse {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    id_photo_path: string;
    status: string;
    created_at: string;
    approved_by: string | null;
    approved_at: string | null;
}

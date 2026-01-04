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

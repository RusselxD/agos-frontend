export interface LoginCredentials {
    phone_number: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

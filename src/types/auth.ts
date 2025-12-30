export interface LoginCredentials {
    phone_number: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface ChangePasswordCredentials {
    new_password: string;
}

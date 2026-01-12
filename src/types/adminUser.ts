// Used in Admin User Card | Admin Users Page
export interface AdminUserResponse {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    is_superuser: boolean;
    is_enabled: boolean;
    last_login: string;
    created_by: string | null;
}

export interface AdminUserLogs{
    action: string;
    created_at: string;
    admin_name: string;
}

export interface AdmindUserLogsResponse{
    logs: AdminUserLogs[];
    has_more: boolean;
}

export interface AdminUserCreateRequest{
    phone_number: string;
    first_name: string;
    last_name: string;
    password: string;
    created_by: string;
}
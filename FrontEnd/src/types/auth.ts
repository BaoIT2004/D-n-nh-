export type LoginResponse = {
    id: number;
    email: string;
    accessToken: string;
    refreshToken: string;
};

export type RegisterResponse = {
    id: number;
    name: string;
    email: string;
};

export type LogoutResponse = {
    message?: string;
};

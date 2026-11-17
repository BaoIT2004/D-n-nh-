export type LoginResponse = {
  id: number;
  name: string;
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

export type UserInfo = {
  id: number;
  name: string;
  email: string;
};

export type TokenResponse = {
  accessToken: string;
};

import { apiRequest, setAccessToken, refreshAccessToken } from "./Api";
import type {
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  UserInfo,
} from "../types/auth";

export function registerUser(name: string, email: string, password: string) {
  return apiRequest<RegisterResponse>("/api/User/register", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  const result = await apiRequest<LoginResponse>("/api/User/login", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify({ email, password }),
  });
  if (result.success) {
    setAccessToken(result.data.accessToken);
  }
  return result;
}

export async function logoutUser() {
  try {
    return await apiRequest<LogoutResponse | null>("/api/User/logout", {
      method: "POST",
      authenticated: false,
    });
  } finally {
    setAccessToken(null);
  }
}

export const refreshSession = () => refreshAccessToken();

export function getCurrentUser() {
  return apiRequest<UserInfo>("/api/User/me", { method: "GET" });
}

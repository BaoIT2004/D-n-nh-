import {
  apiRequest,
  refreshAccessToken,
  setAccessToken,
  type ServiceResult,
} from "./Api";
import type {
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  UserInfo,
} from "../types/auth";

export function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<ServiceResult<RegisterResponse>> {
  return apiRequest<RegisterResponse>("/api/User/register", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify({ name, email, password }),
  });
}

//Đăng nhập
export async function loginUser(email: string, password: string) {
  // Cookie do server set, FE không lưu token
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

//Đăng xuất
export async function logoutUser() {
  try {
    // Không gửi body, server đọc refresh token từ cookie
    return await apiRequest<LogoutResponse | null>("/api/User/logout", {
      method: "POST",
      authenticated: false,
    });
  } finally {
    setAccessToken(null);
  }
}

export function refreshSession() {
  return refreshAccessToken();
}
export function getCurrentUser() {
  return apiRequest<UserInfo>("/api/User/me", { method: "GET" });
}

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5024"
).replace(/\/+$/, "");

type ApiEnvelope<T> = {
  status?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

export type ServiceResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string };

type ApiRequestOptions = RequestInit & {
  authenticated?: boolean;
};

//Access token lưu trong memory
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

let refreshPromise: Promise<boolean> | null = null;

export function refreshAccessToken(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/User/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        accessToken = null;
        return false;
      }
      const body = await res.json();
      const token = body?.data?.accessToken;
      accessToken = typeof token === "string" ? token : null;
      return accessToken !== null;
    } catch {
      accessToken = null;
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function getResponseMessage(payload: unknown): string | undefined {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const body = payload as { message?: unknown; errors?: unknown };
  const message = typeof body.message === "string" ? body.message : "";
  const errors = Array.isArray(body.errors)
    ? body.errors.filter((error): error is string => typeof error === "string")
    : [];
  const details = [message, ...errors].filter(Boolean).join(" ");

  return details || undefined;
}

export async function send<T>(
  path: string,
  requestOptions: RequestInit,
  authenticated: boolean,
): Promise<{ result: ServiceResult<T>; unauthorized: boolean }> {
  const headers = new Headers(requestOptions.headers);

  if (requestOptions.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated && accessToken) {
    headers.set("Authorization", "Bearer " + accessToken);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      credentials: "include",
    });
    const rawBody = await response.text();
    let payload: unknown = null;

    if (rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        payload = rawBody;
      }
    }

    const responseMessage = getResponseMessage(payload);
    if (!response.ok) {
      return {
        unauthorized: response.status === 401,
        result: {
          success: false,
          message: responseMessage ?? `Yêu cầu thất bại (${response.status}).`,
        },
      };
    }

    if (typeof payload !== "object" || payload === null) {
      return {
        unauthorized: false,
        result: {
          success: false,
          message: "Máy chủ trả về dữ liệu không hợp lệ.",
        },
      };
    }

    const envelope = payload as ApiEnvelope<T>;
    if (envelope.status === false) {
      return {
        unauthorized: false,
        result: {
          success: false,
          message: responseMessage ?? "Yêu cầu không thành công.",
        },
      };
    }

    if (!("data" in envelope)) {
      return {
        unauthorized: false,
        result: {
          success: false,
          message: "Phản hồi từ máy chủ thiếu dữ liệu.",
        },
      };
    }

    return {
      unauthorized: false,
      result: {
        success: true,
        message: envelope.message ?? "Thao tác thành công.",
        data: envelope.data as T,
      },
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      unauthorized: false,
      result: { success: false, message: "Không thể kết nối đến máy chủ." },
    };
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ServiceResult<T>> {
  const { authenticated = true, ...requestOptions } = options;

  // Chưa có access token (vd: vừa reload) -> thử refresh trước
  if (authenticated && !accessToken && !(await refreshAccessToken())) {
    return { success: false, message: "Bạn cần đăng nhập để tiếp tục." };
  }

  const first = await send<T>(path, requestOptions, authenticated);

  // Access token hết hạn -> refresh rồi gọi lại đúng 1 lần
  if (authenticated && first.unauthorized) {
    if (await refreshAccessToken()) {
      return (await send<T>(path, requestOptions, authenticated)).result;
    }
    return { success: false, message: "Phiên đăng nhập đã hết hạn." };
  }

  return first.result;
}

export function getStoredUserId(): number | null {
  const userId = Number(localStorage.getItem("userId"));
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

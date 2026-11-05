const API_BASE_URL = (
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

export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<ServiceResult<T>> {
    const { authenticated = true, ...requestOptions } = options;
    const headers = new Headers(requestOptions.headers);

    if (requestOptions.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (authenticated) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return { success: false, message: "Bạn cần đăng nhập để tiếp tục." };
        }
        headers.set("Authorization", "Bearer " + token);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...requestOptions,
            headers,
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
                success: false,
                message: responseMessage ?? `Yêu cầu thất bại (${response.status}).`,
            };
        }

        if (typeof payload !== "object" || payload === null) {
            return {
                success: false,
                message: "Máy chủ trả về dữ liệu không hợp lệ.",
            };
        }

        const envelope = payload as ApiEnvelope<T>;
        if (envelope.status === false) {
            return {
                success: false,
                message: responseMessage ?? "Yêu cầu không thành công.",
            };
        }

        if (!("data" in envelope)) {
            return {
                success: false,
                message: "Phản hồi từ máy chủ thiếu dữ liệu.",
            };
        }

        return {
            success: true,
            message: envelope.message ?? "Thao tác thành công.",
            data: envelope.data as T,
        };
    } catch (error) {
        console.error("API request failed:", error);
        return {
            success: false,
            message: "Không thể kết nối đến máy chủ.",
        };
    }
}

export function getStoredUserId(): number | null {
    const userId = Number(localStorage.getItem("userId"));
    return Number.isInteger(userId) && userId > 0 ? userId : null;
}

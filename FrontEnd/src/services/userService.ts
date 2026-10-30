import { apiRequest, type ServiceResult } from "./api";

type LoginResponse = {
    id: number;
    email: string;
    accessToken: string;
    refreshToken: string;
};

type RegisterResponse = {
    id: number;
    name: string;
    email: string;
};

type LogoutResponse = {
    message?: string;
};

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
export async function loginUser(
    email: string,
    password: string,
): Promise<ServiceResult<LoginResponse>> {
    const result = await apiRequest<LoginResponse>("/api/User/login", {
        method: "POST",
        authenticated: false,
        body: JSON.stringify({ email, password }),
    });

    if (!result.success) {
        return result;
    }

    if (typeof result.data !== "object" || result.data === null) {
        return {
            success: false,
            message: "Dữ liệu đăng nhập máy chủ trả về không hợp lệ.",
        };
    }

    const { accessToken, refreshToken, id, email: accountEmail } = result.data;
    if (!accessToken || !refreshToken || !Number.isInteger(id) || !accountEmail) {
        return {
            success: false,
            message: "Dữ liệu đăng nhập máy chủ trả về không hợp lệ.",
        };
    }

    //Lưu thông tin ở localstorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("email", accountEmail);
    localStorage.setItem("userId", String(id));

    return result;
}


//Đăng xuất
export async function logoutUser(): Promise<ServiceResult<LogoutResponse | null>> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        clearSession();
        return { success: true, message: "Đã đăng xuất.", data: null };
    }

    const result = await apiRequest<LogoutResponse | null>("/api/User/logout", {
        method: "POST",
        authenticated: false,
        body: JSON.stringify({ refreshToken }),
    });

    if (result.success) {
        clearSession();
    }

    return result;
}

function clearSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
}

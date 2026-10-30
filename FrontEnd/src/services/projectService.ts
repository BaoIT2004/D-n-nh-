import { apiRequest, getStoredUserId, type ServiceResult } from "./api";

export type Project = {
    id: number;
    nameProject: string;
    status: string;
    createdAt: string;
    userId: number;
};

type ProjectResponse = {
    nameProject: string;
    status: string;
};

export function allProject(): Promise<ServiceResult<Project[]>> {
    const userId = getStoredUserId();
    if (!userId) {
        return Promise.resolve({
            success: false,
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
    }

    return apiRequest<Project[]>(`/api/newProject/${userId}`);
}

export function createProject(
    nameProject: string,
    status: string,
): Promise<ServiceResult<ProjectResponse>> {
    const userId = getStoredUserId();
    if (!userId) {
        return Promise.resolve({
            success: false,
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
    }

    return apiRequest<ProjectResponse>("/api/newProject", {
        method: "POST",
        body: JSON.stringify({ nameProject, status, userId }),
    });
}

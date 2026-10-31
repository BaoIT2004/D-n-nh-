import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";
import type { Project, ProjectResponse } from "../types/project";

export function AllProject(): Promise<ServiceResult<Project[]>> {
    // người dùng đã đăng nhập chưa
    const userId = getStoredUserId();
    if (!userId) {
        return Promise.resolve({
            success: false,
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
    }

    return apiRequest<Project[]>(`/api/newProject/${userId}`);
}


//Tạo dự án
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

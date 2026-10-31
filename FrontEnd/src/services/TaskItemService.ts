import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";
import type { AddTaskItemResquest, GetAllTaskItemResponse } from "../types/TaskITem";


// Thêm 
export function AddTaskItem(
    Title: string,
    CreatedAt: string,   // DateOnly
    WorkType: string,
    Degree: string,
    StatusId: number
): Promise<ServiceResult<AddTaskItemResquest>> {
    return apiRequest<AddTaskItemResquest>(`/api/TaskItem/${StatusId}`, {
        method: "POST",
        body: JSON.stringify({ Title, CreatedAt, WorkType, Degree, StatusId }),
    });
}

//Hiển thị 
export function GetAllTaskItems(
    statusId: number,
): Promise<ServiceResult<GetAllTaskItemResponse[]>>{

    // Kiểm tra đăng nhập chưa
    const userId = getStoredUserId();
    if (!userId) {
        return Promise.resolve({
            success: false,
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
    }
    return apiRequest<GetAllTaskItemResponse[]>(`/api/TaskItem/${statusId}`);
}
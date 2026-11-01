import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";
import type { AddTaskItem, GetAllTaskItem, UpdateTaskItem } from "../types/TaskITem";


// Thêm 
export function AddTaskItem(
    Title: string,
    createdAt: string,   // DateOnly
    workType: string,
    degree: string,
    statusId: number
): Promise<ServiceResult<AddTaskItem>> {
    return apiRequest<AddTaskItem>(`/api/TaskItem/${statusId}`, {
        method: "POST",
        body: JSON.stringify({ Title, CreatedAt: createdAt, WorkType: workType, Degree: degree, StatusId: statusId }),
    });
}

//Hiển thị 
export function GetAllTaskItems(
    statusId: number,
): Promise<ServiceResult<GetAllTaskItem[]>>{

    // Kiểm tra đăng nhập chưa
    const userId = getStoredUserId();
    if (!userId) {
        return Promise.resolve({
            success: false,
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
    }
    return apiRequest<GetAllTaskItem[]>(`/api/TaskItem/${statusId}`);
}

export function UpdateTaskItem(
    title: string,
    createdAt: string,   // DateOnly
    workType: string,
    degree: string,
    taskITemId: number
): Promise<ServiceResult<UpdateTaskItem>>{
     // Kiểm tra đăng nhập chưa
    const userId = getStoredUserId();
    if (!userId) {
        return Promise.resolve({
            success: false,
            message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        });
    }

    return apiRequest<UpdateTaskItem>(`/api/TaskItem/${taskITemId}`, {
        method: "PUT",
        body: JSON.stringify({ title, createdAt, workType, degree }),
    });
}
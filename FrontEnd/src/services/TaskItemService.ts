import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";
import type {
  AddTaskItem,
  GetAllTaskItem,
  TaskItemDetail,
  UpdateTaskItem,
} from "../types/TaskITem";

// Thêm
export function addTaskItem(
  Title: string,
  createdAt: string, // DateOnly
  workType: string,
  degree: string,
  statusId: number,
): Promise<ServiceResult<AddTaskItem>> {
  return apiRequest<AddTaskItem>(`/api/TaskItem/${statusId}`, {
    method: "POST",
    body: JSON.stringify({
      Title,
      CreatedAt: createdAt,
      WorkType: workType,
      Degree: degree,
      StatusId: statusId,
    }),
  });
}

//Hiển thị
export function getAllTaskItems(
  statusId: number,
  // trả danh sách
): Promise<ServiceResult<GetAllTaskItem[]>> {
  // Kiểm tra đăng nhập chưa
  const userId = getStoredUserId();
  if (!userId) {
    return Promise.resolve({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }
  return apiRequest<GetAllTaskItem[]>(`/api/TaskItem/${statusId}`, {
    method: "GET",
  });
}

export function getTaskItemById(
  taskItemId: number,
): Promise<ServiceResult<TaskItemDetail>> {
  // trả chi tiết
  const userId = getStoredUserId();
  if (!userId) {
    return Promise.resolve({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }
  return apiRequest<TaskItemDetail>(`/api/TaskItem/detail/${taskItemId}`, {
    method: "GET",
  });
}

export function deleteTaskItem(
  taskItemId: number,
): Promise<ServiceResult<boolean>> {
  const userId = getStoredUserId();
  if (!userId) {
    return Promise.resolve({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }
  return apiRequest<boolean>(`/api/TaskItem/${taskItemId}`, {
    method: "DELETE",
  });
}

export function updateTaskItem(
  taskITemId: number,
  title: string,
  createdAt: string, // DateOnly
  workType: string,
  degree: string,
  statusId: number,
): Promise<ServiceResult<UpdateTaskItem>> {
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
    body: JSON.stringify({ title, createdAt, workType, degree, statusId }),
  });
}

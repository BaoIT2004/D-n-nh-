import { apiRequest, type ServiceResult } from "./Api";
import type {
  AddTaskItem,
  GetAllTaskItem,
  TaskItemDetail,
  UpdateTaskItemResponse,
} from "../types/TaskITem";

// Thêm
export function addTaskItem(
  title: string,
  createdAt: string, // DateOnly
  workType: string,
  degree: string,
  statusId: number,
  parentId: number | null,
): Promise<ServiceResult<AddTaskItem>> {
  return apiRequest<AddTaskItem>(`/api/TaskItem/${statusId}`, {
    method: "POST",
    body: JSON.stringify({
      Title: title,
      CreatedAt: createdAt,
      WorkType: workType,
      Degree: degree,
      StatusId: statusId,
      ParentId: parentId,
    }),
  });
}

//Hiển thị
export function getAllTaskItems(
  statusId: number,
): Promise<ServiceResult<GetAllTaskItem[]>> {
  return apiRequest<GetAllTaskItem[]>(`/api/TaskItem/${statusId}`, {
    method: "GET",
  });
}

export function getTaskItemById(
  taskItemId: number,
): Promise<ServiceResult<TaskItemDetail>> {
  return apiRequest<TaskItemDetail>(`/api/TaskItem/detail/${taskItemId}`, {
    method: "GET",
  });
}

export function deleteTaskItem(
  taskItemId: number,
): Promise<ServiceResult<boolean>> {
  return apiRequest<boolean>(`/api/TaskItem/${taskItemId}`, {
    method: "DELETE",
  });
}

export function updateTaskItem(
  taskItemId: number,
  title: string,
  createdAt: string, // DateOnly
  dueDate: string,
  workType: string,
  degree: string,
  statusId: number,
): Promise<ServiceResult<UpdateTaskItemResponse>> {
  return apiRequest<UpdateTaskItemResponse>(`/api/TaskItem/${taskItemId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      createdAt,
      dueDate,
      workType,
      degree,
      statusId,
    }),
  });
}

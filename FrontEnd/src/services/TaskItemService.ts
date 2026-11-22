import { apiRequest, type ServiceResult } from "./Api";
import type {
  AddTaskItem,
  GetAllTaskItem,
  TaskItemDetail,
  UpdateTaskItemResponse,
} from "../types/TaskITem";
import type { ReorderStatusResponse } from "../types/statusTask";

// Thêm
export function addTaskItem(
  title: string,
  startDate: string, // DateOnly
  workType: string,
  degree: string,
  statusId: number,
  parentId: number | null,
): Promise<ServiceResult<AddTaskItem>> {
  return apiRequest<AddTaskItem>(`/api/TaskItem/${statusId}`, {
    method: "POST",
    body: JSON.stringify({
      Title: title,
      StartDate: startDate,
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

//Hiển thị chi tiết
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
  startDate: string, // DateOnly
  dueDate: string | null,
  workType: string,
  degree: string,
  statusId: number,
  description: string,
): Promise<ServiceResult<UpdateTaskItemResponse>> {
  return apiRequest<UpdateTaskItemResponse>(`/api/TaskItem/${taskItemId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      startDate: startDate,
      dueDate,
      workType,
      degree,
      statusId,
      description,
    }),
  });
}

// sắp xêp
export function reorderTaskItem(
  taskItemId: number,
  statusId: number,
  ids: number[],
): Promise<ServiceResult<ReorderStatusResponse>> {
  return apiRequest<ReorderStatusResponse>(`/api/TaskItem/reorder/${taskItemId}`, {
    method: "PUT",
    body: JSON.stringify({
      statusId,
      ids,
    }),
  });
}

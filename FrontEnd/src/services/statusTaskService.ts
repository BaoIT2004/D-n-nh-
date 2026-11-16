import { apiRequest, type ServiceResult } from "./Api";
import type {
  AddMemberResponse,
  AddStatusTaskResponse,
  GetAllStatusTaask as GetAllStatusTask,
} from "../types/statusTask";

//thêm
export function AddStatusTask(
  statusTask: string,
  projectId: number,
): Promise<ServiceResult<AddStatusTaskResponse>> {
  return apiRequest<AddStatusTaskResponse>("/api/StatusTask", {
    method: "POST",
    body: JSON.stringify({ statusTask, projectId }),
  });
}

// Thêm user vào dự án
export function AddMember(
  projectId: number,
  email: string,
): Promise<ServiceResult<AddMemberResponse>> {
  return apiRequest<AddMemberResponse>(
    `/api/ProjectMembers/${projectId}/members`,
    {
      method: "POST",
      body: JSON.stringify({ projectId, email }),
    },
  );
}

//Hiển thị
export function GetAllStatusTaskByProject(
  projectId: number,
): Promise<ServiceResult<GetAllStatusTask[]>> {
  return apiRequest<GetAllStatusTask[]>(`/api/statusTask/${projectId}`);
}

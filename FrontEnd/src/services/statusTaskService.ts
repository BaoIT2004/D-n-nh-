import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";
import type {
  AddMemberResponse,
  AddStatusTaskResponse,
  GetAllStatusTaask,
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
export function GetAllStatusTask(
  projectId: number,
): Promise<ServiceResult<GetAllStatusTaask[]>> {
  // Kiểm tra đăng nhập chưa
  const userId = getStoredUserId();
  if (!userId) {
    return Promise.resolve({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }
  return apiRequest<GetAllStatusTaask[]>(`/api/statusTask/${projectId}`);
}

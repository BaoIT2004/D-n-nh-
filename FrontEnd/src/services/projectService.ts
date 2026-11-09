import { apiRequest, type ServiceResult } from "./Api";
import type {
  MemberResponse,
  Project,
  ProjectResponse,
} from "../types/project";

//Hiển thị project
export function AllProject(userId: number): Promise<ServiceResult<Project[]>> {
  // người dùng đã đăng nhập chưa
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
  userId: number,
  nameProject: string,
  status: string,
): Promise<ServiceResult<ProjectResponse>> {
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

// thêm thành viên
export function addMember(
  projectId: number, // result = await addMember(projectId, {userId: memberId}); (// file: use-create-post)
  request: object,
): Promise<ServiceResult<MemberResponse>> {
  return apiRequest<MemberResponse>(
    `/api/ProjectMembers/${projectId}/members`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

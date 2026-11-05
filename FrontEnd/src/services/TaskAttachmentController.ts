import type { TaskAttachment } from "../types/TaskAttachment";
import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";

export function AddFile(
  taskItemId: number,
  file: File,
): Promise<ServiceResult<TaskAttachment>> {
  const userId = getStoredUserId();
  if (!userId) {
    return Promise.resolve({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }

  const formData = new FormData();
  formData.append("file", file); // khớp tên IFormFile ở backend

  return apiRequest<TaskAttachment>(`/api/TaskAttachments/${taskItemId}`, {
    method: "POST",
    body: formData,
  });
}

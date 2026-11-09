import type { TaskAttachment } from "../types/TaskAttachment";
import {
  apiRequest,
  getStoredUserId,
  API_BASE_URL,
  type ServiceResult,
} from "./Api";

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

export function GetFiles(
  taskItemId: number,
): Promise<ServiceResult<TaskAttachment[]>> {
  const userId = getStoredUserId();
  if (!userId) {
    return Promise.resolve({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }

  return apiRequest<TaskAttachment[]>(`/api/TaskAttachments/${taskItemId}`, {
    method: "GET",
  });
}

export async function DowloadFile(
  fileId: number,
  fileName: string,
): Promise<ServiceResult<Blob>> {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${API_BASE_URL}/api/TaskAttachments/download/${fileId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    return { success: false, message: "Tải tệp thất bại" };
  }

  //tải thành công
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  ((a.href = url), (a.download = fileName), a.click());
  URL.revokeObjectURL(url);

  return {
    success: true,
    message: "Tải tệp thành công",
    data: blob,
  };
}

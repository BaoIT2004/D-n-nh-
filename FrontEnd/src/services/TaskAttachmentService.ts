import type { TaskAttachment } from "../types/TaskAttachment";
import {
  apiRequest,
  getAccessToken,
  refreshAccessToken,
  API_BASE_URL,
  type ServiceResult,
} from "./Api";

export function AddFile(
  taskItemId: number,
  file: File,
): Promise<ServiceResult<TaskAttachment>> {
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
  return apiRequest<TaskAttachment[]>(`/api/TaskAttachments/${taskItemId}`, {
    method: "GET",
  });
}

export async function DownloadFile(
  fileId: number,
  fileName: string,
): Promise<ServiceResult<Blob>> {
  let token = getAccessToken();

  if (!token) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      return { success: false, message: "Phiên đăng nhập đã hết hạn." };
    }
    token = getAccessToken();
  }

  if (!token) {
    return { success: false, message: "Không lấy được access token." };
  }
  const res = await fetch(
    `${API_BASE_URL}/api/TaskAttachments/download/${fileId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include", //tác dụng yêu cầu trình duyệt gửi Cookie kèm theo request khi gọi API.
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

import { apiRequest, getStoredUserId, type ServiceResult } from "./Api";
import type { GetAllStatusTaask, StatusTask } from "../types/statusTask";


//thêm
export function AddStatusTask(
    statusTask: string,
    projectId: number,
): Promise<ServiceResult<StatusTask>> {
    return apiRequest<StatusTask>("/api/StatusTask", {
        method: "POST",
        body: JSON.stringify({ statusTask, projectId }),
    });
}

//Hiển thị 
export function GetAllStatusTask(
    projectId: number,
): Promise<ServiceResult<GetAllStatusTaask[]>>{

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





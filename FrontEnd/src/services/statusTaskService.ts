import { apiRequest, type ServiceResult } from "./Api";
import type { GetAllStatusTaask, StatusTask } from "../types/statusTask";

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
export function GetAllStatusTaask(
    projectId: number,
): Promise<ServiceResult<GetAllStatusTaask>>{
    return apiRequest<GetAllStatusTaask>(`/api/statusTask/${projectId}`);
}



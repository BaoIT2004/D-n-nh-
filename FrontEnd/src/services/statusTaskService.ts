import { apiRequest, type ServiceResult } from "./api";
import type { StatusTask } from "../types/statusTask";

export function addStatusTask(
    statusTask: string,
    projectId: number,
): Promise<ServiceResult<StatusTask>> {
    return apiRequest<StatusTask>("/api/StatusTask", {
        method: "POST",
        body: JSON.stringify({ statusTask, projectId }),
    });
}

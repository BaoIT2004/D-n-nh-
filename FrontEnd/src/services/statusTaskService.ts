import { apiRequest, type ServiceResult } from "./api";

export type StatusTask = {
    id: number;
    statusTask: string;
    projectId: number;
};

export function addStatusTask(
    statusTask: string,
    projectId: number,
): Promise<ServiceResult<StatusTask>> {
    return apiRequest<StatusTask>("/api/StatusTask", {
        method: "POST",
        body: JSON.stringify({ statusTask, projectId }),
    });
}

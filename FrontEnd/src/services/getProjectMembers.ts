import { apiRequest, type ServiceResult } from "./Api";

export interface Member {
  id: number;
  email: string;
}

export  function getProjectMembers(
  projectId: number
): Promise<ServiceResult<Member[]>> {
  return apiRequest<Member[]>(`/api/ProjectMembers/view/${projectId}`)
}


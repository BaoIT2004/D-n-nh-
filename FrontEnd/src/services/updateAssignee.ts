import { apiRequest, type ServiceResult } from "./Api";

export interface UpdateAssigneeResult {
  taskItemId: number;
  assigneeId: number | null;
  assigneeEmail: string | null;
}

export function updateAssignee(
  taskItemId: number,
  assigneeId: number | null,
): Promise<ServiceResult<UpdateAssigneeResult>> {
  return apiRequest<UpdateAssigneeResult>(
    `/api/TaskItem/assignee/${taskItemId}`,
    {
      method: "PUT",
      body: JSON.stringify({ assigneeId }),
    },
  );
}

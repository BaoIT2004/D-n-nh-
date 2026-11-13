import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssignee } from "../../services/updateAssignee";

type UpdateAssigneeInput = {
  taskItemId: number;
  assigneeId: number | null;
  parentTaskId: number | null;
};

export function useUpdateAssignee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskItemId,
      assigneeId,
    }: UpdateAssigneeInput) => {
      const result = await updateAssignee(taskItemId, assigneeId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["taskItem", input.taskItemId],
      });
      if (
        input.parentTaskId !== null &&
        input.parentTaskId !== input.taskItemId
      ) {
        queryClient.invalidateQueries({
          queryKey: ["taskItem", input.parentTaskId],
        });
      }
    },
  });
}

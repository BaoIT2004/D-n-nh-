import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssignee } from "../../services/updateAssignee";

export function useUpdateAssignee(taskItemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assigneeId: number | null) => {
      const result = await updateAssignee(taskItemId, assigneeId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskItem", taskItemId] });
    },
  });
}

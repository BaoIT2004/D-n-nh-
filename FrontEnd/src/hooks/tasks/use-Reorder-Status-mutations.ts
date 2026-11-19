import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReorderStatusAsync } from "../../services/StatusTaskService";

export function useReorderStatus(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => ReorderStatusAsync(projectId, ids),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["statusTasks", projectId],
      });
    },
  });
}

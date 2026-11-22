import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReorderItemAsync } from "../../services/StatusTaskService";

export function useReorderItems(statusId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const result = await ReorderItemAsync(statusId, ids);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskItems", statusId],
      });
    },
  });
}

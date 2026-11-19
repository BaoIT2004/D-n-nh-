import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReorderStatusAsync } from "../../services/StatusTaskService";

export function useReorderStatus(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const result = await ReorderStatusAsync(projectId, ids);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: () => {
      // tải lại danh sách status sau khi sắp xếp xong
      queryClient.invalidateQueries({ queryKey: ["statusTasks", projectId] });
    },
  });
}

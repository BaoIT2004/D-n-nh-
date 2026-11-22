import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderTaskItem } from "../../services/TaskItemService"; // sửa lại đường dẫn

type ReorderVars = {
  taskItemId: number;
  statusId: number;
  ids: number[];
};

export function useReorderTaskItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskItemId, statusId, ids }: ReorderVars) =>
      reorderTaskItem(taskItemId, statusId, ids),
    onError: () => {
      // lỗi thì lấy lại dữ liệu thật từ server để UI quay về đúng
      queryClient.invalidateQueries({ queryKey: ["taskItems"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["taskItems"] });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import {
  getAllTaskItems,
  getTaskItemById,
} from "../../services/TaskItemService";

export function useTaskItems(statusId: number) {
  return useQuery({
    queryKey: ["taskItems", statusId],
    queryFn: async () => {
      const result = await getAllTaskItems(statusId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: Number.isInteger(statusId) && statusId > 0,
    retry: false,
    staleTime: 30_000,
  });
}

export function useTaskItem(taskItemId: number) {
  return useQuery({
    queryKey: ["taskItem", taskItemId],
    queryFn: async () => {
      const result = await getTaskItemById(taskItemId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: Number.isInteger(taskItemId) && taskItemId > 0,
    retry: false,
  });
}

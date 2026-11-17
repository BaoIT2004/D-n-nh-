import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTaskItem,
  deleteTaskItem,
  updateTaskItem,
} from "../../services/TaskItemService";

type CreateTaskItemInput = {
  title: string;
  startDate: string; // DateOnly
  workType: string;
  degree: string;
  statusId: number;
  parentId: number | null;
  description: string | null;
};

type UpdateTaskItemInput = {
  title: string;
  startDate: string; // DateOnly
  dueDate: string | null;
  workType: string;
  degree: string;
  taskItemId: number;
  statusId: number;
  description: string | null;
};

type DeleteTaskItemInput = {
  taskItemId: number;
  statusId: number;
};

export function useCreateTaskItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      startDate: startDate,
      workType,
      degree,
      statusId,
      parentId,
    }: CreateTaskItemInput) => {
      const result = await addTaskItem(
        title,
        startDate,
        workType,
        degree,
        statusId,
        parentId,
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["taskItems", input.statusId],
      });
      if (input.parentId !== null) {
        queryClient.invalidateQueries({
          queryKey: ["taskItem", input.parentId],
        });
      }
    },
    onError: (Error: Error) => {
      console.error(Error.message);
    },
  });
}

export function useUpdateTaskItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      startDate: startDate,
      dueDate,
      workType,
      degree,
      statusId,
      taskItemId,
      description,
    }: UpdateTaskItemInput) => {
      const result = await updateTaskItem(
        taskItemId,
        title,
        startDate,
        dueDate,
        workType,
        degree,
        statusId,
        description ?? "", // có thể null
      );
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["taskItems", input.statusId],
      });
      queryClient.invalidateQueries({
        queryKey: ["taskItem", input.taskItemId],
      });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

export function useDeleteTaskItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskItemId }: DeleteTaskItemInput) => {
      const result = await deleteTaskItem(taskItemId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: ["taskItems", input.statusId],
      });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

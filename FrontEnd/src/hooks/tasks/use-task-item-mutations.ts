import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTaskItem,
  deleteTaskItem,
  updateTaskItem,
} from "../../services/TaskItemService";

type CreateTaskItemInput = {
  title: string;
  createdAt: string; // DateOnly
  workType: string;
  degree: string;
  statusId: number;
  parentId: number | null;
};

type UpdateTaskItemInput = {
  title: string;
  createdAt: string; // DateOnly
  dueDate: string;
  workType: string;
  degree: string;
  taskItemId: number;
  statusId: number;
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
      createdAt,
      workType,
      degree,
      statusId,
      parentId,
    }: CreateTaskItemInput) => {
      const result = await addTaskItem(
        title,
        createdAt,
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
      createdAt,
      dueDate,
      workType,
      degree,
      statusId,
      taskItemId,
    }: UpdateTaskItemInput) => {
      const result = await updateTaskItem(
        taskItemId,
        title,
        createdAt,
        dueDate,
        workType,
        degree,
        statusId,
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

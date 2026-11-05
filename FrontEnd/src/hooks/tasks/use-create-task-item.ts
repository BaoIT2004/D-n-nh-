import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTaskItem,
  deleteTaskItem,
  updateTaskItem,
} from "../../services/TaskItemService";

type CreateStaskItem = {
  Title: string;
  createdAt: string; // DateOnly
  workType: string;
  degree: string;
  statusId: number;
};

type UseCreateStaskItem = {
  Title: string;
  createdAt: string; // DateOnly
  workType: string;
  degree: string;
  taskItemId: number;
  statusId: number;
};

type DeleteTaskItemInput = {
  taskItemId: number;
  statusId: number;
};

export function useCreateStaskItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      Title,
      createdAt,
      workType,
      degree,
      statusId,
    }: CreateStaskItem) => {
      const result = await addTaskItem(
        Title,
        createdAt,
        workType,
        degree,
        statusId,
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (data, variable) => {
      //variable.statusId  dùng để báo query ["taskItems", 5] tải lại đúng danh sách task của trạng thái đó.
      queryClient.invalidateQueries({
        queryKey: ["taskItems", variable.statusId],
      });
      console.log(data);
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
      Title,
      createdAt,
      workType,
      degree,
      statusId,
      taskItemId,
    }: UseCreateStaskItem) => {
      const result = await updateTaskItem(
        Title,
        createdAt,
        workType,
        degree,
        taskItemId,
        statusId,
      );
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data, variable) => {
      // invalidateQueries(...): đánh dấu query khớp với key là cũ để React Query tải lại dữ liệu, giúp giao diện hiện task vừa cập nhật.
      queryClient.invalidateQueries({
        queryKey: ["taskItems", variable.statusId],
      });
      console.log(data);
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
    onSuccess: (data, variable) => {
      // invalidateQueries(...): đánh dấu query khớp với key là cũ để React Query tải lại dữ liệu, giúp giao diện hiện task vừa cập nhật.
      queryClient.invalidateQueries({
        queryKey: ["taskItems", variable.statusId],
      });
      console.log(data);
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

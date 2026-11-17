import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  AddFile,
  DeleteFile,
  DownloadFile,
} from "../../services/TaskAttachmentService";
import { GetFiles } from "../../services/TaskAttachmentService";

type AddFileItem = {
  taskItemId: number;
  file: File;
};

type DownloadFileItem = {
  fileId: number;
  fileName: string;
};

export function useGetFiles(taskItemId: number) {
  return useQuery({
    queryKey: ["files", taskItemId],
    queryFn: () => GetFiles(taskItemId),
  });
}

export function useAddFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskItemId, file }: AddFileItem) => {
      const result = await AddFile(taskItemId, file);
      if (!result.success) {
        throw new Error(result.message ?? "Upload thất bại");
      }
      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attachmentId: number) => {
      const result = await DeleteFile(attachmentId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: Error) => {
      console.error("Xóa file thất bại:", error.message);
    },
  });
}

export function useDownLoadFile() {
  return useMutation({
    mutationFn: async ({ fileId, fileName }: DownloadFileItem) => {
      const result = await DownloadFile(fileId, fileName);
      if (!result.success) {
        throw new Error(result.message ?? "Tải tệp thất bại");
      }
      return result;
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

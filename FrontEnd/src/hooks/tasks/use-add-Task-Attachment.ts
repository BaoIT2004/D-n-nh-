import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddFile } from "../../services/TaskAttachmentService";
import { useQuery } from "@tanstack/react-query";
import { GetFiles } from "../../services/TaskAttachmentService";

type AddFileItem = {
  taskItemId: number;
  file: File;
};

export function useAddFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskItemId, file }: AddFileItem) =>
      AddFile(taskItemId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

export function useGetFiles(taskItemId: number) {
  return useQuery({
    queryKey: ["files", taskItemId],
    queryFn: () => GetFiles(taskItemId),
  });
}

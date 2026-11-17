import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProject } from "../../types/project";
import { updateProject } from "../../services/projectService";

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, nameProject, status }: UpdateProject) => {
      const result = await updateProject(projectId, nameProject, status);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

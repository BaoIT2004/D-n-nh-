import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "./use-projects";
import { deleteProject } from "../../services/projectService";

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const userId = user?.id ?? null;

  return useMutation({
    mutationFn: async (projectId: number) => {
      const result = await deleteProject(projectId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
    },
  });
}

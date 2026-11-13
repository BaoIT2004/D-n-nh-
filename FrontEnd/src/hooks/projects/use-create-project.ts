import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../services/projectService";
import { useCurrentUser } from "./use-projects";

type CreateProjectInput = {
  nameProject: string;
  status: string;
};

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const userId = user?.id ?? null;

  return useMutation({
    mutationFn: async ({ nameProject, status }: CreateProjectInput) => {
      if (userId === null) {
        throw new Error("Chưa đăng nhập");
      }
      const result = await createProject(userId, nameProject, status);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      console.log(data);
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { getProjectMembers } from "../../services/getProjectMembers";

export function useProjectMembers(projectId: number) {
  return useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: async () => {
      const result = await getProjectMembers(projectId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    enabled: Number.isInteger(projectId) && projectId > 0,
    retry: false,
    staleTime: 30_000,
  });
}

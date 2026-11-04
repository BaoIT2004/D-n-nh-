import { useQuery } from "@tanstack/react-query";
import { GetAllStatusTask } from "../../services/StatusTaskService";

export function useStatusTasks(projectId: number) {
    return useQuery({
        queryKey: ["statusTasks", projectId],
        queryFn: async () => {
            const result = await GetAllStatusTask(projectId);

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

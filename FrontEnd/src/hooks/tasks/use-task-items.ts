import { useQuery } from "@tanstack/react-query";
import { GetAllTaskItems } from "../../services/TaskItemService";

export function useTaskItems(statusId: number) {
    return useQuery({
        queryKey: ["taskItems", statusId],
        queryFn: async () => {
            const result = await GetAllTaskItems(statusId);

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data;
        },
        enabled: Number.isInteger(statusId) && statusId > 0,
        retry: false,
        staleTime: 30_000,
    });
}

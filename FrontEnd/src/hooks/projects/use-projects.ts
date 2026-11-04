import { useQuery } from "@tanstack/react-query";
import { getStoredUserId } from "../../services/Api";
import { AllProject } from "../../services/projectService";

export function useProjects() {
    const userId = getStoredUserId();
    const isAuthenticated = Boolean(localStorage.getItem("accessToken")) && userId != null;

    return useQuery({
        queryKey: ["projects", userId],
        queryFn: async () => {
            const result = await AllProject();

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data;
        },
        enabled: isAuthenticated,
        retry: false,
        staleTime: 60_000,
        refetchInterval: 5_000,
    });
}

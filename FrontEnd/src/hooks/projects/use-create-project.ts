import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../services/projectService";

type CreateProjectInput = {
    nameProject: string;
    status: string;
};

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ nameProject, status }: CreateProjectInput) => {
            const result = await createProject(nameProject, status);

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

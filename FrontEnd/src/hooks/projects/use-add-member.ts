import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "../../services/projectService";

type AddMemberInput = {
    projectId: number;
    email: string;
};

export function useAddMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectId, email }: AddMemberInput) => {
            const result = await addMember(projectId, { email });

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

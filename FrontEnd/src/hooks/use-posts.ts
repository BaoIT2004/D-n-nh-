import { useQuery } from "@tanstack/react-query";
import { postsService } from "../services/posts";

export function usePosts(){
    //userQury là hook lấy data từ server
    return useQuery({   
        queryKey: ["posts", "list"],
        queryFn: () => postsService.getAll(),
    });
}
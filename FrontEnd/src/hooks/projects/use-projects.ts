import { useQuery } from "@tanstack/react-query";
import { AllProject } from "../../services/projectService";
import { getCurrentUser } from "../../services/authService";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await getCurrentUser();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useProjects() {
  // lấy id user của người đó
  const { data: user } = useCurrentUser();
  //lấy trường data của kết quả và đổi tên thành user
  //Giá trị này là { id, name, email } khi thành công, và là undefined khi đang tải hoặc chưa đăng nhập.
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      const result = await AllProject(userId!);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: userId !== null,
    retry: false,
    staleTime: 60_000,
    refetchInterval: 5_000,
  });
}

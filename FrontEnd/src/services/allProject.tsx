
export type Project = {
    id: number;
    nameProject: string;
    status: string;
    createdAt: string;
    userId: number;
};

export async function allProject(): Promise<{
    success: boolean;
    message: string;
    data?: Project[];
}> {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return {
                success: false,
                message: "Bạn cần đăng nhập để xem danh sách dự án."
            };
        }

        const response = await fetch("http://localhost:5024/api/newProject/AllProject", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if(!response.ok){
            return{
                success: false,
                message: `Không lấy được danh sách dự án (${response.status}).`
            }
        }

        const data: Project[] = await response.json();
        return{
            success: true,
            message: "Lấy danh sách thành công",
            data
        }
    } catch (error) {
        console.error(error);

        return{
            success: false,
            message: "Không thể kết nối đến máy chủ."
        }
    }
}

export async function AddStatusTask(StatusTask: string, ProjectId: number) {
    try {
        const token = localStorage.getItem("accessToken")
        const response = await fetch("http://localhost:5024/api/StatusTask", {
            method: "POST",
            headers: {
                "content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                StatusTask: StatusTask,
                ProjectId: ProjectId,
            })
        });
        if (!response.ok) {
            const mesage = await response.text();
            alert(mesage);
        } else {
            alert("Đăng ký thành công")
            return true;
        }
    } catch (error) {
        console.error(Error);
        alert("Không kết nối đến với server");
    }
}


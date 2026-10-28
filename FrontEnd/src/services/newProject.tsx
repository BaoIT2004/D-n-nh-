
export async function newProject(nameProject:string, status:string, userId:number) {
    try{
        const token = localStorage.getItem("accessToken");
        const UserId = Number(localStorage.getItem("userId"))
        const response = await fetch("http://localhost:5024/api/newProject",{
            method: "POST",
            headers:{
                "content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nameProject: nameProject,
                status: status,
                UserId: UserId
            })
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Bạn cần đăng nhập để tạo dự án.");
            return false;

        } else {
            alert("Tạo dự án thành công");
            return true
        }

    }catch(error){
        console.error(error)
        alert("Không thể kết nối đến server");
    }
    
}

export default newProject
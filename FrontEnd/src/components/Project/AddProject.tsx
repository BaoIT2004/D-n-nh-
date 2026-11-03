import { useState } from 'react';
import { addMember, createProject } from '../../services/projectService'
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { usePosts } from "../../hooks/use-posts";


function AddProject() {
    const [nameProject, setnameProject] = useState("");
    const [status, setStatus] = useState("private");
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState("");


    const { isPending, isError, error } = usePosts();

    if (isPending){
        return toast.success("haha");
    }

    if(isError){
        return toast.error(error.message)
    }

    async function HandleNewProject() {
        try {
            const result = await createProject(nameProject, status);
            if (result.success) {
                toast.success("Tạo dự án thành công.");
                setTimeout(() => window.location.reload(), 500)
                navigate("/");
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Không thể tạo dự án.");
        }
    }

    async function HandleAddMember(projectId: number) {
        if (!memberId.trim()) {
            toast.error("Vui lòng nhập email người cần thêm.");
            return;
        }

        try {
            const result = await addMember(projectId, { userId: Number(memberId) });
            if (result.success) {
                toast.success("Thêm người thành công.");
                setMemberId("");
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Không thể thêm người.");
        }
    }

    return (
        <nav className="w-72 h-[40vh] bg-blue-50 p-3">
            <div className="w-65 h-75 bg-white shadow-sm mx-auto border border-gray-200 rounded-md">
                <div className="p-3 flex flex-col">
                    <h1 className="font-bold">
                        Tạo dự án mới
                    </h1>

                    <h6 className="text-xs text-gray-500">
                        Điền thông tin dự án của bạn
                    </h6>
                </div>

                <div className="pl-3 flex flex-col gap-2">
                    <label htmlFor="nameProject" className="text-sm" >
                        Tên dự án
                    </label>
                    <input type="text" placeholder="Nhập tên dự án" className="text-sm border border-gray-400 w-55 h-9 pl-1 rounded-md"
                        value={nameProject} onChange={(e) => setnameProject(e.target.value)}
                    />

                    <label htmlFor="" className="text-sm">
                        Quyền xem
                    </label>
                    <select name="" id="" className="border border-gray-400 w-55 h-9 pl-1 rounded-md text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="private">Riêng tư</option>
                        <option value="workspace">Không gian làm việc</option>
                        <option value="public">Công khai</option>
                    </select>
                   
                    <div className="flex items-center gap-3 mt-3 ml-12">
                        <button className="border border-gray-200 rounded-md w-20 h-8 text-sm">Hủy</button>
                        <button className="bg-[#1868DB] text-white w-20 h-8 rounded-md flex items-center justify-center text-sm" onClick={HandleNewProject}>Tạo dự án</button>
                    </div>
                </div>

            </div>
        </nav>
    );

}

export default AddProject
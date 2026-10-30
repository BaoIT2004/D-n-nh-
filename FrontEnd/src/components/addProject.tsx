import { useState } from 'react';
import { createProject } from '../services/projectService'
import { useNavigate } from 'react-router-dom';


function addProject() {
    const [nameProject, setnameProject] = useState("");
    const [status, setStatus] = useState("private");
    const navigate = useNavigate();


    async function handleNewProject() {
        try {
            const result = await createProject(nameProject, status);
            if (result.success) {
                navigate("/");
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
            alert("Không thể tạo dự án.");
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
                        <button className="bg-[#1868DB] text-white w-20 h-8 rounded-md flex items-center justify-center text-sm" onClick={handleNewProject}>Tạo dự án</button>
                    </div>
                </div>

            </div>
        </nav>
    );

}

export default addProject
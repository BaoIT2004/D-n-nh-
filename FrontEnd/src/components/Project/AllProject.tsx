
import { useEffect, useState } from "react";
import { AllProject} from "../../services/ProjectService";
import type { Project } from "../../types/project";
import { getStoredUserId } from "../../services/Api";

function ProjectTable() {
    const [project, setProject] = useState<Project[]>([]); 

    useEffect(() => {
        if (!localStorage.getItem("accessToken") || getStoredUserId() === null) {
            return;
        }

        async function loadProjects() {
            const result = await AllProject();
            if (!result.success) {
                alert(result.message);
                return;
            }
            setProject(result.data ?? []);
        }
        void loadProjects();
    }, []);

    return (
        <div className="p-5 w-330 h-165 border border-gray-400 rounded-2xl overflow-auto">
            <table className="w-full table-fixed text-sm text-left">
                <thead className="bg-gray-100 font-medium">
                    <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Tên dự án</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3">Id người tạo</th>
                        <th className="p-3">Ngày tạo</th>
                        <th className="p-3">Chỉnh sửa</th>
                    </tr>
                </thead>

                <tbody>
                    {project.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="p-3"> {item.id} </td>
                            <td className="p-3"> {item.nameProject} </td>
                            <td className="p-3"> {item.status} </td>
                            <td className="p-3"> {item.userId} </td>
                            <td className="p-3"> {item.createdAt} </td>
                            <td className="p-3">Sửa</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectTable;

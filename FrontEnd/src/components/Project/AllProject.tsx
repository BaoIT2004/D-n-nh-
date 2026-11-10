import toast from "react-hot-toast";
import { useDeleteProject } from "../../hooks/projects/use-delete-project";
import { useProjects } from "../../hooks/projects/use-projects";
import { useUpdateProject } from "../../hooks/projects/use-update-project";
import { useState } from "react";

function ProjectTable() {
  const { data: project = [], isLoading, error } = useProjects();
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const { mutate: updateProject } = useUpdateProject();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameProject, setNameProject] = useState("");
  const [status, setStatus] = useState("");

  //xóa
  function handleDelete(projectId: number) {
    deleteProject(projectId, {
      onSuccess: () => toast.success("Xóa thành công"),
      onError: (error) => toast.error(error.message),
    });
  }

  // mục đích ấn sửa
  function startUpdate(item: {
    id: number;
    nameProject: string;
    status: string;
  }) {
    setEditingId(item.id); // ghi nhớ dòng nào sưaar
    setNameProject(item.nameProject); // tên dự án vào ô nhập
    setStatus(item.status); // đưa ô trạng thái vào ô nhập
  }

  //hàm cập nhật
  function handleUpdate(id: number) {
    updateProject(
      { projectId: id, nameProject, status },
      {
        onSuccess: () => {
          toast.success("Cập nhật thành công");
          setEditingId(null);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  //format ngày tháng năm
  // toLocaleDateString -> hiện ngày
  // toLocaleString -> Hiện thêm giờ
  function formatDate(date: string) {
    return new Date(date).toLocaleString("vi-vn", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (isLoading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  return (
    <div className="p-5 w-330 h-165 border border-gray-400 rounded-2xl overflow-auto">
      <table className="w-full table-fixed text-sm text-center">
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
              <td className="p-3">
                {editingId === item.id ? (
                  <input
                    value={nameProject}
                    onChange={(e) => setNameProject(e.target.value)}
                  />
                ) : (
                  item.nameProject
                )}
              </td>
              <td className="p-3">
                {editingId === item.id ? ( //so sánh dòng này có phải dòng đang được sửa không
                  <select
                    name=""
                    id=""
                    className="border border-gray-400 w-45 h-9 pl-1 rounded-md text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="private">private</option>
                    <option value="workspace">workspace</option>
                    <option value="public">public</option>
                  </select>
                ) : (
                  item.status
                )}
              </td>
              <td className="p-3"> {item.email} </td>
              <td className="p-3"> {formatDate(item.createdAt)} </td>
              <td className="flex justify-center">
                {editingId === item.id ? (
                  <>
                    <button
                      type="button"
                      className="p-3 text-green-600 cursor-pointer"
                      onClick={() => handleUpdate(item.id)}
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      className="p-3 text-gray-600 cursor-pointer"
                      onClick={() => setEditingId(null)}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="p-3 text-blue-600 cursor-pointer"
                      onClick={() => startUpdate(item)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="p-3 text-red-600 cursor-pointer"
                      disabled={isPending}
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTable;

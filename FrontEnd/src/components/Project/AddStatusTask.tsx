import { useState } from "react";
import { useParams } from "react-router-dom";
import Search from "../Home/Search";
import SidebarLeft from "../Home/SidebarLeft";
import AddProject from "./AddProject";
import { CiSquarePlus } from "react-icons/ci";
import { AddStatusTask } from "../../services/StatusTaskService";
import toast from "react-hot-toast";
import AddStatusItem from "./AddTaskItem";
import { useStatusTasks } from "../../hooks/tasks/use-status-tasks";
import { useQueryClient } from "@tanstack/react-query";
import { useAddMember } from "../../hooks/projects/use-add-member";
import { useProjects } from "../../hooks/projects/use-projects";
import Select from "react-select";

function BoardPage() {
  const { id: projectId } = useParams(); // Lấy id dự án từ URL (ví dụ: /projects/:id)
  const [projectOpen, setProjectOpen] = useState(false); // projectOpen ban đầu là false
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState("Todo");
  const [email, setEmail] = useState("");
  const projectIdNumber = Number(projectId);
  const { data: statusTasks = [] } = useStatusTasks(projectIdNumber);
  const queryClient = useQueryClient();
  const { data: projects = [] } = useProjects();
  const currentProject = projects.find((p) => p.id === projectIdNumber); // lấy status của tạo dự án

  // thêm cột
  const [openColumnId, setOpenColumnId] = useState<number | null>(null);
  const { mutate } = useAddMember();

  let projectForm = null;
  if (projectOpen) {
    projectForm = <AddProject />;
  }

  //thêm trạng thái
  const handleAddStatusTask = async () => {
    const Id = Number(projectId);

    if (!Number.isInteger(Id) || Id < 0) {
      toast.error("ID dư án không hợp lệ");
      return;
    }

    try {
      const result = await AddStatusTask(status, Id);
      if (result.success) {
        toggleModal();
        toast.success("Thêm trạng thái thành công");

        await queryClient.invalidateQueries({
          queryKey: ["statusTasks", projectIdNumber],
        });

        // note đoạn code trên
        //- queryClient.invalidateQueries(...): đánh dấu các query khớp với queryKey là “stale” (hết hạn).
        //- queryKey: ["statusTasks", projectIdNumber]: nhận diện query cần làm mới, tức danh sách task theo trạng thái của project có id là projectIdNumber.
        //- Nếu query đó đang được dùng ở component nào đó (đang mounted), React Query sẽ tự động gọi lại API để lấy dữ liệu mới.
        //- await: chờ cho đến khi việc refetch hoàn tất rồi mới chạy dòng code tiếp theo.
        //- sau khi tạo, sửa hoặc xóa một task thành công, gọi đoạn này để danh sách task trên giao diện tự cập nhật,
        // không cần reload trang.
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Lỗi: ", err);
      toast.error("không thể thêm trạng thái");
    }
  };

  //tắt trang StatusTask
  const toggleModal = () => {
    setModal(!modal);
  };

  //Thêm cột mới
  const handleClickPlus = (columnId: number) => {
    if (openColumnId === columnId) {
      setOpenColumnId(null); // đang mở đúng cột này → đóng lại
    } else {
      setOpenColumnId(columnId); // mở cột này
    }
  };

  // thêm memeber
  // const handAddMember = async () => {
  //    const result = await AddMember(Number(projectId), email);
  //    if (result.success) {
  //       toast.success("Thêm thành viên thành công")
  //       setEmail("");
  //    } else {
  //       toast.error("Thêm thành viên thất bại")
  //    }
  // }

  function handAddMember() {
    if (!email.trim()) {
      toast.error("Vui lòng nhập email người cần thêm.");
      return;
    }

    if (!Number.isInteger(projectIdNumber) || projectIdNumber <= 0) {
      toast.error("ID dự án không hợp lệ.");
      return;
    }

    mutate(
      { projectId: projectIdNumber, email },
      {
        onSuccess: () => {
          toast.success("Thêm người thành công");
          setEmail("");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  const STATUS_OPTIONS = [
    { value: "Todo", label: "To do" },
    { value: "BuildBroken", label: "Build Broken" },
    { value: "Building", label: "Building" },
    { value: "Closed", label: "Closed" },
    { value: "Done", label: "Done" },
    { value: "Inprogress", label: "In Progress" },
    { value: "Open", label: "Open" },
    { value: "Reopened", label: "Reopened" },
    { value: "Resolved", label: "Resolved" },
  ];

  //ẩn khi chọn xong
  const availableOptions = STATUS_OPTIONS.filter(
    (o) => !statusTasks.some((s) => s.status === o.value), //some: "có ít nhất 1": duyệt từng cột trong status nếu thỏa mã trả true . ! có mục đích đảo ngược lại
  );

  return (
    <nav>
      <div className="home">
        <div className="flex h-10 w-full shrink-0 items-center justify-end border border-[#9CA3AF] bg-white">
          <Search />
        </div>
        <div className="flex">
          <SidebarLeft
            onCreateClick={
              () => setProjectOpen((openCreate) => !openCreate) // openCreate giá trị hiên tại của projectOpen
            }
          />
          {projectForm}
          {/* Nội dung chính */}
          <div className="flex-1 min-w-0 border-l border-gray-300">
            <div className="p-6 bg-white min-h-screen w-full">
              <div className="mb-6 ">
                <h1 className="text-2xl font-bold text-gray-800">
                  {/* duyệt mảng, trả về phần tử đầu tiên có id bằng projectIdNumber
                  nếu không trả về undefne nếu có lấy nameProject */}
                  {projects.find((p) => p.id === projectIdNumber)?.nameProject}
                </h1>
                <p className="text-sm text-gray-500">
                  Quản lý tiến độ công việc của dự án này.
                </p>
              </div>

              {currentProject && currentProject.status !== "private" && (
                <div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm email"
                    className="text-sm border border-gray-400 w-55 h-9 pl-1 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // nhập nội dung hiện tại
                  />
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 ml-2"
                    onClick={handAddMember}
                  >
                    Thêm
                  </button>
                </div>
              )}

              {/* tạo đưởng kẻ ngang */}
              <hr className="border-t border-gray-300 -mx-6 my-5" />

              {/* Giao diện các cột */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  {" "}
                  {/*items-start mọi phần tử con bị kéo giãn cho cao bằng phần tử cao nhất trong hàng. */}
                  {statusTasks.map((s) => (
                    <div
                      key={s.id}
                      className="w-fit h-fit min-w-64 max-w-md p-4 bg-[#F8F8F8] rounded-lg shadow-sm border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-700 mb-6">
                        {s.status}
                      </h3>
                      <div className="-mx-3 -my-3 space-y-1">
                        {
                          <AddStatusItem
                            statusId={s.id}
                            isOpen={openColumnId === s.id}
                          />
                        }{" "}
                        {/* truyền vào hai thông tin là statusId và cho biết cột đó đang được mở hay khônh */}
                        <div className="p-1 rounded shadow-sm border border-dashed border-gray-300 text-sm text-gray-500 flex justify-center">
                          <button onClick={() => handleClickPlus(s.id)}>
                            <CiSquarePlus size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* add buton */}
                  <button
                    className="sticky bottom-4 right-4 z-60"
                    onClick={toggleModal}
                  >
                    <CiSquarePlus size={35} />
                  </button>
                  {/* trang thêm statustask */}
                  {modal && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-black/50 "
                        onClick={toggleModal}
                      ></div>

                      <div className="relative bg-white p-6 rounded-lg w-150 h-70 mb-60">
                        <h1 className="font-bold pb-4">AddStatus</h1>
                        <h4 className="text-gray-500">
                          A status shows the progression of work. Add an
                          existing status or type to create a new one.
                        </h4>
                        <h5 className="text-gray-900 pt-4">Status name</h5>

                        <Select
                          options={availableOptions} //danh sách các lựa chọn hiển thị trong điều kiện hiển thị này
                          value={availableOptions.find(
                            (p) => p.value === status,
                          )} //Trong danh sách, tìm cái thẻ nào có value bằng status
                          onChange={(p) => p && setStatus(p.value)} //: khi chọn option mới, nhận object p và lưu p.value (chuỗi) vào status. p && để tránh lỗi khi p là null.
                          isOptionDisabled={
                            (p) => statusTasks.some((s) => s.status === p.value) //chạy cho từng option; trả true thì option bị khóa. some kiểm tra option đó đã có trong statusTasks chưa, nếu có thì khóa, nên mỗi status chỉ chọn được 1 lần.
                          }
                        />

                        <div className="mt-6 flex justify-end gap-2">
                          <button
                            className="rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-200"
                            onClick={toggleModal}
                          >
                            Close
                          </button>
                          <button
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600"
                            onClick={handleAddStatusTask}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BoardPage;

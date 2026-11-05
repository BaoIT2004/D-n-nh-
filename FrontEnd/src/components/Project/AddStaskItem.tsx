import { useEffect, useState } from "react";
import { AddTaskItem, DeleteTaskITem, GetAllTaskItems, UpdateTaskItem } from "../../services/TaskItemService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { GrFormSchedule } from "react-icons/gr";
import type { GetAllTaskItem } from "../../types/TaskITem";
import { GoBug } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { RiTaskLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { LuPencilLine } from "react-icons/lu";
import { LiaEllipsisHSolid } from "react-icons/lia";


function AddStatusItem({ statusId, isOpen }: { statusId: number; isOpen: boolean }) {
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("Task");
  const [degree, setDegree] = useState("Thấp");
  const [createdAt, setCreatedAt] = useState<Date | null>(new Date());
  const [taskItem, setTaskItem] = useState<GetAllTaskItem[]>([]);// lấy dữ liệu từ API về
  const [board, setBoard] = useState(false);
  const [open, setOpen] = useState(false);
  const [taskItemId, setTaskItemId] = useState<number | null>(null); // tạo để nhớ khi sửa useState<number | null>: kiểu của giá trị là number (id của task) hoặc null (không sửa task nào).
  const [showSetting, setShowSetting] = useState<number | null>(null);


    //thêm
    async function handleAdd() {
      if (!title.trim() || !createdAt) {
        return;
      }
      const result = await AddTaskItem(title, createdAt.toLocaleDateString("sv-SE"), workType, degree, statusId);
      if (result.success) {
        toast.success("Thêm thành công");
        setTitle("");
        setWorkType("Task");
        setDegree("Thấp");

        const newResult = await GetAllTaskItems(statusId);
        if (newResult.success) {
          setTaskItem(newResult.data ?? []);
        }

      } else {
        toast.error("Thêm thất bại")
      }
    }

  //Hiển thị trạng thái
  useEffect(() => {
    async function viewProject() {
      const result = await GetAllTaskItems(Number(statusId));
      if (!result.success) {
        alert(result.message);
        return;
      }
      setTaskItem(result.data ?? []);
    }
    viewProject();
  }, [statusId])

  //Cập nhật dự án
  async function updateProject() {
    if (!title.trim() || !createdAt || taskItemId === null) {
      return;
    }
    const result = await UpdateTaskItem(
      title,
      createdAt.toLocaleDateString("sv-SE"),
      workType,
      degree,
      taskItemId,
      statusId);
    if (result.success) {
      toast.success("Cập nhật thành công");
      setTaskItemId(null);
      setTitle("");
      setWorkType("Task");
      setDegree("Thấp");
    } else {
      toast.error("Cập nhật thất bại")
      return;
    }

    // tải lại danh sách
    const refresh = await GetAllTaskItems(statusId);

    if (refresh.success) {
      setTaskItem(refresh.data ?? []);
    } else {
      toast.error(refresh.message);
    }
  }

  //Xóa
  async function deleteTaskItem(taskItemId: number) {
    const result = await DeleteTaskITem(Number(taskItemId));
    if (!result.success) {
      toast.error(result.message);
      return;  // return này có chức năng dừng tại vị trí này luôn
    }

    toast.success("Xóa thành công");

    setTaskItem(prev =>
      prev.filter(item => item.id != Number(taskItemId)))  // giữ lại tất cả các id có trong id đang xóa
  }


  const menuItem = [
    {
      icons: <GoBug className="text-red-500" />,
      label: 'Bug',
    },
    {
      icons: <CiBookmark className="text-green-500" />,
      label: 'Story',
    },
    {
      icons: <RiTaskLine className="text-blue-500" />,
      label: 'Task',
    },
  ]


  return (
    <div>
      <div className="space-y-2">
        {taskItem.map((task) => (
          <div key={task.id}>
            <div className="flex h-28 w-full flex-col rounded-lg border border-gray-300 bg-white p-3">
              <div className="group flex items-center gap-2 mb-3">
                <p className="line-clamp-1 flex-1 min-w-0 whitespace-pre-wrap wrap-break-word text-sm text-gray-800">
                  {task.title}
                </p>

                <button className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    setTaskItemId(task.id);
                    setTitle(task.title);
                    setWorkType(task.workType);
                    setDegree(task.degree);
                    setCreatedAt(task.createdAt ? new Date(task.createdAt) : new Date());
                  }}>
                  <LuPencilLine />
                </button>


                <div className="relative shrink-0">
                  <button
                    onClick={() => setShowSetting(
                      showSetting === task.id ? null : task.id // toán tử 3 ngôi nếu showSetting = taskItemId thì trả về null ngược lại mở menutassk đó
                    )}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <LiaEllipsisHSolid />
                  </button>

                  {showSetting === task.id && (
                    <>
                      <div
                        className="absolute top-full z-50 w-32 bg-white shadow-md"
                        onClick={() => setShowSetting(null)}
                      />
                      <div className="absolute top-full w-32 bg-white shadow-md">
                        <button className="block w-full p-2 text-left hover:bg-gray-100"
                              onClick={() => deleteTaskItem(task.id)}>
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>


              </div>




              {/* Nếu taskItemId bằng null thì hiển thị nội dung bên trong */}
              {taskItemId === null && (
                <>
                  <span className="flex mb-2 items-center gap-1 text-xs text-gray-500">
                    <GrFormSchedule size={22} />
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "—"}
                  </span>

                  <div className="mt-1 flex items-center gap-2 text-xs  ">
                    <span
                      className={`rounded px-2 py-0.5 ${task.workType === "Bug"
                        ? "bg-red-100 text-red-700"
                        : task.workType === "Story"
                          ? "bg-green-100 text-green-700"
                          : task.workType === "Task"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {task.workType}
                    </span>

                    <span className={`rounded px-2 py-0.5 ${task.degree === "Thấp"
                      ? "bg-gray-200 text-gray-700"
                      : task.degree === "Trung bình"
                        ? "bg-amber-100 text-amber-700"
                        : task.degree === "Cao"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      {task.degree}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>






      {(isOpen || taskItemId !== null) && ( //hiển thị giao diện nếu isOpen đúng HOẶC taskItemId khác null.
        <div className="w-full rounded-lg border-2 border-blue-500 bg-white p-3">
          <textarea
            className="h-16 w-full resize-none text-sm outline-none"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mt-2 flex flex-nowrap items-center gap-2 text-sm">

            <div className="relative">
              <button
                type="button"
                onClick={() => setBoard(!board)}
                className="flex h-8 items-center rounded bg-gray-100 px-2 text-xs text-gray-700 hover:bg-blue-100"
              >
                <div>
                  {menuItem.find((item) => item.label === workType)?.icons}
                </div>
                <div>
                  <IoIosArrowDown />

                </div>
              </button>
              <ul
                className={`absolute left-0 top-full z-10 overflow-hidden bg-white shadow transition-all duration-500 ${board ? "max-h-96 opacity-100" : "max-h-0 border-0 opacity-0"
                  }`}
              >
                {menuItem.map((item) => (
                  <li
                    key={item.label}
                    onClick={() => {
                      setWorkType(item.label);
                      setBoard(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-2 text-xs hover:bg-blue-100"
                  >
                    {item.icons}
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <DatePicker
              selected={createdAt}
              onChange={(d: Date | null) => setCreatedAt(d)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              customInput={
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 hover:bg-blue-100">
                  <GrFormSchedule size={22} />
                </button>
              }
            />

            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="h-8 rounded bg-gray-100 px-2 text-xs outline-none hover:bg-blue-100"
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
            </select>
            <button
              type="button"
              onClick={taskItemId !== null ? updateProject : handleAdd}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-500 hover:bg-green-200"
              aria-label="Thêm task"
              title="Thêm task"
            >
              ↵
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default AddStatusItem;
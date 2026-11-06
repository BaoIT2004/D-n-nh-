import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { GrFormSchedule } from "react-icons/gr";
import { GoBug } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { RiTaskLine } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { LuPencilLine } from "react-icons/lu";
import { LiaEllipsisHSolid } from "react-icons/lia";
import { useTaskItems } from "../../hooks/tasks/use-task-items";
import {
  useCreateStaskItem,
  useDeleteTaskItem,
  useUpdateTaskItem,
} from "../../hooks/tasks/use-create-task-item";
import { useNavigate } from "react-router-dom";

function AddStatusItem({
  statusId,
  isOpen,
}: {
  statusId: number;
  isOpen: boolean;
}) {
  // cú pháp props có điều kiện Dùng khi component cần nhận dữ liệu từ component cha
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("Task");
  const [degree, setDegree] = useState("Thấp");
  const [createdAt, setCreatedAt] = useState<Date | null>(new Date());
  const { data: taskItem = [] } = useTaskItems(statusId); // hiển thị taskItem
  const [board, setBoard] = useState(false);
  const [taskItemId, setTaskItemId] = useState<number | null>(null); // tạo để nhớ khi sửa useState<number | null>: kiểu của giá trị là number (id của task) hoặc null (không sửa task nào).
  const [showSetting, setShowSetting] = useState<number | null>(null);
  const { mutate: createTaskItem } = useCreateStaskItem();
  const { mutate: updateTaskItem } = useUpdateTaskItem();
  const { mutate: deleteTaskItem } = useDeleteTaskItem();
  const navigate = useNavigate();

  //THÊM
  function handleAdd() {
    if (!title.trim() || !createdAt) {
      toast.error("Không được để trống trường");
      return;
    }

    createTaskItem(
      {
        Title: title,
        createdAt: createdAt.toLocaleDateString("sv-SE"),
        workType,
        degree,
        statusId,
      },
      {
        onSuccess: () => {
          toast.success("Thêm thành công");
          setTitle("");
          setWorkType("Task");
          setDegree("Thấp");
        },
        onError: (Error) => {
          toast.error(Error.message);
        },
      },
    );
  }

  //Cập nhật dự án
  function updateProject() {
    if (!title.trim() || !createdAt || taskItemId === null) {
      return;
    }
    updateTaskItem(
      {
        Title: title,
        createdAt: createdAt.toLocaleDateString("sv-SE"),
        workType,
        degree,
        taskItemId,
        statusId,
      },
      {
        onSuccess: () => {
          toast.success("cập nhật thành công");
          setTitle("");
          setWorkType("Task");
          setDegree("Thấp");
          setTaskItemId(null);
        },
        onError: (Error) => {
          toast.error(Error.message);
        },
      },
    );
  }



  //xóa dự án
  function handleDeleteTaskItem(taskItemId: number) {
    deleteTaskItem(
      {
        taskItemId,
        statusId,
      },
      {
        onSuccess: () => {
          toast.success("Xóa thành công");
        },
        onError: (Error) => {
          toast.error(Error.message);
        },
      },
    );
  }

  const menuItem = [
    {
      icons: <GoBug className="text-red-500" />,
      label: "Bug",
    },
    {
      icons: <CiBookmark className="text-green-500" />,
      label: "Story",
    },
    {
      icons: <RiTaskLine className="text-blue-500" />,
      label: "Task",
    },
  ];

  return (
    <div>
      <div className="space-y-2">
        {taskItem.map((task) => (
          <div key={task.id}>
            <div
              className="flex h-28 w-full flex-col rounded-lg border border-gray-300 bg-white p-3"
              onClick={() => navigate(`/task-detail-modal/${task.id}`)}
            >
              <div className="group flex items-center gap-2 mb-3">
                <p className="line-clamp-1 flex-1 min-w-0 whitespace-pre-wrap wrap-break-word text-sm text-gray-800">
                  {task.title}
                </p>

                <div
                  className="flex shrink-0 items-center gap-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      setTaskItemId(task.id);
                      setTitle(task.title);
                      setWorkType(task.workType);
                      setDegree(task.degree);
                      setCreatedAt(
                        task.createdAt ? new Date(task.createdAt) : new Date(),
                      );
                    }}
                  >
                    <LuPencilLine />
                  </button>

                  <div
                    className={`relative shrink-0 ${showSetting === task.id ? "z-50" : ""}`}
                  >
                    <button
                      onClick={() =>
                        setShowSetting(
                          showSetting === task.id ? null : task.id, // toán tử 3 ngôi nếu showSetting = taskItemId thì trả về null ngược lại mở menutassk đó
                        )
                      }
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <LiaEllipsisHSolid />
                    </button>

                    {showSetting === task.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowSetting(null)}
                        />
                        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded bg-white shadow-md">
                          <button
                            className="block w-full p-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              handleDeleteTaskItem(task.id);
                              setShowSetting(null);
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                      </>
                    )}
                  </div>
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
                        })
                      : "—"}
                  </span>

                  <div className="mt-1 flex items-center gap-2 text-xs  ">
                    <span
                      className={`rounded px-2 py-0.5 ${
                        task.workType === "Bug"
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

                    <span
                      className={`rounded px-2 py-0.5 ${
                        task.degree === "Thấp"
                          ? "bg-gray-200 text-gray-700"
                          : task.degree === "Trung bình"
                            ? "bg-amber-100 text-amber-700"
                            : task.degree === "Cao"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
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
                className={`absolute left-0 top-full z-10 overflow-hidden bg-white shadow transition-all duration-500 ${board ? "max-h-96 opacity-100" : "max-h-0 border-0 opacity-0"}`}
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
              dateFormat="dd/MM/yyyy"
              customInput={
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 hover:bg-blue-100"
                >
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

import { useNavigate, useParams } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { useTaskItem } from "../../hooks/tasks/use-task-items";
import { GoBug } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { RiTaskLine } from "react-icons/ri";
import {
  useAddFile,
  useDownLoadFile,
  useGetFiles,
} from "../../hooks/tasks/use-add-Task-Attachment";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdArrowDropdown } from "react-icons/io";
import { AiOutlineEnter } from "react-icons/ai";
import { useProjectMembers } from "../../hooks/TaskDetail/use-task-detail";
import { useUpdateAssignee } from "../../hooks/TaskDetail/use-update-Assignee";
import {
  useCreateTaskItem,
  useUpdateTaskItem,
} from "../../hooks/tasks/use-task-item-mutations";
import DatePicker from "react-datepicker";

export default function TaskDetailModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: task, isLoading, isError } = useTaskItem(Number(id));
  const { mutate: addFile } = useAddFile();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: filesData } = useGetFiles(Number(id));
  const files = filesData?.success ? filesData.data : [];
  const downloadMutation = useDownLoadFile();
  const [open, setOpen] = useState(true); //đóng mở giao diện
  const [isSubtaskInputOpen, setIsSubtaskInputOpen] = useState(false);

  const { data: members = [] } = useProjectMembers(task?.projectId ?? 0);
  const { mutate: changeAssignee } = useUpdateAssignee();

  const [isTaskAssigneeMenuOpen, setIsTaskAssigneeMenuOpen] = useState(false);
  const [openSubtaskAssigneeId, setOpenSubtaskAssigneeId] = useState<
    number | null
  >(null);
  const { mutate: updateTaskItem } = useUpdateTaskItem();

  const [subTitle, setSubTitle] = useState("");
  const { mutate: createMutation } = useCreateTaskItem();

  if (isLoading) return <p>Đang tải task...</p>;
  if (isError || !task) return <p>Không tải được task.</p>;
  const currentTask = task;
  //hiển thị màu đỏ trang khá
  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date(task.createdAt)
    : false;

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

  // thêm file
  function handleChange() {
    if (!file) {
      toast.error("Chưa chọn file");
      return;
    }
    addFile(
      {
        taskItemId: Number(id),
        file,
      },
      {
        onSuccess: () => {
          toast.success("Thêm file thành công");
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: (Error) => {
          toast.error(Error.message);
        },
      },
    );
  }

  //Hàm chọn người thực hiện
  function updateTaskAssignee(
    taskItemId: number,
    assigneeId: number | null,
    parentTaskId: number | null,
  ) {
    changeAssignee(
      { taskItemId, assigneeId, parentTaskId },
      {
        onSuccess: () => toast.success("Cập nhật thành công"),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  function handleSelectTaskAssignee(assigneeId: number | null) {
    updateTaskAssignee(currentTask.id, assigneeId, currentTask.parentId);
    setIsTaskAssigneeMenuOpen(false);
  }

  function handleSelectSubtaskAssignee(
    taskItemId: number,
    assigneeId: number | null,
  ) {
    updateTaskAssignee(taskItemId, assigneeId, currentTask.id);
    setOpenSubtaskAssigneeId(null);
  }

  function handleDueDateChange(dueDate: string) {
    if (!dueDate) {
      toast.error("Ngày hết hạn không được để trống");
      return;
    }

    updateTaskItem(
      {
        title: currentTask.title,
        createdAt: currentTask.createdAt.slice(0, 10),
        dueDate: dueDate,
        workType: currentTask.workType,
        degree: currentTask.degree,
        taskItemId: currentTask.id,
        statusId: currentTask.statusId,
      },
      {
        onSuccess: () => {
          toast.success("ngày hết hạn đã cập nhật");
        },
        onError: (Error) => {
          toast.error(Error.message);
        },
      },
    );
  }

  // thêm Subtasks
  const handleAddSubtask = () => {
    const title = subTitle.trim();
    if (!title) return;

    createMutation(
      {
        title,
        createdAt: new Date().toLocaleDateString("sv-SE"), // yyyy-MM-dd
        workType: "Task",
        degree: "Medium", // đổi theo giá trị backend của bạn
        statusId: task.statusId, // cùng status với task cha
        parentId: Number(id), // id của task cha (từ useParams)
      },
      {
        onSuccess: () => {
          toast.success("Thêm thành công");
          setSubTitle("");
          setIsSubtaskInputOpen(false);
        },
        onError: (e) => toast.error(e.message),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        aria-labelledby="task-detail-title"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl" //overflow-hidden cố định
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-slate-300 px-6 py-3 text-sm">
          <p className="text-gray-500">
            Project /{" "}
            <span className="rounded bg-purple-100 px-1.5 py-0.5 font-semibold text-green-400">
              TASK-{id}
            </span>
          </p>
          <button
            aria-label="Close task details"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            onClick={() => navigate(-1)} // navigate(-1): lùi 1 trang (về trang trước)
            type="button"
          >
            <IoCloseOutline />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[1fr_320px]">
          <div className="min-h-0 space-y-6 overflow-y-auto p-6 md:border-r md:border-slate-300 scrollbar-none [&::-webkit-scrollbar]:hidden">
            <h1
              className="text-2xl font-semibold text-gray-900"
              id="task-detail-title"
            >
              {task.title}
            </h1>

            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-800">
                Description
              </h2>
              <textarea
                className="w-full resize-y rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Add a description..."
                rows={4}
              />
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-800">
                Attachments
              </h2>

              <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                <button
                  className="rounded-md border bg-white px-4 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
                  type="button"
                  onClick={handleChange}
                >
                  + Add attachment
                </button>
              </div>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm"
                    >
                      <button
                        className="truncate text-left text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() =>
                          downloadMutation.mutate(
                            { fileId: f.id, fileName: f.fileName },
                            { onError: (e) => toast.error(e.message) },
                          )
                        }
                      >
                        {f.fileName}
                      </button>
                      <span className="text-xs text-gray-500">
                        {new Date(f.uploadedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="max-w-2xl font-sans">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <button
                    className={`text-gray-600 ml-1.5 duration-500 cursor-pointer ${open ? "" : "-rotate-180"}`}
                    onClick={() => setOpen(!open)}
                  >
                    <IoMdArrowDropdown />
                  </button>
                  <h3 className="flex-1 text-lg font-semibold">Subtasks</h3>
                  <button
                    className="rounded px-2 text-xl text-gray-600 hover:bg-gray-100"
                    onClick={() => setIsSubtaskInputOpen(true)}
                    type="button"
                  >
                    +
                  </button>
                </div>

                {/* Thanh tiến độ */}
                <div className="my-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded bg-gray-400">
                    <div
                      className="h-full bg-lime-600"
                      style={{ width: "50%" }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">50% Done</span>
                </div>
                {/* Bảng danh sách */}
                <div
                  className={`transition-all duration-500 ease-in-out ${open ? "opacity-100" : "hidden"}`}
                >
                  {open && (
                    <div className="rounded-lg border border-gray-200">
                      <div className="grid grid-cols-[1fr_120px_160px_140px] border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
                        <div className="px-3 py-2">Work</div>
                        <div className="border-l border-gray-200 px-3 py-2">
                          Priority
                        </div>

                        <div className="border-l border-gray-200 px-3 py-2">
                          Assignee
                        </div>

                        <div className="border-l border-gray-200 px-3 py-2">
                          Status
                        </div>
                      </div>

                      {task.subTasks.map((st) => (
                        <div
                          key={st.id}
                          className="grid grid-cols-[1fr_120px_160px_140px] border-b border-gray-200 text-sm hover:bg-gray-50"
                        >
                          <div className="px-3 py-2">
                            <span className="text-blue-600">TASK-{st.id}</span>{" "}
                            {st.title}
                          </div>
                          <div className="px-3 py-2">{st.degree}</div>
                          <div className="relative px-3 py-2">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenSubtaskAssigneeId((current) =>
                                  current === st.id ? null : st.id,
                                )
                              }
                              className="rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              {st.assigneeEmail ?? "Unassigned"}
                            </button>
                            {openSubtaskAssigneeId === st.id && (
                              <ul className="absolute left-0 top-full z-10 w-64 rounded-md border bg-white text-left shadow-lg">
                                <li
                                  className="cursor-pointer px-3 py-2 text-gray-500 hover:bg-gray-100"
                                  onClick={() =>
                                    handleSelectSubtaskAssignee(st.id, null)
                                  }
                                >
                                  Unassigned
                                </li>
                                {members.map((m) => (
                                  <li
                                    key={m.id}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                    onClick={() =>
                                      handleSelectSubtaskAssignee(st.id, m.id)
                                    }
                                  >
                                    {m.email}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="px-3 py-2">{st.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* đánh dấu */}
                {isSubtaskInputOpen && (
                  <div>
                    <div className="flex items-center gap-2 rounded-md border-2 border-blue-400 px-3 py-1.5 mt-5 text-sm outline-none">
                      <input
                        type="text"
                        placeholder="Nhập tên dự án"
                        className="w-full outline-none"
                        onChange={(e) => setSubTitle(e.target.value)}
                      />
                      <button
                        className="rounded-[5px] bg-blue-600 ml-auto px-1.5 py-1.5 text-sm text-white hover:bg-blue-700"
                        onClick={handleAddSubtask}
                      >
                        <AiOutlineEnter />
                      </button>
                    </div>

                    <button
                      className="text-xs cursor-pointer ml-154 mt-3"
                      onClick={() => setIsSubtaskInputOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* cột phải */}
          <aside className="bg-gray-50/60 p-6">
            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white text-sm shadow-sm">
              <h2 className="bg-gray-100 px-4 py-3 text-base font-semibold text-gray-800">
                Details
              </h2>
              <dl className="space-y-5 p-4">
                <div className="relative flex items-center justify-between">
                  <dt className="text-xs font-medium text-gray-500">
                    Assignee
                  </dt>
                  <dd className="text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setIsTaskAssigneeMenuOpen(!isTaskAssigneeMenuOpen)
                      }
                      className="rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      {task.assigneeEmail ?? "Unassigned"}
                    </button>
                    {isTaskAssigneeMenuOpen && (
                      <ul className="absolute right-0 top-8 z-10 w-64 rounded-md border bg-white text-left shadow-lg">
                        <li
                          className="cursor-pointer px-3 py-2 text-gray-500 hover:bg-gray-100"
                          onClick={() => handleSelectTaskAssignee(null)}
                        >
                          Unassigned
                        </li>
                        {members.map((m) => (
                          <li
                            key={m.id}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleSelectTaskAssignee(m.id)}
                          >
                            {m.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Priority
                  </dt>
                  <dd>
                    <span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          task.workType === "Bug"
                            ? "bg-red-100 text-red-700"
                            : task.workType === "Story"
                              ? "bg-green-100 text-green-700"
                              : task.workType === "Task"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {
                          menuItem.find((item) => item.label === task.workType)
                            ?.icons
                        }
                        {task.workType}
                      </span>
                    </span>
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Labels
                  </dt>
                  <dd className="text-gray-500">Add labels</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Start date
                  </dt>
                  <dd className="text-gray-500">
                    {/*set form ngày tháng năm*/}
                    {new Date(task.createdAt).toLocaleDateString("vi-VN")}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Due date
                  </dt>
                  <dd className="text-gray-500">
                    <DatePicker
                      selected={
                        task.dueDate ? new Date(task.dueDate) : new Date()
                      }
                      onChange={(
                        d: Date | null, //d là ngày người dùng vừa chọn : Date | null là khai báo kiểu cho TypeScript: d là một đối tượng Date, hoặc null (khi người dùng xóa ô ngày).
                      ) =>
                        d && handleDueDateChange(d.toLocaleDateString("sv-SE"))
                      }
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()} //ngày nhỏ nhất được phép chọn trong DatePicker
                      className={`w-24 cursor-pointer rounded border px-1 text-right outline-none ${
                        isOverdue
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-transparent bg-transparent text-gray-500"
                      }`}
                    />
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Reporter
                  </dt>
                  <dd className="text-gray-800">
                    {task.createdByEmail ?? "Không rõ"}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

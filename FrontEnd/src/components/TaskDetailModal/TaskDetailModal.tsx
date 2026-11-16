import { useNavigate, useParams } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { useTaskItem } from "../../hooks/tasks/use-task-items";
import { GoBug } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { RiTaskLine } from "react-icons/ri";
import {
  useAddFile,
  useDeleteFile,
  useDownLoadFile,
  useGetFiles,
} from "../../hooks/tasks/use-add-Task-Attachment";
import { useEffect, useRef, useState } from "react";
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
import { MdDeleteOutline } from "react-icons/md";
import { useStatusTasks } from "../../hooks/tasks/use-status-tasks";

export default function TaskDetailModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: task, isLoading, isError } = useTaskItem(Number(id));
  const { mutate: addFile } = useAddFile();
  const [file, setFile] = useState<File | null>(null); //kiểu của state là File (đối tượng file của trình duyệt) hoặc null.
  const fileInputRef = useRef<HTMLInputElement>(null);
  //lấy danh sách file đính kèm của task từ BE để hiển thị lên màn hình.
  const { data: filesData } = useGetFiles(Number(id));
  const files = filesData?.success ? filesData.data : [];
  //Download file
  const downloadMutation = useDownLoadFile();
  const [open, setOpen] = useState(true); //đóng mở giao diện
  const [isSubtaskInputOpen, setIsSubtaskInputOpen] = useState(false);

  const { data: members = [] } = useProjectMembers(task?.projectId ?? 0);
  const { mutate: changeAssignee } = useUpdateAssignee();

  const [isTaskAssigneeMenuOpen, setIsTaskAssigneeMenuOpen] = useState(false);
  const [openSubtaskAssigneeId, setOpenSubtaskAssigneeId] = useState<
    number | null
  >(null);
  const { mutate: updateTaskItem, isPending: isUpdatingTask } =
    useUpdateTaskItem();

  const [subTitle, setSubTitle] = useState("");
  const { mutate: createMutation } = useCreateTaskItem();

  const { mutate: deleteFile } = useDeleteFile();

  const [description, setDescription] = useState("");
  useEffect(() => {
    //Dùng để thực hiện một đoạn code khi component được render hoặc khi dữ liệu phụ thuộc thay đổi.
    if (task) {
      setDescription(task.description ?? ""); //Dùng để lấy description từ Task đưa vào state.
    }
  }, [task]); //dependency array (mảng phụ thuộc).

  const { data: statusTasks = [] } = useStatusTasks(task?.projectId ?? 0); //ID của Project mà Task hiện tại đang thuộc về

  //kéo các cột
  const [colWidths, setColWidths] = useState([300, 120, 160, 140]); // px
  const gridCols = colWidths.map((w) => `${w}px`).join(" ");

  function startResize(e: React.MouseEvent, index: number) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = colWidths[index];

    const onMove = (ev: MouseEvent) => {
      const newWidth = Math.max(80, startWidth + ev.clientX - startX); // tối thiểu 80px
      setColWidths((prev) => prev.map((w, i) => (i === index ? newWidth : w)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  if (isLoading) return <p>Đang tải task...</p>;
  if (isError || !task) return <p>Không tải được task.</p>;
  const currentTask = task;

  function saveDescription() {
    updateTaskItem(
      {
        taskItemId: currentTask.id,
        title: currentTask.title,
        startDate: currentTask.startDate.slice(0, 10),
        dueDate: currentTask.dueDate,
        workType: currentTask.workType,
        degree: currentTask.degree,
        statusId: currentTask.statusId,
        description,
      },
      {
        onSuccess: () => toast.success("Đã lưu mô tả"),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  //hiển thị màu đỏ trang khá
  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date(task.startDate)
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

  // xóa file
  function handleDeleteFile(attachmentId: number) {
    if (!window.confirm("Bạn có chắc muốn xóa file này?")) return;
    deleteFile(attachmentId, {
      onSuccess: () => toast.success("Xóa file thành công"),
      onError: (e) => toast.error(e.message),
    });
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

  // hàm thay đổi người thực hiện
  function handleSelectTaskAssignee(assigneeId: number | null) {
    updateTaskAssignee(currentTask.id, assigneeId, currentTask.parentId);
    setIsTaskAssigneeMenuOpen(false);
  }

  //chọn người thực hiện
  function handleSelectSubtaskAssignee(
    taskItemId: number,
    assigneeId: number | null,
  ) {
    updateTaskAssignee(taskItemId, assigneeId, currentTask.id);
    setOpenSubtaskAssigneeId(null);
  }

  //cập nhật taskItem
  function handleDueDateChange(dueDate: string) {
    if (!dueDate) {
      toast.error("Ngày hết hạn không được để trống");
      return;
    }

    updateTaskItem(
      {
        title: currentTask.title,
        startDate: currentTask.startDate.slice(0, 10),
        dueDate: dueDate,
        workType: currentTask.workType,
        degree: currentTask.degree,
        taskItemId: currentTask.id,
        statusId: currentTask.statusId,
        description: description,
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
        startDate: new Date().toLocaleDateString("sv-SE"), // yyyy-MM-dd
        workType: "Task",
        degree: "Medium", // đổi theo giá trị backend của bạn
        statusId: task.statusId, // cùng status với task cha
        parentId: Number(id),
        description: null,
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-y rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Add a description..."
                rows={4}
              />
              <div className="flex">
                <button
                  className="mt-2 ml-auto rounded bg-[#29903b] px-4 py-2 text-white disabled:opacity-50"
                  onClick={saveDescription}
                >
                  Save
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold text-gray-800">
                Attachments
              </h2>

              <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} // lấy file đầu tiên người dùng chọn nếu không thì null
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
                <>
                  <div className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                    <span>Tên tệp</span>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-left">Ngày tải lên</span>
                      <span className="w-4" />
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {files.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center justify-between rounded-md border border-blue-200 px-3 py-2 text-sm"
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
                        <div className="flex items-center gap-4">
                          <span className="w-24 text-left text-xs text-gray-500">
                            {new Date(f.uploadedAt).toLocaleDateString("vi-VN")}
                          </span>

                          {/* xóa */}
                          <button
                            type="button"
                            className="flex w-4 justify-center cursor-pointer"
                            onClick={() => handleDeleteFile(f.id)}
                          >
                            <MdDeleteOutline color="red" size={15} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
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
                      <div
                        className="grid ..."
                        style={{ gridTemplateColumns: gridCols }}
                      >
                        {["Work", "Priority", "Assignee", "Status"].map(
                          (name, i) => (
                            <div
                              key={name}
                              className="relative border-l border-gray-200 px-3 py-2 first:border-l-0"
                            >
                              {name}
                              <div
                                onMouseDown={(e) => startResize(e, i)}
                                className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-blue-400"
                              />
                            </div>
                          ),
                        )}
                      </div>

                      {task.subTasks.map((st) => (
                        <div
                          key={st.id}
                          className="grid border-b border-gray-200 text-sm hover:bg-gray-50"
                          style={{ gridTemplateColumns: gridCols }}
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
                              className="block max-w-full truncate rounded px-2 py-1 text-left text-gray-600 hover:bg-gray-100"
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
            <section>
              <ul className="space-y-1">
                <select
                  value={task.statusId}
                  onChange={(e) => {
                    updateTaskItem({
                      taskItemId: task.id,
                      title: task.title,
                      startDate: task.startDate.slice(0, 10),
                      dueDate: task.dueDate,
                      workType: task.workType,
                      degree: task.degree,
                      statusId: Number(e.target.value),
                      description: task.description,
                    });
                  }}
                >
                  {statusTasks.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status}
                    </option>
                  ))}
                </select>
              </ul>
            </section>

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
                    {new Date(task.startDate).toLocaleDateString("vi-VN")}
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

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

  if (isLoading) return <p>Đang tải task...</p>;
  if (isError || !task) return <p>Không tải được task.</p>;

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
                  <button className="rounded px-2 text-xl text-gray-600 hover:bg-gray-100">
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
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {open && (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
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
                      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-3 hover:bg-gray-50">
                        <a className="cursor-pointer text-blue-600 line-through">
                          PROJ-21
                        </a>
                        <span>Database</span>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-3 hover:bg-gray-50">
                        <a className="cursor-pointer text-blue-600 hover:underline">
                          PROJ-22
                        </a>
                        <span>DB</span>
                      </div>
                    </div>
                  )}
                </div>
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
                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Assignee
                  </dt>
                  <dd className="text-gray-500">Unassigned</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Parent
                  </dt>
                  <dd className="text-gray-500">Add parent</dd>
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
                  <dd className="text-gray-500">Add date</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="mb-1 text-xs font-medium text-gray-500">
                    Due date
                  </dt>
                  <dd className="text-gray-500">{task.createdAt}</dd>
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

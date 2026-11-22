import { useEffect, useRef, useState, type ReactNode } from "react";
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
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReorderStatus } from "../../hooks/tasks/use-Reorder-Status";
import { useReorderTaskItem } from "../../hooks/tasks/user-Reorder-Task-item";
import type { GetAllTaskItem } from "../../types/TaskITem";

function SortableColumn({
  id,
  title,
  children,
}: {
  id: number;
  title: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `col-${id}`, data: { type: "column", statusId: id } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="self-stretch shrink-0">
      <div className="w-64 min-w-64 h-fit p-4 bg-[#F8F8F8] rounded-lg shadow-sm border border-gray-200">
        {/* Khu vực kéo cột */}
        <div {...attributes} {...listeners} className="cursor-grab mb-4">
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>

        {/* Nội dung cột */}
        {children}
      </div>
    </div>
  );
}

function BoardPage() {
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

  const { id: projectId } = useParams(); // Lấy id dự án từ URL (ví dụ: /projects/:id)
  const projectIdNumber = Number(projectId);
  const queryClient = useQueryClient();
  const { data: statusTasks = [] } = useStatusTasks(projectIdNumber);
  const { data: projects = [] } = useProjects();
  const { mutate } = useAddMember();
  const reorder = useReorderStatus(projectIdNumber);
  const moveTask = useReorderTaskItem();
  const dragReorderedRef = useRef(false);

  const [projectOpen, setProjectOpen] = useState(false); // projectOpen ban đầu là false
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState("Todo");
  const [email, setEmail] = useState("");
  // const [items, setItems] = useState<number | null>(); // chỉ có thể chứa một số
  const [items, setItems] = useState<number[]>([]); /// lấy một mảng nhiều số
  const [openColumnId, setOpenColumnId] = useState<number | null>(null); // thêm cột
  const currentProject = projects.find((p) => p.id === projectIdNumber); // lấy status của tạo dự án
  //ẩn khi chọn xong
  const availableOptions = STATUS_OPTIONS.filter(
    (o) => !statusTasks.some((s) => s.status === o.value), //some: "có ít nhất 1": duyệt từng cột trong status nếu thỏa mã trả true . ! có mục đích đảo ngược lại
  );

  //items là mảng id đã được sắp xếp, ví dụ [3, 1, 2] (thay đổi sau khi kéo thả bằng arrayMove).
  //Với mỗi id, find tìm trong statusTasks cột có s.id === id.
  //!!s đổi s thành true/false: có giá trị thì giữ, undefined thì loại.
  // s is NonNullable<typeof s> là type guard của TypeScript: báo cho TS
  // biết sau khi lọc, mảng không còn undefined. Nhờ vậy khi dùng
  // orderedStatusTasks.map((s) => s.id) sẽ không bị lỗi “s possibly undefined”.
  const orderedStatusTasks = items
    .map((id) => statusTasks.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // người dùng di chuyển 5px mới di chuyển
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  //đồng bộ Id status từ API vào setItems
  useEffect(() => {
    const sorted = [...statusTasks].sort((a, b) => a.position - b.position);

    setItems(sorted.map((s) => s.id));
  }, [statusTasks]);

  //tắt trang StatusTask
  const toggleModal = () => {
    setModal(!modal);
  };

  //thêm trạng thái
  const handleAddStatusTask = async () => {
    if (!Number.isInteger(projectIdNumber) || projectIdNumber <= 0) {
      toast.error("ID dư án không hợp lệ");
      return;
    }
    try {
      const result = await AddStatusTask(status, projectIdNumber);
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

  //Thêm cột mới
  const handleClickPlus = (columnId: number) => {
    if (openColumnId === columnId) {
      setOpenColumnId(null); // đang mở đúng cột này → đóng lại
    } else {
      setOpenColumnId(columnId); // mở cột này
    }
  };

  //thêm thành viên
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

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type !== "item") return;

    const activeTaskId = Number(String(active.id).replace("item-", ""));
    const sourceStatusId = active.data.current.statusId as number;
    const overType = over.data.current?.type;

    const targetStatusId =
      overType === "column"
        ? Number(String(over.id).replace("col-", ""))
        : (over.data.current?.statusId as number);

    if (
      !Number.isInteger(activeTaskId) ||
      !Number.isInteger(sourceStatusId) ||
      !Number.isInteger(targetStatusId)
    ) {
      return;
    }

    const sourceKey = ["taskItems", sourceStatusId];
    const targetKey = ["taskItems", targetStatusId];

    if (sourceStatusId === targetStatusId) {
      if (overType !== "item") return;

      const overTaskId = Number(String(over.id).replace("item-", ""));
      const sourceTasks =
        queryClient.getQueryData<GetAllTaskItem[]>(sourceKey) ?? [];
      const oldIndex = sourceTasks.findIndex(
        (task) => task.id === activeTaskId,
      );
      const newIndex = sourceTasks.findIndex(
        (task) => task.id === overTaskId,
      );

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      dragReorderedRef.current = true;
      queryClient.setQueryData(
        sourceKey,
        arrayMove(sourceTasks, oldIndex, newIndex),
      );
      return;
    }

    const sourceTasks =
      queryClient.getQueryData<GetAllTaskItem[]>(sourceKey) ?? [];
    const targetTasks =
      queryClient.getQueryData<GetAllTaskItem[]>(targetKey) ?? [];
    const activeTask = sourceTasks.find((task) => task.id === activeTaskId);
    if (!activeTask) return;

    const newSourceTasks = sourceTasks.filter(
      (task) => task.id !== activeTaskId,
    );
    const newTargetTasks = targetTasks.filter(
      (task) => task.id !== activeTaskId,
    );

    let insertIndex = newTargetTasks.length;
    if (overType === "item") {
      const overTaskId = Number(String(over.id).replace("item-", ""));
      const overIndex = newTargetTasks.findIndex(
        (task) => task.id === overTaskId,
      );
      if (overIndex !== -1) insertIndex = overIndex;
    }

    newTargetTasks.splice(insertIndex, 0, activeTask);
    dragReorderedRef.current = true;
    queryClient.setQueryData(sourceKey, newSourceTasks);
    queryClient.setQueryData(targetKey, newTargetTasks);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Kéo đổi vị trí cột
    if (activeType === "column" && overType === "column") {
      const activeId = Number(String(active.id).replace("col-", ""));
      const overId = Number(String(over.id).replace("col-", ""));

      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      reorder.mutate(newItems);
    }

    if (activeType === "item") {
      const activeTaskId = Number(String(active.id).replace("item-", ""));
      const sourceStatusId = active.data.current?.statusId as number;

      if (!Number.isInteger(activeTaskId) || !Number.isInteger(sourceStatusId)) {
        return;
      }

      const targetStatusId =
        overType === "column"
          ? Number(String(over.id).replace("col-", ""))
          : (over.data.current?.statusId as number);

      if (!Number.isInteger(targetStatusId)) return;

      const sourceKey = ["taskItems", sourceStatusId];
      const targetKey = ["taskItems", targetStatusId];
      const targetTasks =
        queryClient.getQueryData<GetAllTaskItem[]>(targetKey) ?? [];

      if (sourceStatusId === targetStatusId) {
        let finalTasks = targetTasks;

        if (!dragReorderedRef.current && overType === "item") {
          const overTaskId = Number(String(over.id).replace("item-", ""));
          const oldIndex = targetTasks.findIndex(
            (task) => task.id === activeTaskId,
          );
          const newIndex = targetTasks.findIndex(
            (task) => task.id === overTaskId,
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            finalTasks = arrayMove(targetTasks, oldIndex, newIndex);
            queryClient.setQueryData(targetKey, finalTasks);
          }
        }

        moveTask.mutate({
          taskItemId: activeTaskId,
          statusId: targetStatusId,
          ids: finalTasks.map((task) => task.id),
        });
        dragReorderedRef.current = false;
        return;
      }

      let finalTargetTasks = targetTasks;
      if (
        !dragReorderedRef.current &&
        !targetTasks.some((task) => task.id === activeTaskId)
      ) {
        const sourceTasks =
          queryClient.getQueryData<GetAllTaskItem[]>(sourceKey) ?? [];
        const activeTask = sourceTasks.find(
          (task) => task.id === activeTaskId,
        );
        if (activeTask) {
          let insertIndex = finalTargetTasks.length;
          if (overType === "item") {
            const overTaskId = Number(String(over.id).replace("item-", ""));
            const overIndex = finalTargetTasks.findIndex(
              (task) => task.id === overTaskId,
            );
            if (overIndex !== -1) insertIndex = overIndex;
          }
          finalTargetTasks = [...finalTargetTasks];
          finalTargetTasks.splice(insertIndex, 0, activeTask);
          queryClient.setQueryData(targetKey, finalTargetTasks);
        }
      }

      moveTask.mutate({
        taskItemId: activeTaskId,
        statusId: targetStatusId,
        ids: finalTargetTasks.map((task) => task.id),
      });
      dragReorderedRef.current = false;
    }
  }

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
          {projectOpen && <AddProject />}
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
              <div className="flex items-start gap-3 overflow-x-auto">
                <DndContext
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  collisionDetection={closestCorners}
                  sensors={sensors}
                >
                  <SortableContext //xác định một nhóm phần tử có thể kéo thả và sắp xếp thứ tự.
                    items={items.map((id) => `col-${id}`)} //duyệt từng phần tử trong items  ghép col- với id của cột đó
                    strategy={horizontalListSortingStrategy} //sắp xếp các phần tử theo chiều ngang
                  >
                    {orderedStatusTasks.map(
                      (
                        column, // danh sách các cột trạng thái , duyệt từng phần trong mỗi cột (Status)
                      ) => (
                        <SortableColumn
                          key={column.id} // phân biệt cột nào bằng id
                          id={column.id} // xác định cột nào kéo thả
                          title={column.status} // Hiển thị tên cột
                        >
                          <AddStatusItem //Hiển thị danh sách trạng thái
                            statusId={column.id} // truyền component để lấy task tương ứng
                            isOpen={openColumnId === column.id} //Kiểm tra cột hiện tại có mở hay không
                          />
                          <div className="p-1 rounded shadow-sm border border-dashed border-gray-300 text-sm text-gray-500 flex justify-center">
                            <button onClick={() => handleClickPlus(column.id)}>
                              <CiSquarePlus size={20} />
                            </button>
                          </div>
                        </SortableColumn>
                      ),
                    )}

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
                              (p) =>
                                statusTasks.some((s) => s.status === p.value) //chạy cho từng option; trả true thì option bị khóa. some kiểm tra option đó đã có trong statusTasks chưa, nếu có thì khóa, nên mỗi status chỉ chọn được 1 lần.
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
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BoardPage;

import { useEffect, useState, type JSX, type ReactNode } from "react";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    useSortable({ id: `col-${id}`, data: { type: "column" } });

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
    setItems((prev) => {
      const newIds = statusTasks.map((s) => s.id);

      // Giữ thứ tự cũ nếu danh sách ID không thay đổi
      const oldIds = new Set(prev);
      const addedIds = newIds.filter((id) => !oldIds.has(id));

      const validOldIds = prev.filter((id) => newIds.includes(id));

      return [...validOldIds, ...addedIds];
    });
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

  function handleDragEnd(even: DragEndEvent) {
    // even sự kiện kéo thả , kiểu dữ liệu của sự kiện kết thúc kéo thả thư viện dnd kit
    const { active, over } = even; // cách lấy dữ liệu từ opject envet có hai giá trị (phần tử mà người dùng kéo và phần tử người dùng thả)
    if (!over) return; //kiểm tra vị trí thả có hay không
    if (active.id !== over.id) {
      //nếu id của ngời dùng kéo khác với id mà người dùng thả  sẽ thực hiện đổi vị trí
      //B1 chuyển id thành chuỗi String(active.id) id: `col-${id}`
      //B2 replace xó chữ col-
      //N3 biến chỗi thánh số
      const activeId = Number(String(active.id).replace("col-", ""));
      const overId = Number(String(over.id).replace("col-", ""));
      setItems((items) => {
        //cập nhật danh sách item ví dụ [1,2,3]
        const oldIndex = items.indexOf(Number(activeId)); // tìm vị trí cũ dùng indexOf
        const newIndex = items.indexOf(Number(overId)); // vị trí mới
        if (oldIndex === -1 || newIndex === -1) return items; // ondexOf = -1 nếu không tìm thấy phần tử
        return arrayMove(items, oldIndex, newIndex); // trả về vị trí mới  - items là một mảng lưu danh sách ID và thứ tự của các cột trạng thái
      });
    }
    console.log("handleDragEnd", even);
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
                  collisionDetection={closestCorners}
                  sensors={sensors}
                >
                  <SortableContext //xác định một nhóm phần tử có thể kéo thả và sắp xếp thứ tự.
                    items={items.map((id) => `col-${id}`)} //duyệt từng phần tử trong items  ghép col- với id của cột đó
                    strategy={horizontalListSortingStrategy} //sắp xếp các phần tử theo chiều ngang
                  >
                    {orderedStatusTasks.map(
                      (
                        status, // danh sách các cột trạng thái , duyệt từng phần trong mỗi cột (Status)
                      ) => (
                        <SortableColumn
                          key={status.id} // phân biệt cột nào bằng id
                          id={status.id} // xác định cột nào kéo thả
                          title={status.status} // Hiển thị tên cột
                        >
                          <AddStatusItem //Hiển thị danh sách trạng thái
                            statusId={status.id} // truyền component để lấy task tương ứng
                            isOpen={openColumnId === status.id} //Kiểm tra cột hiện tại có mở hay không
                          />
                          <div className="p-1 rounded shadow-sm border border-dashed border-gray-300 text-sm text-gray-500 flex justify-center">
                            <button onClick={() => handleClickPlus(status.id)}>
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

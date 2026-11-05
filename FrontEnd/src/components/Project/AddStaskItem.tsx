import { useState } from "react";
import { AddTaskItem } from "../../services/TaskItemService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { GrFormSchedule } from "react-icons/gr";


function AddStatusItem({ statusId }: { statusId: number }) {
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("Task");
  const [degree, setDegree] = useState("Thấp");
  const [createdAt, setCreatedAt] = useState<Date | null>(new Date());

  async function handleAdd() {
    if (!title.trim() || !createdAt) {
      return;
    }
    const result = await AddTaskItem(title, createdAt.toLocaleDateString("sv-SE"), workType, degree, statusId);
    if (result.success) {
      toast.success("Thêm thành công");
      setTitle("");
      setWorkType("");
      setDegree("")
    } else {
      toast.error("Thêm thất bại")
    }
  }


  return (
    <div className="w-full rounded-lg border-2 border-blue-500 bg-white p-3">
      <textarea
        className="h-16 w-full resize-none text-sm outline-none"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="rounded text-green-700 outline-none"
          >
            <option value="Task">Task</option>
            <option value="Bug">Bug</option>
            <option value="Story">Story</option>
          </select>

          <DatePicker
            selected={createdAt}
            onChange={(d: Date | null) => setCreatedAt(d)}
            showTimeSelect
            dateFormat="dd/MM/yyyy HH:mm"
            customInput={
              <button>
                  <GrFormSchedule size={22} />
              </button>
            }
          />

          <select
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="ml-4 text-xs outline-none"
          >
            <option value="Thấp">Thấp</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Cao">Cao</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs text-gray-500 hover:bg-green-200"
        >
          ↵
        </button>
      </div>
    </div>
  );
}


export default AddStatusItem;
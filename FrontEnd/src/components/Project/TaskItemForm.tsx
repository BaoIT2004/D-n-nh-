import { useEffect, useState } from "react";
import { AddTaskItem } from "../../services/TaskItemService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { GrFormSchedule } from "react-icons/gr";
import { GetAllTaskItems } from "../../services/TaskItemService";
import { useParams } from "react-router-dom";
import type { GetAllTaskItem } from "../../types/TaskITem";



function TaskItemForm({ task }: { task: { title: string; workType: string; degree: string; createdAt: Date } }) {
  const [title, setTitle] = useState("");
  const [workType, setWorkType] = useState("Task");
  const [degree, setDegree] = useState("Thấp");
  const [createdAt, setCreatedAt] = useState<Date | null>(new Date());
  const { id: statusId } = useParams();
  const [taskItme, setTaskItem] = useState<GetAllTaskItem[]>([]);

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


  return (
    <div>
      {taskItme.map((task) => (
        <div key={task.id}>
          <div className="w-full rounded-lg border-2 border-blue-500 bg-white p-3">
            <textarea
              className="h-16 w-full resize-none text-sm outline-none"
              placeholder="What needs to be done?"
              value={task.title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <select
                  value={task.workType}
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
                  value={task.degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="ml-4 text-xs outline-none"
                >
                  <option value="Thấp">Thấp</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Cao">Cao</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}


export default TaskItemForm;
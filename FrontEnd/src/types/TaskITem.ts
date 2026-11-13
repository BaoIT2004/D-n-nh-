export type AddTaskItem = {
  id: number;
  title: string;
  createdAt: string;
  status: string;
  workType: string;
  degree: string;
  parentId: number | null;
};

export type GetAllTaskItem = {
  statusName: string;
  assigneeEmail: string;
  id: number;
  title: string;
  createdAt: string;
  status: string;
  workType: string;
  degree: string;
  parentId: number | null;
};

export type UpdateTaskItemResponse = {
  id: number;
  title: string;
  createdAt: string;
  dueDate: string | null;
  workType: string;
  degree: string;
  statusId: number;
};

export type TaskItemSubtask = {
  id: number;
  title: string;
  createdAt: string;
  status: string;
  workType: string;
  degree: string;
  parentId: number | null;
  assigneeId: number | null;
  assigneeEmail: string | null;
};

export type TaskItemDetail = {
  id: number;
  title: string;
  createdAt: string;
  dueDate: string | null;
  workType: string;
  degree: string;
  statusId: number;
  projectId: number;
  createdByEmail: string;
  parentId: number | null;
  subTasks: TaskItemSubtask[];
  assigneeId: number | null;
  assigneeEmail: string | null;
};

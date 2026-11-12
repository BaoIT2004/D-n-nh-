export type AddTaskItem = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
};

export type GetAllTaskItem = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
};

export type UpdateTaskItem = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
  statusId: number;
};

export type UpdateTaskItemResponse = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
  statusId: number;
};

export type TaskItemDetail = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
  statusId: number;
  projectId: number;
  assigneeId: number | null;
  assigneeEmail: string | null;
  createdByEmail: string | null;
};

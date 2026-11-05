export type AddTaskItem = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
};

export type GetAllTaskItem = {
  statusId: number;
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
};

export type UpdateTaskItemResponse = {
  id: number;
  title: string;
  createdAt: string;
  workType: string;
  degree: string;
};


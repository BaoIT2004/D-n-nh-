export type Project = {
  id: number;
  nameProject: string;
  email: string;
  status: string;
  createdAt: string;
  userId: number;
};

export type ProjectResponse = {
  nameProject: string;
  status: string;
};

export type MemberResponse = {
  userId: number;
};

export type UpdateProject = {
  projectId: number;
  nameProject: string;
  status: string;
};

export type StatusTask = {
  id: number;
  status: string;
  projectId: number;
};

export type AddStatusTaskResponse = {
  id: number;
  statusTask: string;
  projectId: number;
};

export type GetAllStatusTask = {
  id: number;
  status: string;
  projectId: number;
  position: number;
};

export type AddMemberResponse = {
  projectId: number;
};

export type ReorderStatus = {
  ids: number[]; // trả về mảng các danh sách id thay đổi
};

export type ReorderStatusResponse = {
  ids: number[];
};

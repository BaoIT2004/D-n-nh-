export type TaskAttachment = {
  id: number;
  fileName: string;
  uploadedAt: string; // DateTimeOffset được serialize thành chuỗi ISO
  contentType: string;
  taskItemId: number;
};

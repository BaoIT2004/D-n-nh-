export type AddTaskItemResquest = {
    id: number;
    title: string;
    createdAt: string;
    workType: string;
    degree: string;
};

export type GetAllTaskItemResponse = {
    title: string;
    createdAt: string;
    workType: string;
    degree: string;
}
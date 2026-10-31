export type Project = {
    id: number;
    nameProject: string;
    status: string;
    createdAt: string;
    userId: number;
};

export type ProjectResponse = {
    nameProject: string;
    status: string;
};

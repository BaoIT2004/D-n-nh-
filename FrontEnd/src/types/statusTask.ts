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

export type GetAllStatusTaask = {
    id: number;
    status: string;
    projectId: number;
}


export type AddMemberResponse = {
    projectId:number;
}
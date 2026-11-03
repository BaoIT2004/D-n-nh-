export type Post = {
    id: number;
    title: string;
};

export const postsService = {
    async getAll(): Promise<Post[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        throw new Error("Lỗi thử nghiệm từ postsService");
    },
};

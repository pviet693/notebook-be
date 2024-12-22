import { BlogStatus } from "@/types/BlogStatus";

export type BlogCreate = {
    status: BlogStatus;
    bannerUrl: string;
    title: string;
    description: string;
    categories: string[];
    jsonContent: object;
    htmlContent: string;
    userId: string;
    readTime: number;
};

export type BlogEdit = BlogCreate & {
    id: string;
};

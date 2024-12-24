import { z } from "zod";

import type { BlogEdit, BlogCreate } from "@/types/Blog";
import { BlogStatus } from "@/types/BlogStatus";

class BlogValidator {
    public static validateCreate(data: BlogCreate) {
        const createSchema = z.object({
            status: z.nativeEnum(BlogStatus),
            bannerUrl: z.string().min(1, "Banner is required"),
            title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
            description: z
                .string()
                .min(1, "Description is required")
                .max(500, "Description must be at most 500 characters"),
            categories: z.array(z.string()).min(1, "Tags is required").max(3, "You can select up to 3 tags only"),
            jsonContent: z.instanceof(Object),
            htmlContent: z.string().min(1, "Content is required"),
            userId: z.string().min(1, "UserId is required"),
            readTime: z.number()
        });

        return createSchema.safeParse(data);
    }

    public static validateEdit(data: BlogEdit) {
        const editSchema = z.object({
            id: z.string().min(1, "Id is required"),
            status: z.nativeEnum(BlogStatus),
            bannerUrl: z.string().min(1, "Banner is required"),
            title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
            description: z
                .string()
                .min(1, "Description is required")
                .max(500, "Description must be at most 500 characters"),
            categories: z.array(z.string()).min(1, "Tags is required").max(3, "You can select up to 3 tags only"),
            jsonContent: z.instanceof(Object),
            htmlContent: z.string().min(1, "Content is required"),
            userId: z.string().min(1, "UserId is required"),
            readTime: z.number()
        });

        return editSchema.safeParse(data);
    }
}

export default BlogValidator;

import { z } from "zod";

import { type CategoryCreate } from "@/types/CategoryCreate";
import { normalizeString } from "@/utils/normalizeString";

class CategoryValidator {
    public static validateCreate(data: CategoryCreate) {
        const createSchema = z.object({
            name: z
                .string()
                .min(1, "Name is required")
                .min(3, "Name must be at least 3 characters long")
                .max(255, "Name must not exceed 255 characters")
                .transform(normalizeString)
        });

        return createSchema.safeParse(data);
    }
}

export default CategoryValidator;

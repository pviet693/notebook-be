import { z } from "zod";

import { NotificationCreate } from "@/types/NotificationCreate";
import { NotificationType } from "@/types/NotificationType";

class NotificationValidator {
    public static validateCreate(data: NotificationCreate) {
        const createSchema = z.object({
            senderId: z.string().min(1, "Sender is required"),
            userId: z.string().min(1, "User is required"),
            type: z.nativeEnum(NotificationType),
            message: z.string().min(1, "Message is required"),
            blogId: z.string().optional().nullable()
        });

        return createSchema.safeParse(data);
    }
}

export default NotificationValidator;

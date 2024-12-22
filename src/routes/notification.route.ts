import express from "express";

import { NotificationController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.get("/get-all", authHandler, NotificationController.getNotificationsPagination);
router.get("/unread-count", authHandler, NotificationController.unreadCount);
router.post("/mark-as-read", authHandler, NotificationController.markAsRead);
router.post("/mark-all-as-read", authHandler, NotificationController.markAllAsRead);

export default router;

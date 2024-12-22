import express from "express";

import { LikeController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.post("/like-blog", authHandler, LikeController.likeBlog);
router.get("/has-liked-blog", authHandler, LikeController.hasLikedBlog);
router.get("/count-likes", LikeController.countLikes);

export default router;

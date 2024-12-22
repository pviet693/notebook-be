import express from "express";

import { CommentController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.get("/get-parent-comments/:blogId", CommentController.getParentComments);
router.get("/get-child-comments/:commentId", CommentController.getChildComments);
router.get("/count-comments/:blogId", CommentController.countComments);
router.post("/add-comment", authHandler, CommentController.addComment);
router.post("/edit-comment", authHandler, CommentController.editComment);
router.post("/delete-comment/:commentId", authHandler, CommentController.deleteComment);

export default router;

import express from "express";

import { BlogController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.get("/get-all", BlogController.getBlogsPagination);
router.get("/get-dashboard-blogs", authHandler, BlogController.getDashboardBlogs);
router.post("/create", authHandler, BlogController.createBlog);
router.put("/edit", authHandler, BlogController.editBlog);
router.get("/get-details/:slug", BlogController.getBlogDetails);
router.get("/get-details-by-id/:id", authHandler, BlogController.getBlogDetailsById);
router.get("/blogs-by-username", BlogController.getBlogsByUsername);

export default router;

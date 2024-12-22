import express from "express";

import { CategoryController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.get("/get-all", CategoryController.getAllCategories);
router.post("/create", authHandler, CategoryController.createCategory);
router.get("/top-categories", CategoryController.getTopCategories);

export default router;

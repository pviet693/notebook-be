import express from "express";

import { AIController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.post("/generate", authHandler, AIController.generate);

export default router;

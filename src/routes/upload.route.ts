import express from "express";
import multer from "multer";

import { UploadController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authHandler, upload.single("file"), UploadController.upload);

export default router;

import express from "express";

import { UserController } from "@/controllers";
import authHandler from "@/middlewares/authHandler";

const router = express.Router();

router.post("/sign-in", UserController.signIn);
router.post("/sign-up", UserController.signUp);
router.post("/google-sign-in", UserController.googleSignIn);
router.post("/google-sign-up", UserController.googleSignUp);
router.post("/request-otp-reset-password", UserController.requestOTP);
router.post("/verify-otp-reset-password", UserController.verifyOTP);
router.post("/reset-password", UserController.forgotPassword);
router.post("/request-otp-change-password", authHandler, UserController.requestOTP);
router.post("/verify-otp-change-password", authHandler, UserController.verifyOTP);
router.put("/change-password", authHandler, UserController.changePassword);
router.put("/edit-profile", authHandler, UserController.editProfile);
router.get("/me", authHandler, UserController.getMe);
router.get("/top-authors", UserController.getTopAuthors);
router.get("/get-by-username/:username", UserController.getAuthorByUsername);
router.get("/get-all", UserController.getAllAuthors);

export default router;

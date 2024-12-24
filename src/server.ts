import cors from "cors";
import express from "express";
import http from "http";

import { setupSocket } from "@/configs/socket.config";
import { notFoundHandler, errorHandler } from "@/middlewares";
import {
    blogRouter,
    categoryRouter,
    likeRouter,
    uploadRouter,
    userRouter,
    notificationRouter,
    commentRouter,
    statsRouter
} from "@/routes";

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true // Allowed cookies or authentication headers
};

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));

// socket io instance
app.set("io", io);

// routes
app.use("/api/upload", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/likes", likeRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/comments", commentRouter);
app.use("/api/stats", statsRouter);

// error handler middleware
app.use(errorHandler);

// not found handler middleware
app.use(notFoundHandler);

export default server;

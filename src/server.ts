import cors, { CorsOptions } from "cors";
import express from "express";
import http from "http";
import redoc from "redoc-express";
import { Ioption } from "redoc-express/dist/redoc-html-template";

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
    statsRouter,
    aiRouter
} from "@/routes";

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
const whitelist = ["http://localhost:5173", "https://notebook.io.vn"];
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if ((origin && whitelist.indexOf(origin) !== -1) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
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

// api docs
app.get("/api-docs/swagger.json", (req, res) => {
    res.sendFile("./src/swagger/index.json", { root: "." });
});
const redocOptions: Ioption = {
    title: "Notebook API Documentation",
    specUrl: "/api-docs/swagger.json"
};
app.get("/api-docs", redoc(redocOptions));

// routes
app.use("/api/upload", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/likes", likeRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/comments", commentRouter);
app.use("/api/stats", statsRouter);
app.use("/api/ai", aiRouter);

// error handler middleware
app.use(errorHandler);

// not found handler middleware
app.use(notFoundHandler);

export default server;

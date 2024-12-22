import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export const setupSocket = (server: HttpServer) => {
    const io = new Server(server, {
        transports: ["websocket", "polling"],
        // pingInterval: 10000,
        // pingTimeout: 5000,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const notificationNamespace = io.of("/notifications");

    notificationNamespace.on("connection", (socket) => {
        console.log(`User connected to notifications: ${socket.id}`);

        socket.on("joinRoom", (userId: string) => {
            console.log(`User ${socket.id} joined room notifications: ${userId}`);
            socket.join(userId);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected from notifications: ${socket.id}`);
        });
    });

    const commentNamespace = io.of("/comments");

    commentNamespace.on("connection", (socket) => {
        console.log(`User connected to comments: ${socket.id}`);

        socket.on("joinRoom", (blogId: string) => {
            console.log(`User ${socket.id} joined room comments: ${blogId}`);
            socket.join(blogId);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected from comments: ${socket.id}`);
        });
    });

    return io;
};

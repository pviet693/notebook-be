import sequelize from "@/configs/database.config";
import { envConfig } from "@/configs/env.config";
import Blog from "@/models/Blog";
import BlogCategory from "@/models/BlogCategory";
import BlogRead from "@/models/BlogRead";
import Category from "@/models/Category";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Notification from "@/models/Notification";
import User from "@/models/User";
import server from "@/server";

sequelize
    .sync()
    .then(() => {
        User.associate();
        Blog.associate();
        Category.associate();
        BlogCategory.associate();
        Like.associate();
        Notification.associate();
        Comment.associate();
        BlogRead.associate();

        server.listen(envConfig?.PORT, () => {
            console.log(`Server is running on http://localhost:${envConfig?.PORT}`);
        });
    })
    .catch((err: Error) => {
        console.error("Unable to connect to the database:", err);
    });

import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import Notification from "@/models/Notification";
import User from "@/models/User";

interface CommentAttributes {
    id?: string;
    comment: string;
    userId: string;
    blogId: string;
    parentCommentId?: string | null;
}

type CommentCreationAttributes = Optional<CommentAttributes, "id" | "parentCommentId">;

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id?: string;
    public comment!: string;
    public userId!: string;
    public blogId!: string;
    public parentCommentId?: string | null;

    // define relationships
    static associate() {
        // Comment belongs to one User (each comment is written by one user)
        Comment.belongsTo(User, {
            foreignKey: "userId",
            as: "user"
        });

        // Comment belongs to one Blog (each comment is related to one blog)
        Comment.belongsTo(Blog, {
            foreignKey: "blogId",
            as: "blog"
        });

        // Comment can have many replies (self-referencing relationship)
        Comment.hasMany(Comment, {
            foreignKey: "parentCommentId",
            as: "replies"
        });

        // Comment can optionally belong to another comment (for replies)
        Comment.belongsTo(Comment, {
            foreignKey: "parentCommentId",
            as: "parentComment"
        });

        Comment.hasMany(Notification, { foreignKey: "parentCommentId", as: "parentNotifications" });

        Comment.hasMany(Notification, { foreignKey: "replyCommentId", as: "replyNotifications" });
    }
}

Comment.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        blogId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        parentCommentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "comments",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        sequelize,
        tableName: "comments",
        modelName: "Comment",
        timestamps: true
    }
);

export default Comment;

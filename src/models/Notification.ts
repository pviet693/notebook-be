import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { NotificationType } from "@/types/NotificationType";

interface NotificationAttributes {
    id?: string;
    senderId?: string;
    userId: string;
    type: string;
    message: string;
    blogId?: string;
    parentCommentId?: string;
    replyCommentId?: string;
    hasRead: boolean;
}

export type NotificationCreationAttributes = Optional<NotificationAttributes, "id">;

class Notification
    extends Model<NotificationAttributes, NotificationCreationAttributes>
    implements NotificationAttributes
{
    public id?: string;
    public senderId?: string;
    public userId!: string; // receiver
    public type!: string;
    public message!: string;
    public blogId?: string;
    public parentCommentId?: string;
    public replyCommentId?: string;
    public hasRead!: boolean;

    // define associations
    static associate() {
        Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
        Notification.belongsTo(User, { foreignKey: "senderId", as: "sender" });
        Notification.belongsTo(Blog, { foreignKey: "blogId", as: "blog" });
        Notification.belongsTo(Comment, { foreignKey: "parentCommentId", as: "parentComment" });
        Notification.belongsTo(Comment, { foreignKey: "replyCommentId", as: "replyComment" });
    }
}

// Initialize the Notification model
Notification.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        senderId: {
            type: DataTypes.UUID,
            references: {
                model: "users",
                key: "id"
            },
            allowNull: true
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: "users",
                key: "id"
            },
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(NotificationType.LIKE, NotificationType.COMMENT, NotificationType.REPLY),
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blogId: {
            type: DataTypes.UUID,
            references: {
                model: "blogs",
                key: "id"
            },
            allowNull: true
        },
        parentCommentId: {
            type: DataTypes.UUID,
            references: {
                model: "comments",
                key: "id"
            },
            allowNull: true,
            onDelete: "CASCADE"
        },
        replyCommentId: {
            type: DataTypes.UUID,
            references: {
                model: "comments",
                key: "id"
            },
            allowNull: true,
            onDelete: "CASCADE"
        },
        hasRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "notifications",
        modelName: "Notification",
        timestamps: true
    }
);

export default Notification;

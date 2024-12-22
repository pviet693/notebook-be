import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import User from "@/models/User";

interface LikeAttributes {
    id: string;
    userId: string;
    blogId: string;
    isLiked: boolean;
}

type LikeCreationAttributes = Optional<LikeAttributes, "id">;

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
    public id!: string;
    public userId!: string;
    public blogId!: string;
    public isLiked!: boolean;

    static associate() {
        Like.belongsTo(Blog, { foreignKey: "blogId", as: "blog" });
        Like.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
}

// Initialize Like model
Like.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },
        blogId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "blogs",
                key: "id"
            }
        },
        isLiked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        tableName: "likes",
        modelName: "Like",
        timestamps: true
    }
);

export default Like;

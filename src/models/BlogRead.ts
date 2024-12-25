import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";

interface BlogReadAttributes {
    id?: string;
    date: string;
    readCount: number;
    blogId: string;
}

type BlogReadCreationAttributes = Optional<BlogReadAttributes, "readCount">;

class BlogRead extends Model<BlogReadAttributes, BlogReadCreationAttributes> implements BlogReadAttributes {
    public id?: string;
    public date!: string;
    public readCount!: number;
    public blogId!: string;

    static associate() {
        BlogRead.belongsTo(Blog, { foreignKey: "blogId", as: "blog" });
    }
}

BlogRead.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        readCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        blogId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "blogs",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        sequelize,
        tableName: "blog_read",
        modelName: "BlogReadStats",
        timestamps: false
    }
);

export default BlogRead;

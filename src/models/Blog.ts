import { DataTypes, Model, Optional } from "sequelize";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

import sequelize from "@/configs/database.config";
import BlogCategory from "@/models/BlogCategory";
import BlogRead from "@/models/BlogRead";
import Category from "@/models/Category";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { BlogStatus } from "@/types/BlogStatus";

interface BlogAttributes {
    id?: string;
    status: BlogStatus;
    slug?: string;
    bannerUrl: string;
    title: string;
    description: string;
    categories?: string[];
    htmlContent: string;
    jsonContent: object;
    userId?: string;
    readTime: number;
    createdAt?: string;
}

type BlogCreationAttributes = Optional<BlogAttributes, "id">;

class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
    public id?: string;
    public slug?: string;
    public status!: BlogStatus;
    public bannerUrl!: string;
    public title!: string;
    public description!: string;
    public categories?: string[];
    public htmlContent!: string;
    public jsonContent!: object;
    public userId?: string;
    public readTime!: number;

    // Generate slug based on the title
    static generateSlug(title: string): string {
        return slugify(title, { lower: true, strict: true }) + "-" + uuidv4();
    }

    // define relationships
    static associate() {
        Blog.belongsTo(User, { foreignKey: "userId", as: "user" });
        Blog.belongsToMany(Category, {
            through: BlogCategory,
            foreignKey: "blogId",
            otherKey: "categoryId",
            as: "categories"
        });
        Blog.hasMany(Like, { foreignKey: "blogId", as: "likes" });
        Blog.hasMany(Notification, { foreignKey: "blogId", as: "notifications" });
        Blog.hasMany(Comment, { foreignKey: "blogId", as: "comments" });
        Blog.hasMany(BlogRead, { foreignKey: "blogId", as: "read" });
    }
}

// Initialize Blog model
Blog.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        status: {
            type: DataTypes.ENUM(BlogStatus.DRAFT, BlogStatus.PUBLISHED),
            allowNull: false,
            defaultValue: BlogStatus.DRAFT
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 150]
            }
        },
        bannerUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 100]
            }
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        htmlContent: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        jsonContent: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: "users",
                key: "id"
            }
        },
        readTime: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: "blogs",
        modelName: "Blog",
        timestamps: true
    }
);

export default Blog;

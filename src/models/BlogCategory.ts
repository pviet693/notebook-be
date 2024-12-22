import { DataTypes, Model } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import Category from "@/models/Category";

export class BlogCategory extends Model {
    public blogId!: string;
    public categoryId!: string;

    static associate() {
        BlogCategory.belongsTo(Blog, { foreignKey: "blogId", as: "blog" });

        BlogCategory.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
    }
}

BlogCategory.init(
    {
        blogId: {
            type: DataTypes.UUID,
            references: {
                model: "blogs",
                key: "id"
            },
            allowNull: false
        },
        categoryId: {
            type: DataTypes.UUID,
            references: {
                model: "categories",
                key: "id"
            },
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "BlogCategory",
        tableName: "blog_category",
        timestamps: false
    }
);

export default BlogCategory;

import { DataTypes, Model, Optional } from "sequelize";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import BlogCategory from "@/models/BlogCategory";

interface CategoryAttributes {
    id?: string;
    name: string;
    description?: string;
    slug?: string;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, "id" | "description" | "slug">;

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id?: string;
    public name!: string;
    public description?: string;
    public slug?: string;

    // Generate slug based on the name
    static generateSlug(name: string): string {
        return slugify(name, { lower: true, strict: true }) + "-" + uuidv4();
    }

    // define relationships
    static associate() {
        Category.belongsToMany(Blog, {
            through: BlogCategory,
            foreignKey: "categoryId",
            otherKey: "blogId",
            as: "blogs"
        });
    }
}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 255]
            }
        },
        description: {
            type: DataTypes.STRING(500),
            defaultValue: ""
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
            defaultValue: ""
        }
    },
    {
        sequelize,
        tableName: "categories",
        modelName: "Category",
        timestamps: true
    }
);

export default Category;

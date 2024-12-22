import { StatusCodes } from "http-status-codes";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import cacheService from "@/services/cache.service";
import { AppError } from "@/types/AppError";
import { type CacheParams, CacheServiceName } from "@/types/Cache";
import { CategoryCreate } from "@/types/CategoryCreate";
import { CategoryValidator } from "@/validators";

class CategoryService {
    public static async getAllCategories() {
        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.CATEGORIES
        };

        const cachedData = await cacheService.getFromCache(cacheParams);

        if (cachedData) {
            return cachedData;
        }

        const categories = await Category.findAll();

        cacheService.setToCache(cacheParams, categories);

        return categories;
    }

    public static async getTopCategories(limit: number) {
        const topCategories = await Category.findAll({
            attributes: ["id", "name", [sequelize.fn("COUNT", sequelize.col("blogs.id")), "categoryCount"]],
            include: {
                model: Blog,
                as: "blogs",
                through: { attributes: [] },
                attributes: []
            },
            group: ["Category.id"],
            order: [[sequelize.literal("COUNT(blogs.id)"), "DESC"]],
            limit,
            subQuery: false
        });

        return topCategories;
    }

    public static async createCategory(payload: CategoryCreate) {
        const validationResult = CategoryValidator.validateCreate(payload);

        if (!validationResult.success) {
            throw new AppError(
                "Invalid create category data",
                StatusCodes.BAD_REQUEST,
                true,
                validationResult.error.errors
            );
        }

        const { name } = payload;

        const existingCategory = await Category.findOne({
            where: {
                name
            }
        });

        if (existingCategory) {
            throw new AppError("Category Name already exists", StatusCodes.CONFLICT, true);
        }

        const slug: string = Category.generateSlug(name);

        const newCategory = await Category.create({
            name,
            slug
        });

        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.CATEGORIES
        };
        cacheService.deleteFromCache(cacheParams);

        return newCategory;
    }
}

export default CategoryService;

import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import BlogRead from "@/models/BlogRead";
import Category from "@/models/Category";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import User from "@/models/User";
import cacheService from "@/services/cache.service";
import { AppError } from "@/types/AppError";
import type { BlogCreate, BlogEdit } from "@/types/Blog";
import { BlogStatus } from "@/types/BlogStatus";
import { CacheServiceName, type CacheParams } from "@/types/Cache";
import { type PaginationQuery } from "@/types/PaginationQuery";
import BlogValidator from "@/validators/BlogValidator";

class BlogService {
    public static async getBlogsPagination(query: PaginationQuery) {
        const { page, limit, categories, excludeBlogSlug, title, authors } = query;
        const offset = (page - 1) * limit;

        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.PUBLIC_BLOGS,
            limit,
            page,
            title,
            categories,
            excludeBlogSlug,
            authors
        };

        const cachedBlogs = await cacheService.getFromCache(cacheParams);
        if (cachedBlogs) {
            return cachedBlogs;
        }

        const blogs = await Blog.findAndCountAll({
            where: {
                status: {
                    [Op.not]: BlogStatus.DRAFT
                },
                ...(excludeBlogSlug
                    ? {
                          slug: {
                              [Op.not]: excludeBlogSlug
                          }
                      }
                    : {}),
                ...(title
                    ? {
                          title: {
                              [Op.iLike]: `%${title}%`
                          }
                      }
                    : {})
            },
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] },
                    ...(categories && categories.length > 0
                        ? {
                              where: {
                                  slug: {
                                      [Op.in]: categories
                                  }
                              }
                          }
                        : {})
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"],
                    ...(authors && authors.length > 0
                        ? {
                              where: {
                                  username: {
                                      [Op.in]: authors
                                  }
                              }
                          }
                        : {})
                }
            ],
            attributes: { exclude: ["jsonContent", "htmlContent"] },
            limit, // Limit the number of blogs returned per page
            offset, // Skip records based on page
            order: [
                ["updatedAt", "DESC"] // Sort by updatedAt in descending order
            ],
            distinct: true
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(blogs.count / limit);

        const returnedData = {
            page,
            limit,
            totalPages,
            total: blogs.count,
            data: blogs.rows
        };

        // Cache the retrieved data for later use
        cacheService.setToCache(cacheParams, returnedData);

        return returnedData;
    }

    public static async getDashboardBlogs(query: PaginationQuery, userId: string) {
        const { page, limit, categories, title, statuses } = query;
        const offset = (page - 1) * limit;

        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.PRIVATE_BLOGS,
            page,
            limit,
            userId,
            title,
            categories,
            statuses
        };

        // Check if the cache exists for the given parameters
        const cachedBlogs = await cacheService.getFromCache(cacheParams);
        if (cachedBlogs) {
            return cachedBlogs;
        }

        const where = {
            userId,
            ...(statuses && statuses.length > 0
                ? {
                      status: {
                          [Op.in]: statuses
                      }
                  }
                : {}),
            ...(title
                ? {
                      title: {
                          [Op.iLike]: `%${title}%`
                      }
                  }
                : {})
        };

        const blogs = (await Blog.findAll({
            where,
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] },
                    ...(categories && categories.length > 0
                        ? {
                              where: {
                                  slug: {
                                      [Op.in]: categories
                                  }
                              }
                          }
                        : {})
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                }
            ],
            attributes: { exclude: ["jsonContent", "htmlContent"] },
            limit,
            offset,
            order: [["updatedAt", "DESC"]]
        })) as (Blog & {
            likeCount: number;
            commentCount: number;
            readCount: number;
        })[];

        const blogIds = blogs.map((blog) => blog.id!);

        const likesCount = (await Like.findAll({
            where: { blogId: { [Op.in]: blogIds } },
            attributes: [
                "blogId",
                [sequelize.cast(sequelize.fn("COUNT", sequelize.col("id")), "INTEGER"), "likeCount"]
            ],
            group: ["blogId"]
        })) as { dataValues: { blogId: string; likeCount?: number } }[];

        const commentsCount = (await Comment.findAll({
            where: { blogId: { [Op.in]: blogIds } },
            attributes: [
                "blogId",
                [sequelize.cast(sequelize.fn("COUNT", sequelize.col("id")), "INTEGER"), "commentCount"]
            ],
            group: ["blogId"]
        })) as { dataValues: { blogId: string; commentCount?: number } }[];

        const readsCount = (await BlogRead.findAll({
            where: { blogId: { [Op.in]: blogIds } },
            attributes: [
                "blogId",
                [sequelize.cast(sequelize.fn("COUNT", sequelize.col("blogId")), "INTEGER"), "readCount"]
            ],
            group: ["blogId"]
        })) as { dataValues: { blogId: string; readCount?: number } }[];

        const blogsWithCount = blogs.map((blog) => {
            const likeCount = likesCount.find((like) => like.dataValues.blogId === blog.id)?.dataValues?.likeCount ?? 0;
            const commentCount =
                commentsCount.find((comment) => comment.dataValues.blogId === blog.id)?.dataValues?.commentCount ?? 0;
            const readCount = readsCount.find((read) => read.dataValues.blogId === blog.id)?.dataValues?.readCount ?? 0;

            return {
                ...blog.toJSON(),
                likeCount,
                commentCount,
                readCount
            };
        });

        const total = await Blog.count({ where });

        // Calculate the total number of pages
        const totalPages = Math.ceil(total / limit);

        const returnedData = {
            page,
            limit,
            totalPages,
            total,
            data: blogsWithCount
        };

        // Cache the retrieved data for future use
        cacheService.setToCache(cacheParams, returnedData);

        return returnedData;
    }

    public static async getBlogsByUsername(query: PaginationQuery) {
        const { page, limit, username } = query;
        const offset = (page - 1) * limit;

        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.AUTHOR_BLOGS,
            page,
            limit,
            username
        };

        // Check if the cache exists for the given parameters
        const cachedBlogs = await cacheService.getFromCache(cacheParams);
        if (cachedBlogs) {
            return cachedBlogs;
        }

        const blogs = await Blog.findAndCountAll({
            where: {
                status: BlogStatus.PUBLISHED
            },
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"],
                    where: {
                        username: username
                    }
                }
            ],
            attributes: { exclude: ["jsonContent", "htmlContent"] },
            limit,
            offset,
            order: [["updatedAt", "DESC"]],
            distinct: true
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(blogs.count / limit);

        const returnedData = {
            page,
            limit,
            totalPages,
            total: blogs.count,
            data: blogs.rows
        };

        // Cache the retrieved data for future use
        cacheService.setToCache(cacheParams, returnedData);

        return returnedData;
    }

    public static async createBlog(payload: BlogCreate) {
        const validationResult = BlogValidator.validateCreate(payload);

        if (!validationResult.success) {
            throw new AppError(
                "Invalid create blog data",
                StatusCodes.BAD_REQUEST,
                true,
                validationResult.error.errors
            );
        }

        const { userId, title, description, categories, jsonContent, htmlContent, bannerUrl, status, readTime } =
            payload;

        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            throw new AppError("User does not exists", StatusCodes.NOT_FOUND, true);
        }

        const slug: string = Blog.generateSlug(title);

        const newBlog = await Blog.create({
            status,
            bannerUrl,
            title,
            slug,
            description,
            jsonContent,
            htmlContent,
            userId,
            readTime
        });

        const categoryObjs = await Category.findAll({
            where: {
                id: categories
            }
        });

        // @ts-expect-error: Should no error here
        await newBlog.setCategories(categoryObjs);

        const responseBlog = await Blog.findOne({
            where: { id: newBlog.id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                },
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] }
                }
            ]
        });

        if (!responseBlog) {
            throw new AppError("Blog not found after creation", StatusCodes.NOT_FOUND, true);
        }

        cacheService.deleteKeysWithPrefixFromCache(CacheServiceName.PUBLIC_BLOGS);
        cacheService.deleteKeysWithPrefixFromCache(CacheServiceName.PRIVATE_BLOGS);

        return responseBlog;
    }

    public static async editBlog(payload: BlogEdit) {
        const validationResult = BlogValidator.validateEdit(payload);

        if (!validationResult.success) {
            throw new AppError("Invalid edit blog data", StatusCodes.BAD_REQUEST, true, validationResult.error.errors);
        }

        const { id, userId, title, description, categories, jsonContent, htmlContent, bannerUrl, status, readTime } =
            payload;

        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            throw new AppError("User does not exists", StatusCodes.NOT_FOUND, true);
        }

        const slug: string = Blog.generateSlug(title);

        const existingBlog = await Blog.findByPk(id);

        if (!existingBlog) {
            throw new AppError("Blog does not exists", StatusCodes.NOT_FOUND, true);
        }

        const oldSlug = existingBlog.slug;
        existingBlog.status = status;
        existingBlog.bannerUrl = bannerUrl;
        existingBlog.title = title;
        existingBlog.slug = slug;
        existingBlog.description = description;
        existingBlog.jsonContent = jsonContent;
        existingBlog.htmlContent = htmlContent;
        existingBlog.readTime = readTime;
        await existingBlog.save();

        const categoryObjs = await Category.findAll({
            where: {
                id: categories
            }
        });

        // @ts-expect-error: Should no error here
        await existingBlog.setCategories(categoryObjs);

        const responseBlog = await Blog.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                },
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] }
                }
            ]
        });

        if (!responseBlog) {
            throw new AppError("Blog not found after editing", StatusCodes.NOT_FOUND, true);
        }

        // remove cache
        const cacheParamsId: CacheParams = {
            serviceName: CacheServiceName.BLOG_DETAILS,
            id: id
        };
        const cacheParamsSlug: CacheParams = {
            serviceName: CacheServiceName.BLOG_DETAILS,
            slug: oldSlug
        };
        cacheService.deleteFromCache(cacheParamsId);
        cacheService.deleteFromCache(cacheParamsSlug);
        cacheService.deleteKeysWithPrefixFromCache(CacheServiceName.PUBLIC_BLOGS);
        cacheService.deleteKeysWithPrefixFromCache(CacheServiceName.PRIVATE_BLOGS);

        return responseBlog;
    }

    public static async getBlogDetails(blogSlug: string) {
        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.BLOG_DETAILS,
            slug: blogSlug
        };
        const cachedData = await cacheService.getFromCache(cacheParams);

        if (cachedData) {
            return cachedData;
        }

        const blog = await Blog.findOne({
            where: {
                slug: blogSlug,
                status: BlogStatus.PUBLISHED
            },
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                }
            ]
        });

        if (!blog) {
            throw new AppError("Blog not found", StatusCodes.NOT_FOUND, true);
        }

        cacheService.setToCache(cacheParams, blog);

        return blog;
    }

    public static async getBlogDetailsById(id: string) {
        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.BLOG_DETAILS,
            id
        };
        const cachedData = await cacheService.getFromCache(cacheParams);

        if (cachedData) {
            return cachedData;
        }

        const blog = await Blog.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Category,
                    as: "categories",
                    attributes: ["id", "name", "slug", "description"],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "username", "profile_img", "fullname"]
                }
            ]
        });

        if (!blog) {
            throw new AppError("Blog not found", StatusCodes.NOT_FOUND, true);
        }

        cacheService.setToCache(cacheParams, blog);

        return blog;
    }
}

export default BlogService;

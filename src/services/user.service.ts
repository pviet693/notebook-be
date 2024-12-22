import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { AppError } from "@/types/AppError";
import { type ChangePassword } from "@/types/ChangePassword";
import { EditProfile } from "@/types/EditProfile";
import { type UserSignIn } from "@/types/UserSignIn";
import { type UserSignUp } from "@/types/UserSignUp";
import { generateAccessToken, generateUserName, hashPassword } from "@/utils";
import { UserValidator } from "@/validators";
import cacheService from "@/services/cache.service";
import { CacheParams, CacheServiceName } from "@/types/Cache";

class UserService {
    public static async signUp(payload: UserSignUp) {
        const validationResult = UserValidator.validateSignUp(payload);

        if (!validationResult.success) {
            throw new AppError("Invalid sign up data", StatusCodes.BAD_REQUEST, true, validationResult.error.errors);
        }

        const { fullname, email, password } = payload;

        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if (existingUser) {
            throw new AppError("Email already exists", StatusCodes.CONFLICT, true);
        }

        const username = await generateUserName(email);
        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            username
        });

        const accessToken = generateAccessToken({
            id: newUser.id as string,
            email: newUser.email
        });

        cacheService.deleteFromCache({ serviceName: CacheServiceName.USERS });

        const { password: _, ...rest } = newUser.dataValues;

        return {
            accessToken,
            user: rest
        };
    }

    public static async signIn(payload: UserSignIn) {
        const validationResult = UserValidator.validateSignIn(payload);

        if (!validationResult.success) {
            throw new AppError("Invalid sign in data", StatusCodes.BAD_REQUEST, true, validationResult.error.errors);
        }

        const { email, password } = payload;

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED, true);
        }

        const isPasswordMatch = await user.validatePassword(password);

        if (!isPasswordMatch) {
            throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED, true);
        }

        const accessToken = generateAccessToken({
            id: user.id as string,
            email: user.email
        });

        const { password: _, ...rest } = user.dataValues;

        return {
            accessToken,
            user: rest
        };
    }

    public static async changePassword(payload: ChangePassword, userId: string) {
        const validationResult = UserValidator.validateChangePassword(payload);

        if (!validationResult.success) {
            throw new AppError(
                "Invalid change password data",
                StatusCodes.BAD_REQUEST,
                true,
                validationResult.error.errors
            );
        }

        const { currentPassword, newPassword } = payload;

        const user = await User.findByPk(userId);

        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND, true);
        }

        const isPasswordMatch = await user.validatePassword(currentPassword);

        if (!isPasswordMatch) {
            throw new AppError("Invalid current password", StatusCodes.UNAUTHORIZED, true);
        }

        const hashedPassword = await hashPassword(newPassword);

        await user.update({ password: hashedPassword });

        return true;
    }

    public static async editProfile(payload: EditProfile, userId: string) {
        const validationResult = UserValidator.validateEditProfile(payload);

        if (!validationResult.success) {
            throw new AppError(
                "Invalid edit profile data",
                StatusCodes.BAD_REQUEST,
                true,
                validationResult.error.errors
            );
        }

        const { fullname, bio, profile_img, username, youtube, instagram, facebook, twitter, github, website } =
            payload;

        const user = await User.findOne({
            where: {
                username: username,
                id: {
                    [Op.ne]: userId
                }
            }
        });

        if (user) {
            throw new AppError("Username already exists", StatusCodes.CONFLICT, true);
        }

        const updatedUser = await User.update(
            {
                fullname,
                username,
                bio,
                profile_img,
                youtube,
                instagram,
                facebook,
                twitter,
                github,
                website
            },
            { where: { id: userId } }
        );

        cacheService.deleteFromCache({ serviceName: CacheServiceName.USERS });
        cacheService.deleteFromCache({ serviceName: CacheServiceName.USERS, id: userId });
        cacheService.deleteFromCache({ serviceName: CacheServiceName.USERS, username });

        return updatedUser;
    }

    public static async getMe(id: string) {
        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.USERS,
            id
        };

        const cachedData = await cacheService.getFromCache(cacheParams);

        if (cachedData) {
            return cachedData;
        }

        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND, true);
        }

        cacheService.setToCache(cacheParams, user);

        return user;
    }

    public static async getTopAuthors() {
        const authors = await User.findAll({
            attributes: [
                "id",
                "fullname",
                "username",
                "profile_img",
                "email",
                "github",
                "twitter",
                "instagram",
                "youtube",
                "facebook",
                "bio",
                [sequelize.cast(sequelize.fn("COUNT", sequelize.col("blogs.id")), "INTEGER"), "blogCount"]
            ],
            include: {
                model: Blog,
                as: "blogs",
                attributes: [],
                required: false
            },
            group: ["User.id"],
            order: [[sequelize.literal("COUNT(blogs.id)"), "DESC"]],
            limit: 3,
            subQuery: false
        });

        return authors;
    }

    public static async getAllAuthors() {
        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.USERS
        };

        const cachedData = await cacheService.getFromCache(cacheParams);

        if (cachedData) {
            return cachedData;
        }

        const authors = await User.findAll({
            attributes: ["id", "fullname", "username", "profile_img", "email"]
        });

        cacheService.setToCache(cacheParams, authors);

        return authors;
    }

    public static async getAuthorByUsername(username: string) {
        const cacheParams: CacheParams = {
            serviceName: CacheServiceName.USERS,
            username
        };

        const cachedData = await cacheService.getFromCache(cacheParams);

        if (cachedData) {
            return cachedData;
        }

        const user = await User.findOne({
            where: {
                username
            },
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND, true);
        }

        cacheService.setToCache(cacheParams, user);

        return user;
    }
}

export default UserService;

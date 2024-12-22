import bcrypt from "bcryptjs";
import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@/configs/database.config";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Notification from "@/models/Notification";
import { generateRadomProfile } from "@/utils";

interface UserAttributes {
    id?: string;
    fullname: string;
    email: string;
    password?: string;
    username: string;
    bio?: string;
    profile_img?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
    google_auth?: boolean;
    email_verified?: boolean;
    createdAt?: string;
}

type UserCreationAttributes = Optional<
    UserAttributes,
    "id" | "bio" | "profile_img" | "youtube" | "instagram" | "facebook" | "twitter" | "github" | "website" | "createdAt"
>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id?: string;
    public fullname!: string;
    public email!: string;
    public password?: string;
    public username!: string;
    public bio?: string;
    public profile_img?: string;
    public youtube?: string;
    public instagram?: string;
    public facebook?: string;
    public twitter?: string;
    public github?: string;
    public website?: string;
    public google_auth?: boolean;
    public email_verified?: boolean;

    public async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password!);
    }

    static associate() {
        User.hasMany(Blog, { foreignKey: "userId", as: "blogs" });
        User.hasMany(Like, { foreignKey: "userId", as: "likes" });
        User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
        User.hasMany(Notification, { foreignKey: "senderId", as: "sentNotifications" });
        User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 255]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 255]
            }
        },
        bio: {
            type: DataTypes.STRING(500),
            defaultValue: ""
        },
        profile_img: {
            type: DataTypes.STRING,
            defaultValue: () => generateRadomProfile()
        },
        youtube: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        instagram: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        facebook: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        twitter: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        github: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        website: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        google_auth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            validate: {
                isIn: [[true, false]]
            }
        }
    },
    {
        sequelize,
        tableName: "users",
        modelName: "User",
        timestamps: true
    }
);

export default User;

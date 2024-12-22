import { nanoid } from "nanoid";

import User from "@/models/User";

export const generateUserName = async (email: string): Promise<string> => {
    const usernameParts = email.split("@");
    const username = usernameParts[0];

    const existingUserName = await User.findOne({
        where: {
            username
        }
    });
    if (existingUserName) {
        const randomStr = nanoid(6);
        return `${username}-${randomStr}`;
    }

    return username;
};

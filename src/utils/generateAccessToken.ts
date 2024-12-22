import jwt from "jsonwebtoken";

import { envConfig } from "@/configs/env.config";
import { AccessTokenPayload } from "@/types/AccessTokenPayload";

export const generateAccessToken = (data: AccessTokenPayload): string => {
    const token = jwt.sign(data, envConfig!.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token;
};
